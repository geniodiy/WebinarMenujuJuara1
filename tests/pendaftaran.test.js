const test = require('node:test');
const assert = require('node:assert');
const muatGas = require('./muat-gas');

const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'Pendaftaran.gs']);
const L = g.logikaDaftar_();
// Objek dari konteks vm punya prototipe lain; disalin dulu agar deepStrictEqual bisa membandingkan.
const salin = (x) => JSON.parse(JSON.stringify(x));

const penutup = { sumber_info: ['Instagram Genio'], pertanyaan_narsum: '', setuju_kehadiran: true, setuju_info_program: true };
const diri = (nama, wa) => ({ nama, wa, email: 'uji@contoh.id', kota: 'Sleman' });
const anak = (nama, kelas, bidang, wa = '') => ({
  nama, wa, kelas, asal_sekolah: 'SD Uji', bidang, pengalaman_osn: 'Belum pernah', siswa_genio: 'Tidak', perangkat: 'Perangkat sendiri'
});

function siswa(nama, wa, kelas = '3', bidang = 'IPA') {
  return { daftar_sebagai: 'Siswa', ...diri(nama, wa), kelas, asal_sekolah: 'SD Uji', bidang, pengalaman_osn: 'Belum pernah', siswa_genio: 'Tidak', ...penutup };
}

function proses(data, ada = [], uji = true) {
  const r = L.rapikan(data);
  const galat = L.validasiSemua(r);
  assert.deepStrictEqual(salin(galat), {}, 'galat validasi: ' + JSON.stringify(galat));
  return g.rencanakanPendaftaran_(r, ada, uji);
}

test('langkah mengikuti jalur (PRD 10.2)', () => {
  assert.deepStrictEqual(salin(L.langkah({ daftar_sebagai: 'Siswa' })), ['sebagai', 'diri', 'siswa', 'penutup', 'ringkasan']);
  assert.deepStrictEqual(salin(L.langkah({ daftar_sebagai: 'Pendamping', peran: 'Orang Tua', daftarkan: 'Ya' })), ['sebagai', 'diri', 'peran', 'jumlah', 'anak', 'penutup', 'ringkasan']);
  assert.deepStrictEqual(salin(L.langkah({ daftar_sebagai: 'Pendamping', peran: 'Orang Tua', daftarkan: 'Tidak' })), ['sebagai', 'diri', 'peran', 'jumlah', 'minat', 'penutup', 'ringkasan']);
  assert.deepStrictEqual(salin(L.langkah({ daftar_sebagai: 'Pendamping', peran: 'Guru Pembina', daftarkan: 'Ya' })), ['sebagai', 'diri', 'peran', 'guru', 'jumlah', 'anak', 'penutup', 'ringkasan']);
  assert.deepStrictEqual(salin(L.langkah({ daftar_sebagai: 'Pendamping', peran: 'Guru Pembina', daftarkan: 'Tidak' })), ['sebagai', 'diri', 'peran', 'guru', 'jumlah', 'penutup', 'ringkasan']);
});

test('U1: siswa kelas 3 IPA menjadi Siswa SD, room SD IPA', () => {
  const h = proses(siswa('Budi', '081234567890'));
  assert.strictEqual(h.baris.length, 1);
  assert.strictEqual(h.baris[0].kategori, 'Siswa SD');
  assert.strictEqual(h.baris[0].room, 'SD IPA');
  assert.strictEqual(h.baris[0].id_peserta, 'UJI-0001');
  assert.strictEqual(h.baris[0].id_pendaftaran, 'UJI-REG-0001');
  assert.strictEqual(h.baris[0].didaftarkan_oleh, 'MANDIRI');
});

test('ID asli memakai MJ- dan REG- di luar mode uji', () => {
  const h = proses(siswa('Budi', '081234567890'), [{ id_peserta: 'UJI-0007', id_pendaftaran: 'UJI-REG-0003' }], false);
  assert.strictEqual(h.baris[0].id_peserta, 'MJ-0001');
  assert.strictEqual(h.baris[0].id_pendaftaran, 'REG-0001');
});

test('U2: orang tua mendaftarkan 3 anak, satu tanpa WA', () => {
  const d = {
    daftar_sebagai: 'Pendamping', ...diri('Ibu Sari', '0812 1111 2222'), peran: 'Orang Tua', daftarkan: 'Ya', jumlah: 3,
    anak: [anak('Ani', '2', 'Matematika', '081233334444'), anak('Bima', '8', 'IPS'), anak('Cici', '5', 'IPA', '081255556666')], ...penutup
  };
  const h = proses(d);
  assert.strictEqual(h.baris.length, 4);
  assert.ok(h.baris.every((b) => b.id_pendaftaran === h.baris[0].id_pendaftaran));
  const bima = h.baris.find((b) => b.nama_lengkap === 'Bima');
  assert.strictEqual(bima.wa, '');
  assert.strictEqual(bima.wa_kunci, '6281211112222');
  assert.strictEqual(bima.kategori, 'Siswa SMP');
  assert.strictEqual(bima.didaftarkan_oleh, h.baris[0].id_peserta);
  assert.strictEqual(bima.kota, 'Sleman');
  assert.strictEqual(bima.setuju_info_program, 'YA');
  assert.strictEqual(h.baris[0].jumlah_didaftarkan, '3');
});

test('U3: orang tua tidak mendaftarkan anak menyimpan data minat', () => {
  const d = {
    daftar_sebagai: 'Pendamping', ...diri('Pak Joko', '081277778888'), peran: 'Orang Tua', daftarkan: 'Tidak',
    minat_jenjang_anak: ['SD'], minat_bidang_anak: ['Belum menentukan'], anak_siswa_genio: 'Tidak', ...penutup
  };
  const h = proses(d);
  assert.strictEqual(h.baris.length, 1);
  assert.strictEqual(h.baris[0].kategori, 'Orang Tua');
  assert.strictEqual(h.baris[0].minat_bidang_anak, 'Belum menentukan');
  assert.strictEqual(h.baris[0].daftarkan_siswa, 'TIDAK');
});

test('U4: guru mendaftarkan 12 siswa, persetujuan poin 4 wajib', () => {
  const daftarAnak = Array.from({ length: 12 }, (_, i) => anak('Siswa ' + (i + 1), '7', 'Matematika'));
  const d = {
    daftar_sebagai: 'Pendamping', ...diri('Bu Guru', '081299990000'), peran: 'Guru Pembina', sekolah_mengajar: 'SMP Uji',
    jenjang_dibina: ['SMP'], bidang_dibina: ['Matematika'], daftarkan: 'Ya', jumlah: 12, anak: daftarAnak, ...penutup
  };
  const tanpaSetuju = L.validasiSemua(L.rapikan(d));
  assert.strictEqual(tanpaSetuju.setuju_siswa_binaan, L.PESAN.setuju);
  const h = proses({ ...d, setuju_siswa_binaan: true });
  assert.strictEqual(h.baris.length, 13);
  assert.strictEqual(h.baris[0].setuju_siswa_binaan, 'YA');
  assert.strictEqual(new Set(h.baris.map((b) => b.id_peserta)).size, 13);
});

test('U5: tiga format nomor WA menjadi 6281234567890', () => {
  for (const wa of ['+62 812-3456-7890', '0812 3456 7890', '6281234567890']) {
    assert.strictEqual(L.rapikan(siswa('Budi', wa)).wa, '6281234567890');
  }
  assert.strictEqual(L.validasiLangkah({ nama: 'a', wa: '0812', email: 'a@b.co', kota: 'x' }, 'diri').wa, L.PESAN.wa);
  assert.strictEqual(L.validasiLangkah({ nama: 'a', wa: '081234567890', email: 'a@b', kota: 'x' }, 'diri').email, L.PESAN.email);
});

function sebagaiAda(h) {
  return h.baris.map((b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, String(v)])));
}

test('U6: siswa yang sama mendaftar dua kali ditolak', () => {
  const ada = sebagaiAda(proses(siswa('Budi', '081234567890')));
  const r = L.rapikan(siswa('  budi ', '+62 812 3456 7890'));
  const h = g.rencanakanPendaftaran_(r, ada, true);
  assert.strictEqual(h.ok, false);
  assert.strictEqual(h.error.code, 'DUPLIKAT');
  assert.strictEqual(h.error.message, 'Peserta ini sudah terdaftar.');
});

test('U7: pendamping terdaftar menambah 1 siswa', () => {
  const awal = {
    daftar_sebagai: 'Pendamping', ...diri('Ibu Sari', '081211112222'), peran: 'Orang Tua', daftarkan: 'Ya', jumlah: 1,
    anak: [anak('Ani', '2', 'Matematika')], ...penutup
  };
  const ada = sebagaiAda(proses(awal));
  const h = proses({ ...awal, anak: [anak('Dodi', '4', 'IPS')] }, ada);
  assert.strictEqual(h.ok, true);
  assert.strictEqual(h.baris.length, 1);
  assert.strictEqual(h.baris[0].nama_lengkap, 'Dodi');
  assert.strictEqual(h.baris[0].id_pendaftaran, ada[0].id_pendaftaran);
  assert.strictEqual(h.baris[0].didaftarkan_oleh, ada[0].id_peserta);
  assert.strictEqual(h.baris[0].id_peserta, 'UJI-0003');
  assert.strictEqual(h.hasil.tambahan, true);
  assert.deepStrictEqual(salin(h.perbaruiPendamping), { baris: 2, jumlah: 2 });

  const ulang = proses({ ...awal, anak: [anak('Ani', '2', 'Matematika'), anak('Eka', '3', 'IPA')] }, ada);
  assert.strictEqual(ulang.ok, false);
  assert.deepStrictEqual(Array.from(ulang.error.nama), ['Ani']);
});

test('siswa ganda di dalam satu kiriman ditandai', () => {
  const d = {
    daftar_sebagai: 'Pendamping', ...diri('Ibu Sari', '081211112222'), peran: 'Orang Tua', daftarkan: 'Ya', jumlah: 2,
    anak: [anak('Ani', '2', 'IPA'), anak('ani ', '2', 'IPA')], ...penutup
  };
  assert.strictEqual(L.validasiSemua(L.rapikan(d))['anak.1.nama'], L.PESAN.ganda);
});

test('U27: ganti dari Pendamping (guru) ke Siswa membuang isian guru', () => {
  const d = {
    ...siswa('Budi', '081234567890'), peran: 'Guru Pembina', sekolah_mengajar: 'SMP X', jenjang_dibina: ['SMP'],
    daftarkan: 'Ya', anak: [anak('Lain', '7', 'IPA')], setuju_siswa_binaan: true
  };
  const r = L.rapikan(d);
  assert.strictEqual(r.sekolah_mengajar, undefined);
  assert.strictEqual(r.anak, undefined);
  const h = proses(d);
  assert.strictEqual(h.baris.length, 1);
  assert.strictEqual(h.baris[0].peran, 'Siswa');
  assert.strictEqual(h.baris[0].sekolah_mengajar, undefined);
});

test('validasi wajib dan persetujuan', () => {
  const g1 = L.validasiSemua(L.rapikan({ daftar_sebagai: 'Siswa' }));
  for (const k of ['nama', 'wa', 'email', 'kota', 'kelas', 'asal_sekolah', 'bidang', 'sumber_info']) assert.strictEqual(g1[k], L.PESAN.wajib, k);
  assert.strictEqual(g1.setuju_kehadiran, L.PESAN.setuju);
  assert.strictEqual(L.validasiLangkah({ daftarkan: 'Ya', jumlah: 0 }, 'jumlah').jumlah, L.PESAN.jumlah);
  assert.strictEqual(L.validasiLangkah({ pertanyaan_narsum: 'x'.repeat(1001), sumber_info: ['Sekolah'], setuju_kehadiran: true }, 'penutup').pertanyaan_narsum, L.PESAN.panjang);
  assert.ok(L.validasiSemua(L.rapikan({})).daftar_sebagai);
});

test('rekap tidak menghitung data uji dan menandai kuota', () => {
  const semua = [
    { kategori: 'Siswa SD', room: 'SD IPA', uji: 'TIDAK', setuju_info_program: 'YA' },
    { kategori: 'Siswa SD', room: 'SD IPA', uji: 'TIDAK', setuju_info_program: 'TIDAK' },
    { kategori: 'Siswa SD', room: 'SD IPA', uji: 'YA', setuju_info_program: 'YA' },
    { kategori: 'Orang Tua', room: '', uji: 'TIDAK', setuju_info_program: 'YA' }
  ];
  const rekap = g.hitungRekap_(semua, { kuota_sd_ipa: '2', kuota_sd_ips: '0' }, 'w');
  const cari = (nama) => rekap.find((b) => b[1] === nama);
  assert.strictEqual(cari('Semua pendaftar')[2], 3);
  assert.deepStrictEqual(Array.from(cari('SD IPA')).slice(2, 5), [2, 2, 'penuh']);
  assert.strictEqual(cari('SD IPS')[4], 'tanpa batas');
  assert.strictEqual(cari('Setuju informasi program')[2], 2);
});

test('nomor urut ID', () => {
  assert.strictEqual(g.nomorBerikut_(['MJ-0009', 'MJ-0010', 'UJI-0099'], 'MJ-'), 11);
  assert.strictEqual(g.nomorBerikut_(['UJI-REG-0002', 'REG-0005'], 'REG-'), 6);
  assert.strictEqual(g.formatId_('MJ-', 7), 'MJ-0007');
  assert.strictEqual(g.formatId_('MJ-', 12345), 'MJ-12345');
});
