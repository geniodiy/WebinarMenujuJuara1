// Uji ujung-ke-ujung form pendaftaran: Chromium mengisi form, submitDaftar asli berjalan di Node
// dengan spreadsheet tiruan. Pakai: NODE_PATH=$(npm root -g) node tests/e2e-form.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const assert = require('assert');
const { chromium } = require('playwright');
const muatGas = require('./muat-gas');

const DIR_KELUAR = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-form-'));
const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'Pendaftaran.gs']);

function lembarTiruan(judul) {
  const data = [judul.slice()];
  return {
    data,
    getLastRow: () => data.length,
    getDataRange: () => ({ getValues: () => data.map((r) => r.slice()), getDisplayValues: () => data.map((r) => r.map(String)) }),
    getRange: (r, c, nr = 1, nc = 1) => ({
      setValues(vals) {
        for (let i = 0; i < nr; i++) {
          while (data.length < r + i) data.push(new Array(data[0].length).fill(''));
          for (let j = 0; j < nc; j++) data[r - 1 + i][c - 1 + j] = vals[i][j];
        }
      },
      setValue(v) { data[r - 1][c - 1] = v; },
      clearContent() {
        for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) if (data[r - 1 + i]) data[r - 1 + i][c - 1 + j] = '';
      }
    })
  };
}

let lembar = {};
let peng = {};
const cache = new Map();
function reset() {
  lembar = { Pendaftar: lembarTiruan(g.KOLOM_PENDAFTAR_), Rekap: lembarTiruan(g.KOLOM_REKAP_) };
  peng = {};
  g.PENGATURAN_AWAL_.forEach((b) => { peng[b[0]] = b[1]; });
  peng.form_pendaftaran = 'BUKA';
  peng.link_grup_wa = 'https://chat.whatsapp.com/contohgrup';
  cache.clear();
}
g.bukaDb_ = () => ({ getSheetByName: (n) => lembar[n] || null });
g.bacaPengaturan_ = () => peng;
g.CacheService = { getScriptCache: () => ({ get: (k) => cache.get(k) || null, put: (k, v) => cache.set(k, v), removeAll() {} }) };
g.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) };
g.Utilities = { formatDate: (d) => d.toISOString().replace('T', ' ').slice(0, 19) };
g.DURASI_MINIMUM_MS_ = 0;

function barisPendaftar() {
  const [judul, ...isi] = lembar.Pendaftar.data;
  return isi.map((r) => Object.fromEntries(judul.map((j, i) => [j, r[i]])));
}

const berkasHtml = path.join(DIR_KELUAR, 'form.html');
fs.writeFileSync(berkasHtml, execFileSync('node', [path.join(__dirname, 'pratinjau.js'), 'daftar', 'form']));

let putus = '';
async function halamanBaru(browser, opsi = {}) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const page = await ctx.newPage();
  const galatHalaman = [];
  page.on('pageerror', (e) => galatHalaman.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.exposeFunction('__kirimServer', (payload) => {
    const hasil = g.submitDaftar(payload);
    return JSON.parse(JSON.stringify(hasil));
  });
  await page.exposeFunction('__putus', () => putus);
  await page.addInitScript(() => {
    function runner() {
      let sukses = () => {};
      let gagal = () => {};
      const r = {
        withSuccessHandler(f) { sukses = f; return r; },
        withFailureHandler(f) { gagal = f; return r; },
        async submitDaftar(p) {
          const mode = await window.__putus();
          if (mode === 'sebelum') return setTimeout(() => gagal(new Error('putus')), 50);
          const hasil = await window.__kirimServer(p);
          setTimeout(() => (mode === 'setelah' ? gagal(new Error('putus')) : sukses(hasil)), 150);
        },
        getConfig() { sukses({ ok: false }); }
      };
      return r;
    }
    window.google = { script: { get run() { return runner(); } } };
  });
  await page.goto('file://' + berkasHtml);
  if (opsi.bersih !== false) {
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.reload();
  }
  return { page, ctx, galatHalaman };
}

const pilih = (page, teks) => page.locator('.fd-kartu', { hasText: new RegExp('^\\s*' + teks.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
const lanjut = (page) => page.locator('.fd-kaki .fd-tombol-utama').click();
const judul = (page) => page.locator('#fd-judul-langkah').textContent();
async function isiDiri(page, nama, wa) {
  await page.fill('#fd-nama', nama);
  await page.fill('#fd-wa', wa);
  await page.fill('#fd-email', 'uji@contoh.id');
  await page.fill('#fd-kota', 'Sleman');
}
async function isiPenutup(page, opsi = {}) {
  await pilih(page, 'Instagram Genio');
  await page.locator('#fd-setuju_kehadiran').check();
  if (opsi.binaan) await page.locator('#fd-setuju_siswa_binaan').check();
}
async function jalurSiswa(page, nama, wa, kelas = '3', bidang = 'IPA') {
  await pilih(page, 'Siswa');
  await lanjut(page);
  await isiDiri(page, nama, wa);
  await lanjut(page);
  await page.selectOption('#fd-kelas', kelas);
  await page.fill('#fd-asal_sekolah', 'SD Uji');
  await pilih(page, bidang);
  await pilih(page, 'Belum pernah');
  await page.locator('#fd-siswa_genio-1').check();
  await lanjut(page);
  await isiPenutup(page);
  await lanjut(page);
}
async function isiAnak(page, i, nama, kelas, bidang, wa = '') {
  const p = '#fd-anak-' + i + '-';
  await page.fill(p + 'nama', nama);
  if (wa) await page.fill(p + 'wa', wa);
  await page.selectOption(p + 'kelas', kelas);
  await page.fill(p + 'asal_sekolah', 'Sekolah Uji');
  await page.locator(p + 'bidang-' + ['Matematika', 'IPA', 'IPS'].indexOf(bidang)).check();
  await page.locator(p + 'pengalaman_osn-0').check();
  await page.locator(p + 'siswa_genio-1').check();
  await page.locator(p + 'perangkat-0').check();
}

const hasilUji = [];
async function uji(nama, fn) {
  reset();
  putus = '';
  try {
    await fn();
    hasilUji.push('ok   ' + nama);
  } catch (err) {
    hasilUji.push('GAGAL ' + nama + '\n      ' + String(err.message).split('\n').slice(0, 4).join('\n      '));
  }
}

(async () => {
  const browser = await chromium.launch();

  await uji('validasi: Lanjut tanpa isian menampilkan pesan dan fokus', async () => {
    const { page, galatHalaman } = await halamanBaru(browser);
    assert.strictEqual(await judul(page), 'Daftar sebagai');
    assert.strictEqual(await page.locator('#fd-penanda').textContent(), 'Langkah 1 dari 5');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'langkah-awal.png') });
    await lanjut(page);
    assert.strictEqual(await page.locator('#fd-daftar_sebagai-e').textContent(), 'Bagian ini perlu diisi.');
    await pilih(page, 'Siswa');
    await lanjut(page);
    await page.fill('#fd-wa', '0812');
    await page.locator('#fd-email').focus();
    assert.strictEqual(await page.locator('#fd-wa-e').textContent(), 'Nomor WhatsApp belum sesuai. Contoh: 081234567890.');
    await lanjut(page);
    assert.strictEqual(await page.evaluate(() => document.activeElement.id), 'fd-nama');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'validasi.png') });
    assert.deepStrictEqual(galatHalaman, []);
  });

  await uji('U1: siswa kelas 3 IPA', async () => {
    const { page } = await halamanBaru(browser);
    await jalurSiswa(page, 'Budi Uji', '0812 3456 7890');
    assert.strictEqual(await judul(page), 'Periksa data');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'ringkasan.png') });
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'berhasil.png') });
    const b = barisPendaftar();
    assert.strictEqual(b.length, 1);
    assert.strictEqual(b[0].room, 'SD IPA');
    assert.strictEqual(b[0].kategori, 'Siswa SD');
    assert.strictEqual(b[0].wa, '6281234567890');
    assert.ok(await page.locator('a', { hasText: 'Gabung Grup WhatsApp Peserta' }).isVisible());
    assert.strictEqual(await page.locator('.fd-kotak-id strong').textContent(), 'UJI-REG-0001');
  });

  await uji('U2: orang tua mendaftarkan 3 anak, satu tanpa WA', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Pendamping');
    await lanjut(page);
    await isiDiri(page, 'Ibu Sari', '081211112222');
    await lanjut(page);
    await pilih(page, 'Orang Tua');
    await lanjut(page);
    await pilih(page, 'Ya');
    await page.fill('#fd-jumlah', '2');
    await lanjut(page);
    assert.strictEqual(await page.locator('.fd-blok').count(), 2);
    await isiAnak(page, 0, 'Ani', '2', 'Matematika', '081233334444');
    await page.locator('.fd-blok-kepala').nth(1).click();
    await isiAnak(page, 1, 'Bima', '8', 'IPS');
    await page.click('text=Tambah siswa');
    assert.strictEqual(await page.locator('.fd-blok-judul').nth(2).textContent(), 'Siswa 3 dari 3');
    await isiAnak(page, 2, 'Cici', '5', 'IPA', '081255556666');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'blok-siswa.png') });
    await lanjut(page);
    await isiPenutup(page);
    await lanjut(page);
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    const b = barisPendaftar();
    assert.strictEqual(b.length, 4);
    assert.strictEqual(new Set(b.map((x) => x.id_pendaftaran)).size, 1);
    assert.strictEqual(b.find((x) => x.nama_lengkap === 'Bima').wa_kunci, '6281211112222');
  });

  await uji('U3: orang tua tidak mendaftarkan anak, langkah minat muncul', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Pendamping');
    await lanjut(page);
    await isiDiri(page, 'Pak Joko', '081277778888');
    await lanjut(page);
    await pilih(page, 'Orang Tua');
    await lanjut(page);
    await pilih(page, 'Tidak');
    await lanjut(page);
    assert.strictEqual(await judul(page), 'Minat anak');
    await page.locator('#fd-minat_jenjang_anak-0').check();
    await page.locator('#fd-minat_bidang_anak-3').check();
    await page.locator('#fd-anak_siswa_genio-1').check();
    await lanjut(page);
    await isiPenutup(page);
    await lanjut(page);
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    assert.strictEqual(barisPendaftar()[0].minat_bidang_anak, 'Belum menentukan');
  });

  await uji('U4: guru 12 siswa, sekolah terisi otomatis, persetujuan poin 4 wajib', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Pendamping');
    await lanjut(page);
    await isiDiri(page, 'Bu Guru', '081299990000');
    await lanjut(page);
    await pilih(page, 'Guru Pembina');
    await lanjut(page);
    await page.fill('#fd-sekolah_mengajar', 'SMP Uji Raya');
    await page.locator('#fd-jenjang_dibina-1').check();
    await page.locator('#fd-bidang_dibina-0').check();
    await lanjut(page);
    await pilih(page, 'Ya');
    await page.fill('#fd-jumlah', '12');
    await lanjut(page);
    assert.strictEqual(await page.inputValue('#fd-anak-0-asal_sekolah'), 'SMP Uji Raya');
    for (let i = 0; i < 12; i++) {
      if (i > 0) await page.locator('.fd-blok-kepala').nth(i).click();
      await isiAnak(page, i, 'Siswa ' + (i + 1), '7', 'Matematika');
    }
    await lanjut(page);
    await isiPenutup(page);
    await lanjut(page);
    assert.strictEqual(await page.locator('#fd-setuju_siswa_binaan-e').textContent(), 'Centang persetujuan ini untuk melanjutkan.');
    await page.locator('#fd-setuju_siswa_binaan').check();
    await lanjut(page);
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    assert.strictEqual(barisPendaftar().length, 13);
  });

  await uji('U6: siswa yang sama mendaftar dua kali', async () => {
    let { page } = await halamanBaru(browser);
    await jalurSiswa(page, 'Budi Uji', '081234567890');
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    ({ page } = await halamanBaru(browser));
    await jalurSiswa(page, 'budi uji', '+62 812-3456-7890');
    await lanjut(page);
    await page.waitForSelector('.fd-kotak-galat');
    assert.ok((await page.locator('.fd-kotak-galat').textContent()).includes('Peserta ini sudah terdaftar.'));
    assert.strictEqual(barisPendaftar().length, 1);
  });

  await uji('U8: pendaftaran ditutup saat halaman masih terbuka', async () => {
    const { page } = await halamanBaru(browser);
    await jalurSiswa(page, 'Budi Uji', '081234567890');
    peng.form_pendaftaran = 'TUTUP';
    await lanjut(page);
    await page.waitForSelector('.fd-kotak-galat');
    assert.ok((await page.locator('.fd-kotak-galat').textContent()).includes('Pendaftaran sudah ditutup. Hubungi Lily di 0878-3886-2882'));
    assert.strictEqual(barisPendaftar().length, 0);
  });

  await uji('U27: Pendamping (guru) lalu ganti menjadi Siswa', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Pendamping');
    await lanjut(page);
    await isiDiri(page, 'Budi Uji', '081234567890');
    await lanjut(page);
    await pilih(page, 'Guru Pembina');
    await lanjut(page);
    await page.fill('#fd-sekolah_mengajar', 'SMP Lama');
    await page.locator('#fd-jenjang_dibina-1').check();
    await page.locator('#fd-bidang_dibina-0').check();
    await lanjut(page);
    for (let i = 0; i < 4; i++) await page.locator('.fd-kaki .fd-tombol-garis').click();
    assert.strictEqual(await judul(page), 'Daftar sebagai');
    await pilih(page, 'Siswa');
    await lanjut(page);
    await lanjut(page);
    await page.selectOption('#fd-kelas', '8');
    await page.fill('#fd-asal_sekolah', 'SMP Uji');
    await pilih(page, 'IPA');
    await pilih(page, 'Belum pernah');
    await page.locator('#fd-siswa_genio-1').check();
    await lanjut(page);
    await isiPenutup(page);
    await lanjut(page);
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    const b = barisPendaftar();
    assert.strictEqual(b.length, 1);
    assert.strictEqual(b[0].peran, 'Siswa');
    assert.strictEqual(b[0].sekolah_mengajar, '');
  });

  await uji('U28: tombol kirim diketuk dua kali dengan cepat', async () => {
    const { page } = await halamanBaru(browser);
    await jalurSiswa(page, 'Budi Uji', '081234567890');
    const tombol = page.locator('.fd-kaki .fd-tombol-utama');
    await tombol.evaluate((b) => { b.click(); b.click(); });
    assert.strictEqual(await tombol.textContent(), 'Menyimpan pendaftaran…');
    await page.waitForSelector('text=Pendaftaran berhasil');
    assert.strictEqual(barisPendaftar().length, 1);
  });

  await uji('U29: koneksi putus setelah tersimpan, lalu coba kirim lagi', async () => {
    const { page } = await halamanBaru(browser);
    await jalurSiswa(page, 'Budi Uji', '081234567890');
    putus = 'setelah';
    await lanjut(page);
    await page.waitForSelector('.fd-kotak-galat');
    assert.ok((await page.locator('.fd-kotak-galat').textContent()).includes('koneksi terputus'));
    assert.strictEqual(await page.locator('.fd-kaki .fd-tombol-utama').textContent(), 'Coba kirim lagi');
    putus = '';
    await lanjut(page);
    await page.waitForSelector('text=Pendaftaran berhasil');
    assert.strictEqual(barisPendaftar().length, 1);
    assert.strictEqual(await page.locator('.fd-kotak-id strong').textContent(), 'UJI-REG-0001');
  });

  await uji('U30: kembali-maju dan muat ulang di tengah form', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Siswa');
    await lanjut(page);
    await isiDiri(page, 'Budi Uji', '081234567890');
    await lanjut(page);
    await page.selectOption('#fd-kelas', '5');
    await page.locator('.fd-kaki .fd-tombol-garis').click();
    assert.strictEqual(await page.inputValue('#fd-nama'), 'Budi Uji');
    await lanjut(page);
    assert.strictEqual(await page.inputValue('#fd-kelas'), '5');
    await page.waitForTimeout(400);
    await page.reload();
    assert.strictEqual(await judul(page), 'Data siswa');
    assert.strictEqual(await page.inputValue('#fd-kelas'), '5');
  });

  await uji('hapus siswa dan mulai ulang memakai dua ketukan', async () => {
    const { page } = await halamanBaru(browser);
    await pilih(page, 'Pendamping');
    await lanjut(page);
    await isiDiri(page, 'Ibu Sari', '081211112222');
    await lanjut(page);
    await pilih(page, 'Orang Tua');
    await lanjut(page);
    await pilih(page, 'Ya');
    await page.fill('#fd-jumlah', '2');
    await lanjut(page);
    await page.locator('.fd-blok-kepala').nth(1).click();
    await page.click('text=Hapus siswa ini');
    assert.strictEqual(await page.locator('.fd-blok').count(), 2);
    await page.click('text=Ketuk lagi untuk menghapus');
    assert.strictEqual(await page.locator('.fd-blok').count(), 1);
    await page.click('.fd-mulai-ulang');
    await page.click('.fd-mulai-ulang');
    assert.strictEqual(await judul(page), 'Daftar sebagai');
    assert.strictEqual(await page.locator('.fd-kartu.terpilih').count(), 0);
  });

  await uji('anti-bot: kiriman kurang dari 5 detik ditolak server', async () => {
    g.DURASI_MINIMUM_MS_ = 5000;
    try {
      const { page } = await halamanBaru(browser);
      await jalurSiswa(page, 'Budi Uji', '081234567890');
      await lanjut(page);
      await page.waitForSelector('.fd-kotak-galat');
      assert.strictEqual(barisPendaftar().length, 0);
    } finally {
      g.DURASI_MINIMUM_MS_ = 0;
    }
  });

  await browser.close();
  console.log(hasilUji.join('\n'));
  console.log('Tangkapan layar: ' + DIR_KELUAR);
  if (hasilUji.some((h) => h.startsWith('GAGAL'))) process.exit(1);
})();
