const test = require('node:test');
const assert = require('node:assert');
const muatGas = require('./muat-gas');

const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'DataContoh.gs', 'Pendaftaran.gs']);
const wib = (s) => g.parseWaktuWib_(s);

test('normalisasi nomor WA (U5)', () => {
  for (const masukan of ['+62 812-3456-7890', '0812 3456 7890', '6281234567890']) {
    assert.strictEqual(g.normalisasiWa_(masukan), '6281234567890');
  }
  assert.ok(g.waValid_('6281234567890'));
  assert.ok(!g.waValid_('62812'));
  assert.ok(!g.waValid_('6221234567'));
});

test('nama kunci dan sanitasi sel', () => {
  assert.strictEqual(g.namaKunci_('  Budi   SANTOSO '), 'budi santoso');
  assert.strictEqual(g.sanitasiSel_('=SUM(A1)'), "'=SUM(A1)");
  assert.strictEqual(g.sanitasiSel_('-1'), "'-1");
  assert.strictEqual(g.sanitasiSel_('Budi'), 'Budi');
  assert.strictEqual(g.sanitasiSel_(5), 5);
});

test('ambil ID dari URL', () => {
  const id = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';
  assert.strictEqual(g.ambilIdDariUrl_('https://docs.google.com/spreadsheets/d/' + id + '/edit#gid=0'), id);
  assert.strictEqual(g.ambilIdDariUrl_('https://drive.google.com/drive/folders/' + id + '?usp=sharing'), id);
  assert.strictEqual(g.ambilIdDariUrl_(id), id);
  assert.strictEqual(g.ambilIdDariUrl_('bukan url'), '');
});

test('jsonAman_ tidak bisa menutup tag script', () => {
  const s = g.jsonAman_({ a: '</script><b>' });
  assert.ok(!s.includes('<'));
  assert.deepStrictEqual(JSON.parse(s), { a: '</script><b>' });
});

test('waktu WIB', () => {
  assert.strictEqual(wib('2026-11-14 08:00'), Date.UTC(2026, 10, 14, 1, 0));
  assert.strictEqual(wib('2026-11-14'), Date.UTC(2026, 10, 13, 17, 0));
  assert.ok(Number.isNaN(wib('14/11/2026')));
  assert.ok(Number.isNaN(wib('')));
});

const peng = { form_pendaftaran: 'OTOMATIS', pendaftaran_buka: '2026-10-19 00:00', pendaftaran_tutup: '2026-11-07 23:59', tanggal_hari_h: '2026-11-14' };

test('fase OTOMATIS mengikuti tanggal', () => {
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-10-18 23:59')).fase, 'belum_buka');
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-10-19 00:00')).fase, 'daftar');
  const akhir = g.hitungStatus_(peng, wib('2026-11-07 23:59') + 59000);
  assert.strictEqual(akhir.fase, 'daftar');
  assert.strictEqual(akhir.sisa_hari, 0);
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-11-08 00:00')).fase, 'tutup');
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-11-08 00:00')).form.pendaftaran, 'TUTUP');
});

test('sisa hari dihitung per hari kalender WIB', () => {
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-10-20 17:00')).sisa_hari, 18);
  assert.strictEqual(g.hitungStatus_(peng, wib('2026-11-06 23:30')).sisa_hari, 1);
});

test('mode paksa BUKA dan TUTUP', () => {
  const buka = g.hitungStatus_({ ...peng, form_pendaftaran: 'buka' }, wib('2026-12-01 10:00'));
  assert.strictEqual(buka.fase, 'daftar');
  assert.strictEqual(buka.sisa_hari, null);
  const tutup = g.hitungStatus_({ ...peng, form_pendaftaran: 'TUTUP' }, wib('2026-10-01 10:00'));
  assert.strictEqual(tutup.fase, 'tutup');
});

test('tanggal tidak sah membuat pendaftaran tertutup', () => {
  const s = g.hitungStatus_({ ...peng, pendaftaran_buka: 'besok' }, wib('2026-10-20 10:00'));
  assert.strictEqual(s.fase, 'tutup');
  assert.strictEqual(s.pendaftaran_buka, null);
});

test('saring baris konten', () => {
  const baris = [
    { urutan: '2', tampil: 'YA', data_contoh: 'TIDAK', judul: 'B' },
    { urutan: '1', tampil: 'ya', data_contoh: 'YA', judul: 'A contoh' },
    { urutan: '', tampil: 'YA', data_contoh: 'TIDAK', judul: 'C tanpa urutan' },
    { urutan: '0', tampil: 'TIDAK', data_contoh: 'TIDAK', judul: 'Disembunyikan' },
    { urutan: '0', tampil: '', data_contoh: 'TIDAK', judul: 'Tampil kosong' },
    { urutan: '3', tampil: 'YA', data_contoh: 'TIDAK', judul: '' }
  ];
  const tanpaContoh = g.saringBaris_(baris, false);
  assert.deepStrictEqual(tanpaContoh.map((b) => b.judul), ['B', 'C tanpa urutan']);
  assert.deepStrictEqual(Object.keys(tanpaContoh[0]).sort(), ['contoh', 'judul']);
  const denganContoh = g.saringBaris_(baris, true);
  assert.deepStrictEqual(denganContoh.map((b) => b.judul), ['A contoh', 'B', 'C tanpa urutan']);
  assert.strictEqual(denganContoh[0].contoh, true);
});

test('data contoh cocok dengan kolom lembar', () => {
  for (const nama of Object.keys(g.DATA_CONTOH_)) {
    const kolom = g.KOLOM_BERSAMA_.concat(g.LEMBAR_DAFTAR_KONTEN_[nama]);
    for (const baris of g.DATA_CONTOH_[nama]) {
      for (const k of Object.keys(baris)) assert.ok(kolom.includes(k), nama + ': kolom ' + k + ' tidak dikenal');
    }
  }
  const kunciProfil = g.PROFIL_AWAL_.map((p) => p[0]);
  for (const p of g.PROFIL_CONTOH_) assert.ok(kunciProfil.includes(p[0]), 'Profil: kunci ' + p[0] + ' tidak dikenal');
  const tutor = g.DATA_CONTOH_.Narasumber_Tutor.filter((b) => b.peran === 'Tutor');
  assert.strictEqual(new Set(tutor.map((t) => t.room)).size, 6);
});

test('tidak ada link grup WA atau kunci rahasia di status publik', () => {
  const s = g.hitungStatus_({ ...peng, link_grup_wa: 'https://chat.whatsapp.com/rahasia', kuota_sd_ipa: '10' }, wib('2026-10-20 10:00'));
  const teks = JSON.stringify(s);
  assert.ok(!teks.includes('rahasia'));
  assert.ok(!teks.includes('kuota'));
});

test('atribut poster ditanam di HTML hanya untuk URL https yang aman', () => {
  const c = muatGas(['Code.gs']);
  const a = c.atributPoster_('https://lh3.googleusercontent.com/d/abc_DEF-123');
  assert.ok(a.atribut.includes('src="https://lh3.googleusercontent.com/d/abc_DEF-123=w1080"'));
  assert.ok(a.atribut.includes('=w600 600w'));
  assert.ok(a.kepala.startsWith('<link rel="preload" as="image"'));
  assert.strictEqual(a.wadah, '');
  assert.strictEqual(a.cadangan, 'hidden');
  for (const buruk of ['', 'http://x.y/z', 'https://x.y/"onerror="alert(1)', 'javascript:alert(1)']) {
    const b = c.atributPoster_(buruk);
    assert.strictEqual(b.atribut, '');
    assert.strictEqual(b.wadah, 'hidden');
  }
});

test('admin: validasi pengaturan, perapian, kunci login, dan prospek', () => {
  const a = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'Pendaftaran.gs', 'Admin.gs']);
  const dasar = {
    form_pendaftaran: 'OTOMATIS', pendaftaran_buka: '2026-10-19 00:00', pendaftaran_tutup: '2026-11-07 23:59', tanggal_hari_h: '2026-11-14',
    link_grup_wa: '', kuota_sd_matematika: '0', kuota_sd_ipa: '0', kuota_sd_ips: '0', kuota_smp_matematika: '0', kuota_smp_ipa: '0', kuota_smp_ips: '10',
    mode_uji: 'YA', tampilkan_data_contoh: 'TIDAK'
  };
  assert.deepStrictEqual(JSON.parse(JSON.stringify(a.validasiPengaturan_(dasar))), {});
  const g = a.validasiPengaturan_({ ...dasar, pendaftaran_tutup: '2026-10-01 10:00', link_grup_wa: 'http://x', kuota_sd_ipa: '-1', form_pendaftaran: 'X' });
  assert.strictEqual(g.pendaftaran_tutup, 'Jam tutup harus setelah jam buka.');
  assert.strictEqual(g.link_grup_wa, 'Link harus diawali https://');
  assert.ok(g.kuota_sd_ipa);
  assert.ok(g.form_pendaftaran);

  const r = a.rapikanPerubahan_({ pendaftaran_tutup: '2026-11-20T23:59', mode_uji: 'tidak', asing: 'x' });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r)), { pendaftaran_tutup: '2026-11-20 23:59', mode_uji: 'TIDAK' });

  let daftar = [];
  const t0 = 1e12;
  for (let i = 0; i < 19; i++) daftar = a.catatPercobaanGagal_(daftar, t0 + i).daftar;
  assert.strictEqual(a.catatPercobaanGagal_(daftar, t0 + 20).kunci, true);
  assert.strictEqual(a.catatPercobaanGagal_(daftar, t0 + 16 * 60 * 1000).kunci, false);

  assert.ok(a.samaAman_('abc', 'abc'));
  assert.ok(!a.samaAman_('abc', 'abd'));
  assert.ok(!a.samaAman_('abc', 'abcd'));

  const p = a.saringProspek_([
    { nama_lengkap: 'A', setuju_info_program: 'YA', didaftarkan_oleh: 'MANDIRI' },
    { nama_lengkap: 'B', setuju_info_program: 'TIDAK', didaftarkan_oleh: 'MANDIRI' },
    { nama_lengkap: 'C', setuju_info_program: 'YA', didaftarkan_oleh: 'MJ-0001' }
  ]);
  assert.deepStrictEqual(p.map((x) => x.sumber_persetujuan), ['Pendaftaran', 'Pendaftaran (persetujuan pendamping)']);
});
