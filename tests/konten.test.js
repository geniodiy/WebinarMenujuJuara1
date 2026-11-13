const test = require('node:test');
const assert = require('node:assert');
const muatGas = require('./muat-gas');

const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'DataContoh.gs', 'Laporan.gs', 'AdminKonten.gs']);
const polos = (x) => JSON.parse(JSON.stringify(x));

test('jenis prestasi dari kolom atau teks', () => {
  assert.strictEqual(g.jenisPrestasi_('perak', ''), 'Perak');
  assert.strictEqual(g.jenisPrestasi_('', 'Medali Emas OSN Nasional SMP 2026'), 'Emas');
  assert.strictEqual(g.jenisPrestasi_('', 'Juara II Olimpiade Matematika UNNES'), 'Perak');
  assert.strictEqual(g.jenisPrestasi_('', 'Juara III Lomba Matematika UGM'), 'Perunggu');
  assert.strictEqual(g.jenisPrestasi_('', 'Juara I KMNR'), 'Emas');
  assert.strictEqual(g.jenisPrestasi_('Harapan', 'Harapan OSN IPS'), 'Lainnya');
  assert.strictEqual(g.jenisPrestasi_('', 'Finalis KSN 2024'), 'Lainnya');
  assert.strictEqual(g.jenisPrestasi_('', 'Bronze Medal IMSO 2025'), 'Perunggu');
});

test('bidang tutor dari jabatan', () => {
  assert.strictEqual(g.bidangTutor_('Tutor Matematika SD'), 'mat');
  assert.strictEqual(g.bidangTutor_('Tutor IPA SMP'), 'ipa');
  assert.strictEqual(g.bidangTutor_('Tutor IPS SD'), 'ips');
  assert.strictEqual(g.bidangTutor_('Tutor Bahasa'), '');
});

test('prestasi tutor dari Prestasi_Tutor, cadangan prestasi_binaan', () => {
  const pt = [
    { nama_tutor: 'tutor  satu', jenis: 'Emas', prestasi: 'A' },
    { nama_tutor: 'Tutor Dua', jenis: '', prestasi: 'Medali Perak B' },
    { nama_tutor: 'Tutor Satu', jenis: 'Lainnya', prestasi: '' }
  ];
  assert.deepStrictEqual(polos(g.prestasiTutor_({ nama_lengkap: 'Tutor Satu', prestasi_binaan: 'X' }, pt)), [{ jenis: 'Emas', teks: 'A' }]);
  assert.deepStrictEqual(polos(g.prestasiTutor_({ nama_lengkap: 'Tutor Dua' }, pt)), [{ jenis: 'Perak', teks: 'Medali Perak B' }]);
  assert.deepStrictEqual(polos(g.prestasiTutor_({ nama_lengkap: 'Tutor Tiga', prestasi_binaan: 'Medali Perunggu C\n\nFinalis D' }, pt)),
    [{ jenis: 'Perunggu', teks: 'Medali Perunggu C' }, { jenis: 'Lainnya', teks: 'Finalis D' }]);
});

test('urutkan baris menurut kolom urutan', () => {
  const b = g.urutkanBaris_([{ urutan: '2', n: 'b' }, { urutan: '', n: 'x' }, { urutan: '1', n: 'a' }, { urutan: '2', n: 'c' }]);
  assert.deepStrictEqual(b.map((x) => x.n), ['a', 'b', 'c', 'x']);
});

test('susun tutor untuk admin: nomor baris dan hanya peran Tutor', () => {
  const nt = [
    { peran: 'Narasumber', nama_lengkap: 'Indro' },
    { peran: 'Tutor', nama_lengkap: 'Tutor Satu', jabatan: 'Tutor IPA SD', foto: 'a.png', tampil: 'YA', data_contoh: 'YA' }
  ];
  const t = polos(g.susunTutorAdmin_(nt, [{ urutan: 2, nama_tutor: 'Tutor Satu', jenis: 'Perak', prestasi: 'P2' }, { urutan: 1, nama_tutor: 'Tutor Satu', jenis: 'Emas', prestasi: 'P1' }], { 'a.png': 'ID123' }));
  assert.strictEqual(t.length, 1);
  assert.strictEqual(t[0].baris, 3);
  assert.strictEqual(t[0].bidang, 'ipa');
  assert.strictEqual(t[0].foto_url, 'https://lh3.googleusercontent.com/d/ID123');
  assert.deepStrictEqual(t[0].prestasi.map((p) => p.teks), ['P1', 'P2']);
});

test('rapikan tutor: wajib nama dan jabatan, foto dari folder, nama tidak bentrok', () => {
  const r = g.rapikanTutor_({ nama_lengkap: ' Budi ', jabatan: 'Tutor IPA SD', foto: 'Budi.PNG', prestasi: [{ jenis: 'emas', teks: ' A ' }, { jenis: 'Perak', teks: '' }] }, ['ani'], ['budi.png']);
  assert.deepStrictEqual(polos(r.galat), {});
  assert.strictEqual(r.nilai.nama_lengkap, 'Budi');
  assert.deepStrictEqual(polos(r.nilai.prestasi), [{ jenis: 'Emas', teks: 'A' }]);
  const salah = g.rapikanTutor_({ nama_lengkap: 'Ani', jabatan: '', foto: 'tidak-ada.png' }, ['ani'], ['budi.png']);
  assert.deepStrictEqual(Object.keys(salah.galat).sort(), ['foto', 'jabatan', 'nama_lengkap']);
});

test('rapikan daftar prestasi siswa', () => {
  const r = g.rapikanDaftarPrestasi_([
    { tahun: '2026', nama_siswa: 'A', prestasi: 'Medali Emas OSN', medali: '', sorotan: true, tampil: true, contoh: false },
    { tahun: '', nama_siswa: '', prestasi: '', sekolah: '' },
    { tahun: '2025', nama_siswa: 'B', prestasi: '=Juara II', medali: 'Perunggu', tampil: false, contoh: true }
  ]);
  assert.strictEqual(r.galat.length, 0);
  assert.strictEqual(r.baris.length, 2);
  assert.strictEqual(r.baris[0].medali, 'Emas');
  assert.strictEqual(r.baris[0].sorotan, 'YA');
  assert.strictEqual(r.baris[1].urutan, 2);
  assert.strictEqual(r.baris[1].medali, 'Perunggu');
  assert.strictEqual(r.baris[1].tampil, 'TIDAK');
  assert.strictEqual(r.baris[1].data_contoh, 'YA');
  const salah = g.rapikanDaftarPrestasi_([{ tahun: '26', nama_siswa: 'A', prestasi: '' }]);
  assert.strictEqual(salah.galat.length, 2);
});

test('data contoh Fase 5 lengkap', () => {
  const tutor = g.DATA_CONTOH_.Narasumber_Tutor.filter((b) => b.peran === 'Tutor').map((b) => b.nama_lengkap);
  g.DATA_CONTOH_.Prestasi_Tutor.forEach((p) => assert.ok(tutor.includes(p.nama_tutor), p.nama_tutor));
  g.DATA_CONTOH_.Testimoni.forEach((t) => assert.strictEqual(t.data_contoh, 'YA'));
  const profil = Object.fromEntries(g.PROFIL_GENIO_.map((p) => [p[0], p[1]]));
  assert.strictEqual(profil.data_contoh, 'TIDAK');
  assert.strictEqual(profil.angka_4, '2');
});

test('bagian halaman tampil kecuali diisi TIDAK', () => {
  assert.deepStrictEqual(polos(g.bagianTampil_({})), { tutor: true, profil: true, cabang: true, prestasi: true, ajakan: true });
  assert.deepStrictEqual(polos(g.bagianTampil_({ tampil_tutor: 'tidak ', tampil_cabang: 'YA', tampil_ajakan: '' })),
    { tutor: false, profil: true, cabang: true, prestasi: true, ajakan: true });
});

test('prestasi sorotan YA di atas, sisanya tetap urut', () => {
  const d = [{ n: 1, sorotan: 'TIDAK' }, { n: 2, sorotan: 'YA' }, { n: 3, sorotan: '' }, { n: 4, sorotan: 'ya' }];
  assert.deepStrictEqual(g.urutkanSorotan_(d).map((x) => x.n), [2, 4, 1, 3]);
});

test('teks dipecah dan disambung kembali utuh', () => {
  const t = 'a'.repeat(250);
  const p = g.pecahTeks_(t, 100);
  assert.deepStrictEqual(polos(p.map((x) => x.length)), [100, 100, 50]);
  assert.strictEqual(p.join(''), t);
  assert.deepStrictEqual(polos(g.pecahTeks_('', 100)), []);
});

const h = muatGas(['Util.gs', 'Config.gs', 'HariH.gs']);
test('presensi: percabangan siswa dan dewasa, nilai 1-5, minat program', () => {
  const s = h.rapikanPresensi_({ wa: '0812 3456 7890', nama_lengkap: ' Budi ', kategori: 'Siswa SD', kelas_simulasi: 'IPA',
    nilai_materi: 5, nilai_kelas: 4, nilai_tutor: '3', nilai_sinergi: 5, nilai_teknis: 2, bagian_bermanfaat: 'x', minat_program: ['Tidak, terima kasih'] });
  assert.deepStrictEqual(polos(s.galat), {});
  assert.strictEqual(s.data.wa, '6281234567890');
  assert.strictEqual(s.data.nilai_sinergi, '');
  const o = h.rapikanPresensi_({ wa: '081234567890', nama_lengkap: 'Ani', kategori: 'Orang Tua', nilai_materi: 9, kelas_simulasi: 'IPA',
    minat_program: ['Tidak, terima kasih', 'Ya, program kerja sama sekolah'] });
  assert.ok(o.galat.nilai_materi && o.galat.nilai_sinergi && o.galat.nilai_teknis && o.galat.bagian_bermanfaat && o.galat.minat_program);
  assert.strictEqual(o.galat.kelas_simulasi, undefined);
  assert.strictEqual(o.data.kelas_simulasi, '');
});

test('presensi: pencocokan dengan pendaftar memakai WA kunci dan nama kunci', () => {
  const p = [{ wa_kunci: '6281234567890', nama_kunci: 'budi santoso', id_peserta: 'MJ-0001' }];
  assert.strictEqual(h.cariPendaftar_(p, '6281234567890', '  Budi   SANTOSO ').id_peserta, 'MJ-0001');
  assert.strictEqual(h.cariPendaftar_(p, '6281234567890', 'Budi Santosa'), null);
  assert.strictEqual(h.cariPendaftar_(p, '6281111111111', 'Budi Santoso'), null);
});

test('pertanyaan dan ringkasan feedback', () => {
  assert.deepStrictEqual(polos(h.rapikanPertanyaan_({ kategori: 'Siswa', jenjang: 'SD', pertanyaan: 'Apa itu OSN?' }).galat), {});
  assert.ok(h.rapikanPertanyaan_({ kategori: 'Murid', jenjang: 'SMA', pertanyaan: '' }).galat.pertanyaan);
  const r = h.ringkasPresensi_([
    { kategori: 'Siswa SD', kelas_simulasi: 'IPA', nilai_materi: '5', nilai_kelas: '4', nilai_tutor: '5', nilai_teknis: '4', status_cocok: 'Cocok', materi_dikirim: 'YA' },
    { kategori: 'Orang Tua', nilai_materi: '4', nilai_sinergi: '3', nilai_teknis: '5', status_cocok: 'Tidak ditemukan', materi_dikirim: 'TIDAK' }
  ]);
  assert.strictEqual(r.jumlah, 2);
  assert.strictEqual(r.tidak_cocok, 1);
  assert.strictEqual(r.materi_terkirim, 1);
  assert.strictEqual(r.materi, 4.5);
  assert.strictEqual(r.per_kelas.IPA.kelas, 4);
  assert.strictEqual(r.per_kelas.Matematika.kelas, null);
});

test('status form presensi dan pertanyaan dari pengaturan', () => {
  const s = h.hitungStatus_({ form_pendaftaran: 'TUTUP', form_presensi: 'buka', form_pertanyaan: 'TUTUP' }, Date.now());
  assert.deepStrictEqual(polos(s.form), { pendaftaran: 'TUTUP', presensi: 'BUKA', pertanyaan: 'TUTUP' });
});
