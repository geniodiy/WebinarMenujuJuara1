// Uji ujung-ke-ujung form pendaftaran: Chromium mengisi form, submitDaftar asli berjalan di Node
// dengan spreadsheet tiruan. Pakai: NODE_PATH=$(npm root -g) node tests/e2e-form.js
// Uji unduhan Excel butuh SHEETJS_LOKAL=<path xlsx.full.min.js 0.18.5> bila cdnjs tidak terjangkau.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const assert = require('assert');
const { chromium } = require('playwright');
const muatGas = require('./muat-gas');

const DIR_KELUAR = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-form-'));
const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'Pendaftaran.gs', 'Admin.gs']);
const SANDI = 'sandi-uji-panjang-123';

function lembarTiruan(judul) {
  const data = [judul.slice()];
  const lebar = () => Math.max(...data.map((r) => r.length));
  return {
    data,
    getLastRow: () => data.length,
    getLastColumn: () => lebar(),
    appendRow(r) { data.push(r.slice()); },
    getDataRange: () => ({
      getValues: () => data.map((r) => r.slice()),
      getDisplayValues: () => data.map((r) => Array.from({ length: lebar() }, (_, i) => String(r[i] == null ? '' : r[i])))
    }),
    getRange: (r, c, nr = 1, nc = 1) => ({
      getValues() {
        const hasil = [];
        for (let i = 0; i < nr; i++) hasil.push(Array.from({ length: nc }, (_, j) => (data[r - 1 + i] || [])[c - 1 + j] ?? ''));
        return hasil;
      },
      setValues(vals) {
        for (let i = 0; i < nr; i++) {
          while (data.length < r + i) data.push(new Array(data[0].length).fill(''));
          for (let j = 0; j < nc; j++) data[r - 1 + i][c - 1 + j] = vals[i][j];
        }
      },
      setValue(v) {
        while (data.length < r) data.push(new Array(data[0].length).fill(''));
        data[r - 1][c - 1] = v;
      },
      clearContent() {
        for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) if (data[r - 1 + i]) data[r - 1 + i][c - 1 + j] = '';
      }
    })
  };
}

let lembar = {};
let lembarKonten = {};
const cache = new Map();
function reset() {
  const peng = lembarTiruan(['kunci', 'nilai', 'keterangan']);
  g.PENGATURAN_AWAL_.forEach((b) => peng.appendRow([b[0], b[1], b[2]]));
  lembar = {
    Pendaftar: lembarTiruan(g.KOLOM_PENDAFTAR_),
    Rekap: lembarTiruan(g.KOLOM_REKAP_),
    Log_Admin: lembarTiruan(g.KOLOM_LOG_ADMIN_),
    Pengaturan: peng
  };
  const pk = lembarTiruan(['kunci', 'nilai', 'keterangan']);
  pk.appendRow(['tampilkan_data_contoh', 'TIDAK', '']);
  lembarKonten = { Pengaturan_Konten: pk };
  aturPeng('form_pendaftaran', 'BUKA');
  aturPeng('link_grup_wa', 'https://chat.whatsapp.com/contohgrup');
  cache.clear();
}
function aturPeng(kunci, nilai) {
  const baris = lembar.Pengaturan.data.find((r) => r[0] === kunci);
  baris[1] = nilai;
  cache.delete('pengaturan');
}
function nilaiPeng(kunci) {
  return lembar.Pengaturan.data.find((r) => r[0] === kunci)[1];
}
g.bukaDb_ = () => ({ getSheetByName: (n) => lembar[n] || null });
g.bukaKonten_ = () => ({ getSheetByName: (n) => lembarKonten[n] || null });
g.CacheService = { getScriptCache: () => ({
  get: (k) => cache.get(k) || null, put: (k, v) => cache.set(k, v), remove: (k) => cache.delete(k),
  removeAll: (ks) => ks.forEach((k) => cache.delete(k))
}) };
g.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) };
g.PropertiesService = { getScriptProperties: () => ({ getProperty: (k) => (k === 'ADMIN_PASSWORD' ? SANDI : '') }) };
let nomorUuid = 0;
g.Utilities = {
  formatDate: (d) => d.toISOString().replace('T', ' ').slice(0, 19),
  getUuid: () => 'aaaaaaaa-bbbb-cccc-dddd-' + String(++nomorUuid).padStart(12, '0'),
  sleep() {}
};
g.DURASI_MINIMUM_MS_ = 0;

function barisPendaftar() {
  const [judul, ...isi] = lembar.Pendaftar.data;
  return isi.map((r) => Object.fromEntries(judul.map((j, i) => [j, r[i]])));
}

const berkasHtml = path.join(DIR_KELUAR, 'form.html');
fs.writeFileSync(berkasHtml, execFileSync('node', [path.join(__dirname, 'pratinjau.js'), 'daftar', 'form']));
const berkasAdmin = path.join(DIR_KELUAR, 'halaman.html');
fs.writeFileSync(berkasAdmin, execFileSync('node', [path.join(__dirname, 'pratinjau.js'), 'daftar']));

let putus = '';
async function halamanBaru(browser, opsi = {}) {
  const ctx = await browser.newContext({ viewport: opsi.viewport || { width: 360, height: 740 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const galatHalaman = [];
  page.on('pageerror', (e) => galatHalaman.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.exposeFunction('__panggilServer', (nama, args) => JSON.parse(JSON.stringify(g[nama](...args))));
  await page.exposeFunction('__putus', () => putus);
  await page.addInitScript(() => {
    function runner() {
      let sukses = () => {};
      let gagal = () => {};
      const dasar = {
        withSuccessHandler(f) { sukses = f; return r; },
        withFailureHandler(f) { gagal = f; return r; }
      };
      const r = new Proxy(dasar, {
        get(t, nama) {
          if (nama in t) return t[nama];
          return async (...args) => {
            const mode = nama === 'submitDaftar' ? await window.__putus() : '';
            if (mode === 'sebelum') return setTimeout(() => gagal(new Error('putus')), 50);
            const hasil = await window.__panggilServer(nama, args);
            setTimeout(() => (mode === 'setelah' ? gagal(new Error('putus')) : sukses(hasil)), 100);
          };
        }
      });
      return r;
    }
    window.google = { script: { get run() { return runner(); } } };
  });
  // cdnjs diblokir di lingkungan uji; SheetJS versi yang sama bisa diberikan lewat SHEETJS_LOKAL.
  if (process.env.SHEETJS_LOKAL) {
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(process.env.SHEETJS_LOKAL, 'utf8') }));
  }
  await page.goto('file://' + (opsi.berkas || berkasHtml));
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
    aturPeng('form_pendaftaran', 'TUTUP');
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


  function daftarLangsung(nama, wa, uji) {
    const d = {
      kode_kiriman: 'k-' + Math.random().toString(16).slice(2, 14), durasi_ms: 9000, hp: '',
      daftar_sebagai: 'Siswa', nama, wa, email: 'uji@contoh.id', kota: 'Sleman', kelas: '8', asal_sekolah: 'SMP Uji',
      bidang: 'IPA', pengalaman_osn: 'Belum pernah', siswa_genio: 'Tidak', sumber_info: ['Sekolah'],
      setuju_kehadiran: true, setuju_info_program: true
    };
    aturPeng('mode_uji', uji ? 'YA' : 'TIDAK');
    const h = g.submitDaftar(d);
    assert.ok(h.ok, JSON.stringify(h));
  }
  async function masukAdmin(page, sandi) {
    await page.click('#tombol-admin');
    await page.fill('#sandi-admin', sandi);
    await page.click('.admin-form button[type=submit]');
  }

  await uji('U20: kata sandi salah tidak masuk dan tercatat di Log_Admin', async () => {
    const { page, galatHalaman } = await halamanBaru(browser, { berkas: berkasAdmin });
    await masukAdmin(page, 'salah');
    await page.waitForSelector('text=Kata sandi salah.');
    assert.strictEqual(lembar.Log_Admin.data.length, 2);
    assert.strictEqual(lembar.Log_Admin.data[1][2], 'login gagal');
    assert.strictEqual(await page.locator('.admin-panel').count(), 0);
    assert.deepStrictEqual(galatHalaman, []);
  });

  await uji('U21: 20 kali salah mengunci login, bukaKunciLogin membukanya', async () => {
    for (let i = 0; i < 20; i++) g.adminLogin('salah');
    assert.strictEqual(g.adminLogin(SANDI).error.code, 'TERKUNCI');
    const penjaga = g.penjagaPanitia_;
    g.penjagaPanitia_ = () => {};
    g.lapor_ = (x) => x;
    g.bukaKunciLogin();
    g.penjagaPanitia_ = penjaga;
    assert.strictEqual(g.adminLogin(SANDI).ok, true);
  });

  await uji('U22: admin mengubah tanggal tutup, Pengaturan dan Log_Admin berubah', async () => {
    daftarLangsung('Budi Asli', '081234567890', false);
    daftarLangsung('Ani Uji', '081299998888', true);
    const { page } = await halamanBaru(browser, { berkas: berkasAdmin, viewport: { width: 390, height: 844 } });
    await masukAdmin(page, SANDI);
    await page.waitForSelector('.admin-angka');
    assert.strictEqual(await page.locator('.admin-angka-kartu strong').first().textContent(), '1');
    await page.screenshot({ path: path.join(DIR_KELUAR, 'admin-ringkasan.png') });
    await page.click('.admin-tab-tombol:has-text("Pengaturan")');
    await page.waitForSelector('#ap-pendaftaran_tutup');
    const sisaLama = g.getConfig().data.sisa_hari;
    await page.fill('#ap-pendaftaran_tutup', '2026-11-20T23:59');
    await page.selectOption('#ap-form_pendaftaran', 'OTOMATIS');
    await page.click('text=Simpan pengaturan');
    await page.waitForSelector('text=Pengaturan tersimpan.');
    assert.strictEqual(nilaiPeng('pendaftaran_tutup'), '2026-11-20 23:59');
    const log = lembar.Log_Admin.data.find((r) => r[3] === 'pendaftaran_tutup');
    assert.deepStrictEqual([log[4], log[5]], ['2026-11-07 23:59', '2026-11-20 23:59']);
    assert.strictEqual(g.getConfig().data.sisa_hari, sisaLama + 13);
    await page.screenshot({ path: path.join(DIR_KELUAR, 'admin-pengaturan.png'), fullPage: true });
  });

  await uji('U23: jam tutup sebelum jam buka ditolak dengan pesan jelas', async () => {
    const { page } = await halamanBaru(browser, { berkas: berkasAdmin });
    await masukAdmin(page, SANDI);
    await page.click('.admin-tab-tombol:has-text("Pengaturan")');
    await page.waitForSelector('#ap-pendaftaran_tutup');
    await page.fill('#ap-pendaftaran_tutup', '2026-10-01T10:00');
    await page.click('text=Simpan pengaturan');
    await page.waitForSelector('text=Jam tutup harus setelah jam buka.');
    assert.strictEqual(nilaiPeng('pendaftaran_tutup'), '2026-11-07 23:59');
  });

  await uji('tutup pendaftaran sekarang meminta konfirmasi', async () => {
    const { page } = await halamanBaru(browser, { berkas: berkasAdmin });
    await masukAdmin(page, SANDI);
    await page.click('.admin-tab-tombol:has-text("Pengaturan")');
    await page.waitForSelector('#ap-form_pendaftaran');
    await page.selectOption('#ap-form_pendaftaran', 'TUTUP');
    await page.click('text=Simpan pengaturan');
    await page.waitForSelector('text=Tutup pendaftaran sekarang?');
    await page.click('.admin-konfirmasi button:has-text("Batal")');
    assert.strictEqual(nilaiPeng('form_pendaftaran'), 'BUKA');
    await page.click('text=Simpan pengaturan');
    await page.click('.admin-konfirmasi button:has-text("Tutup pendaftaran")');
    await page.waitForSelector('text=Pengaturan tersimpan.');
    assert.strictEqual(nilaiPeng('form_pendaftaran'), 'TUTUP');
  });

  await uji('U25: cari peserta lewat nomor 0812 dan detail pendaftar', async () => {
    daftarLangsung('Budi Asli', '+62 812-3456-7890', false);
    daftarLangsung('Citra Asli', '081277776666', false);
    const { page } = await halamanBaru(browser, { berkas: berkasAdmin });
    await masukAdmin(page, SANDI);
    await page.click('.admin-tab-tombol:has-text("Pendaftar")');
    await page.waitForSelector('.admin-tabel-pendaftar');
    await page.fill('input[type=search]', '0812 3456');
    await page.waitForTimeout(400);
    assert.strictEqual(await page.locator('.admin-tabel-pendaftar tbody tr').count(), 1);
    await page.screenshot({ path: path.join(DIR_KELUAR, 'admin-pendaftar.png') });
    await page.click('.admin-tabel-pendaftar .tombol-tautan');
    await page.waitForSelector('.admin-detail');
    assert.ok((await page.locator('.admin-detail').textContent()).includes('6281234567890'));
  });

  await uji('U24: unduh semua data dan prospek tanpa data uji, WA tetap teks', async () => {
    if (!process.env.SHEETJS_LOKAL) throw new Error('lewati: set SHEETJS_LOKAL ke xlsx.full.min.js 0.18.5 (cdnjs tidak terjangkau)');
    daftarLangsung('Budi Asli', '081234567890', false);
    daftarLangsung('Ani Uji', '081299998888', true);
    const { page } = await halamanBaru(browser, { berkas: berkasAdmin, viewport: { width: 1280, height: 900 } });
    await masukAdmin(page, SANDI);
    await page.click('.admin-tab-tombol:has-text("Unduh")');
    const [unduhan] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('text=Unduh semua data (.xlsx)')]);
    assert.ok(/^MenujuJuara-Eps1_semua_\d{4}-\d{2}-\d{2}_\d{4}\.xlsx$/.test(unduhan.suggestedFilename()), unduhan.suggestedFilename());
    const berkas = path.join(DIR_KELUAR, unduhan.suggestedFilename());
    await unduhan.saveAs(berkas);
    const isi = await page.evaluate(async (b64) => {
      const wb = XLSX.read(b64, { type: 'base64' });
      const ws = wb.Sheets.Pendaftar;
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const kolomWa = rows[0].indexOf('Nomor WhatsApp');
      return { lembar: wb.SheetNames, baris: rows.length, wa: rows[1][kolomWa], tipe: ws[XLSX.utils.encode_cell({ r: 1, c: kolomWa })].t };
    }, fs.readFileSync(berkas).toString('base64'));
    assert.deepStrictEqual(isi.lembar, ['Pendaftar', 'Rekap']);
    assert.strictEqual(isi.baris, 2);
    assert.strictEqual(isi.wa, '6281234567890');
    assert.strictEqual(isi.tipe, 's');
    const [prospek] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('text=Unduh daftar prospek (.xlsx)')]);
    assert.ok(prospek.suggestedFilename().startsWith('MenujuJuara-Eps1_prospek_'));
    assert.ok(lembar.Log_Admin.data.some((r) => r[2] === 'unduh data' && r[3] === 'semua'));
  });

  await uji('akses data admin tanpa token ditolak server', async () => {
    assert.strictEqual(g.adminGetData('', 'pendaftar', true).error.code, 'SESI');
    assert.strictEqual(g.adminSaveSettings('a'.repeat(64), { form_pendaftaran: 'TUTUP' }).error.code, 'SESI');
  });

  await browser.close();
  console.log(hasilUji.join('\n'));
  console.log('Tangkapan layar: ' + DIR_KELUAR);
  if (hasilUji.some((h) => h.startsWith('GAGAL'))) process.exit(1);
})();
