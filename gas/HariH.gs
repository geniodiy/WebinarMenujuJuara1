/**
 * Fase 6 dan 7: presensi dan feedback (Form 2) serta form pertanyaan (Form 3).
 *
 * KEPUTUSAN (pemilik): materi tidak diunduh otomatis. Setelah presensi terkirim, peserta mendapat
 * konfirmasi bahwa materi dikirim admin dalam 1x24 jam; admin menandai pengiriman di panel admin.
 * KEPUTUSAN (pemilik): form pertanyaan dibuka sebelum hari H sampai admin menutupnya sebelum materi
 * disampaikan. Pertanyaan dihimpun lalu dibacakan saat acara; tanpa halaman moderator langsung.
 * KEPUTUSAN: karena form pertanyaan dibuka untuk semua peserta, kategori penanya ditambah "Siswa".
 * Buka dan tutup kedua form diatur manual lewat kunci form_presensi dan form_pertanyaan (BUKA/TUTUP).
 */

var KOLOM_PRESENSI_ = [
  'waktu', 'wa', 'wa_kunci', 'nama_lengkap', 'nama_kunci', 'kategori', 'kelas_simulasi',
  'nilai_materi', 'nilai_kelas', 'nilai_tutor', 'nilai_sinergi', 'nilai_teknis',
  'bagian_bermanfaat', 'topik_berikutnya', 'kritik_saran', 'minat_program',
  'status_cocok', 'id_peserta', 'materi_dikirim', 'uji'
];
var KOLOM_PERTANYAAN_ = ['waktu', 'nama', 'kategori', 'jenjang', 'pertanyaan', 'status', 'uji'];

var KATEGORI_PRESENSI_ = ['Siswa SD', 'Siswa SMP', 'Orang Tua', 'Guru Pembina'];
var KELAS_SIMULASI_ = ['Matematika', 'IPA', 'IPS'];
var MINAT_PROGRAM_ = ['Ya, program Olimpiade untuk siswa', 'Ya, program kerja sama sekolah', 'Tidak, terima kasih'];
var KATEGORI_PENANYA_ = ['Siswa', 'Orang Tua', 'Guru Pembina'];
var JENJANG_PENANYA_ = ['SD', 'SMP', 'SD dan SMP'];
var STATUS_PERTANYAAN_ = ['Belum dibahas', 'Sudah dibahas'];
var DURASI_MINIMUM_HARI_H_MS_ = 3000;

function siswaPresensi_(kategori) {
  return kategori === 'Siswa SD' || kategori === 'Siswa SMP';
}

function skala_(v) {
  var n = parseInt(v, 10);
  return n >= 1 && n <= 5 ? String(n) : '';
}

/**
 * Merapikan dan memeriksa isian presensi. Mengembalikan { data, galat } dengan galat berupa
 * peta kolom ke pesan. Isian bagian yang tidak tampil (2A atau 2B) dikosongkan. Murni.
 */
function rapikanPresensi_(d) {
  d = d || {};
  var r = {
    wa: normalisasiWa_(d.wa),
    nama_lengkap: potong_(d.nama_lengkap, 120).replace(/\s+/g, ' '),
    kategori: String(d.kategori || ''),
    kelas_simulasi: String(d.kelas_simulasi || ''),
    nilai_materi: skala_(d.nilai_materi),
    nilai_kelas: skala_(d.nilai_kelas),
    nilai_tutor: skala_(d.nilai_tutor),
    nilai_sinergi: skala_(d.nilai_sinergi),
    nilai_teknis: skala_(d.nilai_teknis),
    bagian_bermanfaat: potong_(d.bagian_bermanfaat, 1000),
    topik_berikutnya: potong_(d.topik_berikutnya, 1000),
    kritik_saran: potong_(d.kritik_saran, 1000),
    minat_program: (Array.isArray(d.minat_program) ? d.minat_program : [d.minat_program])
      .map(String).filter(function (m) { return MINAT_PROGRAM_.indexOf(m) >= 0; })
  };
  var g = {};
  if (!waValid_(r.wa)) g.wa = 'Isi nomor WhatsApp yang benar, misalnya 081234567890.';
  if (r.nama_lengkap.length < 2) g.nama_lengkap = 'Isi nama lengkap.';
  if (KATEGORI_PRESENSI_.indexOf(r.kategori) < 0) g.kategori = 'Pilih kategori peserta.';
  var siswa = siswaPresensi_(r.kategori);
  if (siswa) {
    if (KELAS_SIMULASI_.indexOf(r.kelas_simulasi) < 0) g.kelas_simulasi = 'Pilih kelas simulasi yang diikuti.';
    if (!r.nilai_kelas) g.nilai_kelas = 'Pilih nilai 1 sampai 5.';
    if (!r.nilai_tutor) g.nilai_tutor = 'Pilih nilai 1 sampai 5.';
    r.nilai_sinergi = '';
  } else {
    if (!r.nilai_sinergi) g.nilai_sinergi = 'Pilih nilai 1 sampai 5.';
    r.kelas_simulasi = '';
    r.nilai_kelas = '';
    r.nilai_tutor = '';
  }
  if (!r.nilai_materi) g.nilai_materi = 'Pilih nilai 1 sampai 5.';
  if (!r.nilai_teknis) g.nilai_teknis = 'Pilih nilai 1 sampai 5.';
  if (!r.bagian_bermanfaat) g.bagian_bermanfaat = 'Isi bagian acara yang paling bermanfaat.';
  if (!r.minat_program.length) g.minat_program = 'Pilih minimal satu jawaban.';
  if (r.minat_program.indexOf(MINAT_PROGRAM_[2]) >= 0 && r.minat_program.length > 1) {
    g.minat_program = '"Tidak, terima kasih" tidak bisa dipilih bersama pilihan lain.';
  }
  return { data: r, galat: g };
}

/** Baris pendaftar yang cocok (WA kunci dan nama kunci sama), atau null. Murni. */
function cariPendaftar_(pendaftar, wa, nama) {
  var nk = namaKunci_(nama);
  for (var i = 0; i < pendaftar.length; i++) {
    var b = pendaftar[i];
    if (String(b.wa_kunci) === wa && namaKunci_(b.nama_kunci || b.nama_lengkap) === nk) return b;
  }
  return null;
}

/** Rapikan dan periksa isian pertanyaan. Murni. */
function rapikanPertanyaan_(d) {
  d = d || {};
  var r = {
    nama: potong_(d.nama, 80),
    kategori: String(d.kategori || ''),
    jenjang: String(d.jenjang || ''),
    pertanyaan: potong_(d.pertanyaan, 1000)
  };
  var g = {};
  if (KATEGORI_PENANYA_.indexOf(r.kategori) < 0) g.kategori = 'Pilih kategori penanya.';
  if (JENJANG_PENANYA_.indexOf(r.jenjang) < 0) g.jenjang = 'Pilih jenjang.';
  if (r.pertanyaan.length < 5) g.pertanyaan = 'Tulis pertanyaan Anda.';
  return { data: r, galat: g };
}

function galatIsian_(galat) {
  var h = gagal_('VALIDASI', 'Ada isian yang belum sesuai. Periksa kembali sebelum mengirim.');
  h.error.kolom = galat;
  return h;
}

function waktuSekarang_() {
  return Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm:ss');
}

/** Menambah satu baris berdasarkan urutan judul di lembar. */
function tambahBaris_(lembar, o) {
  var judul = lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0].map(function (j) { return String(j).trim(); });
  lembar.appendRow(judul.map(function (j) { return sanitasiSel_(o[j] == null ? '' : String(o[j])); }));
}

/** Pemeriksaan bersama: bot (isian tersembunyi dan durasi) dan kiriman ganda karena ketukan dua kali. */
function periksaKiriman_(data) {
  if (String(data.hp || '') !== '' || !(Number(data.durasi_ms) >= DURASI_MINIMUM_HARI_H_MS_)) {
    return gagal_('VALIDASI', 'Kiriman belum bisa diproses. Periksa kembali isian Anda, lalu kirim lagi.');
  }
  if (!/^[A-Za-z0-9-]{8,64}$/.test(String(data.kode_kiriman || ''))) {
    return gagal_('VALIDASI', 'Form perlu dimuat ulang. Silakan muat ulang halaman lalu kirim lagi.');
  }
  return null;
}

/**
 * Presensi dan feedback. Galat: TUTUP, VALIDASI, TIDAK_DITEMUKAN (bisa dikirim ulang dengan
 * tetap_kirim), DUPLIKAT.
 */
function submitPresensi(data) {
  return jalankanAman_(function () {
    data = data || {};
    var cek = periksaKiriman_(data);
    if (cek) return cek;
    var cache = CacheService.getScriptCache();
    var kunciKirim = 'presensi_' + data.kode_kiriman;
    var lalu = cache.get(kunciKirim);
    if (lalu) return JSON.parse(lalu);

    var peng = bacaPengaturan_();
    if (hitungStatus_(peng, Date.now()).form.presensi !== 'BUKA') {
      return gagal_('TUTUP', 'Presensi belum dibuka atau sudah ditutup.');
    }
    var hasil = rapikanPresensi_(data);
    if (Object.keys(hasil.galat).length) return galatIsian_(hasil.galat);
    var r = hasil.data;

    var db = bukaDb_();
    var cocok = cariPendaftar_(bacaLembar_(db.getSheetByName('Pendaftar')), r.wa, r.nama_lengkap);
    if (!cocok && !data.tetap_kirim) {
      return gagal_('TIDAK_DITEMUKAN', 'Nama atau nomor tidak ditemukan di data pendaftar. Pastikan sama seperti saat mendaftar.');
    }

    return denganKunci_(function () {
      var ulang = cache.get(kunciKirim);
      if (ulang) return JSON.parse(ulang);
      var lembar = db.getSheetByName('Presensi');
      if (!lembar) throw new Error('Lembar Presensi belum ada. Jalankan siapkanLembar.');
      var nk = namaKunci_(r.nama_lengkap);
      var sudah = bacaLembar_(lembar).some(function (b) { return b.wa_kunci === r.wa && b.nama_kunci === nk; });
      if (sudah) return gagal_('DUPLIKAT', 'Presensi untuk nama ini sudah tercatat.');
      tambahBaris_(lembar, {
        waktu: waktuSekarang_(), wa: r.wa, wa_kunci: r.wa, nama_lengkap: r.nama_lengkap, nama_kunci: nk,
        kategori: r.kategori, kelas_simulasi: r.kelas_simulasi,
        nilai_materi: r.nilai_materi, nilai_kelas: r.nilai_kelas, nilai_tutor: r.nilai_tutor,
        nilai_sinergi: r.nilai_sinergi, nilai_teknis: r.nilai_teknis,
        bagian_bermanfaat: r.bagian_bermanfaat, topik_berikutnya: r.topik_berikutnya, kritik_saran: r.kritik_saran,
        minat_program: r.minat_program.join(', '),
        status_cocok: cocok ? 'Cocok' : 'Tidak ditemukan', id_peserta: cocok ? cocok.id_peserta : '',
        materi_dikirim: 'TIDAK', uji: yaTidak_(peng.mode_uji) ? 'YA' : 'TIDAK'
      });
      var ok = ok_({ nama: cocok && cocok.nama_lengkap ? cocok.nama_lengkap : r.nama_lengkap, cocok: !!cocok });
      cache.put(kunciKirim, JSON.stringify(ok), 6 * 3600);
      return ok;
    });
  });
}

/** Form pertanyaan. Galat: TUTUP, VALIDASI. */
function submitPertanyaan(data) {
  return jalankanAman_(function () {
    data = data || {};
    var cek = periksaKiriman_(data);
    if (cek) return cek;
    var cache = CacheService.getScriptCache();
    var kunciKirim = 'tanya_' + data.kode_kiriman;
    var lalu = cache.get(kunciKirim);
    if (lalu) return JSON.parse(lalu);

    var peng = bacaPengaturan_();
    if (hitungStatus_(peng, Date.now()).form.pertanyaan !== 'BUKA') {
      return gagal_('TUTUP', 'Form pertanyaan sudah ditutup. Silakan bertanya langsung saat acara lewat mikrofon atau chat Zoom.');
    }
    var hasil = rapikanPertanyaan_(data);
    if (Object.keys(hasil.galat).length) return galatIsian_(hasil.galat);
    var r = hasil.data;

    return denganKunci_(function () {
      var ulang = cache.get(kunciKirim);
      if (ulang) return JSON.parse(ulang);
      var lembar = bukaDb_().getSheetByName('Pertanyaan');
      if (!lembar) throw new Error('Lembar Pertanyaan belum ada. Jalankan siapkanLembar.');
      tambahBaris_(lembar, {
        waktu: waktuSekarang_(), nama: r.nama, kategori: r.kategori, jenjang: r.jenjang, pertanyaan: r.pertanyaan,
        status: STATUS_PERTANYAAN_[0], uji: yaTidak_(peng.mode_uji) ? 'YA' : 'TIDAK'
      });
      var ok = ok_({});
      cache.put(kunciKirim, JSON.stringify(ok), 6 * 3600);
      return ok;
    });
  });
}

/* ---------- Panel admin: tab Hari H ---------- */

function rata_(baris, kolom) {
  var n = baris.map(function (b) { return parseInt(b[kolom], 10); }).filter(function (x) { return x >= 1 && x <= 5; });
  if (!n.length) return null;
  return Math.round(n.reduce(function (a, b) { return a + b; }, 0) / n.length * 10) / 10;
}

/** Ringkasan presensi dan rata-rata nilai feedback. Murni. */
function ringkasPresensi_(presensi) {
  var siswa = presensi.filter(function (b) { return siswaPresensi_(b.kategori); });
  var perKelas = {};
  KELAS_SIMULASI_.forEach(function (k) {
    var b = siswa.filter(function (x) { return x.kelas_simulasi === k; });
    perKelas[k] = { jumlah: b.length, kelas: rata_(b, 'nilai_kelas'), tutor: rata_(b, 'nilai_tutor') };
  });
  return {
    jumlah: presensi.length,
    tidak_cocok: presensi.filter(function (b) { return b.status_cocok !== 'Cocok'; }).length,
    materi_terkirim: presensi.filter(function (b) { return yaTidak_(b.materi_dikirim); }).length,
    materi: rata_(presensi, 'nilai_materi'),
    sinergi: rata_(presensi, 'nilai_sinergi'),
    teknis: rata_(presensi, 'nilai_teknis'),
    per_kelas: perKelas
  };
}

function bacaDenganBaris_(lembar, sertakanUji) {
  return bacaLembar_(lembar).map(function (b, i) { b._baris = i + 2; return b; })
    .filter(function (b) { return sertakanUji || !yaTidak_(b.uji); });
}

function adminGetHariH(token, sertakanUji) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    var db = bukaDb_();
    var presensi = bacaDenganBaris_(db.getSheetByName('Presensi'), sertakanUji);
    var pertanyaan = bacaDenganBaris_(db.getSheetByName('Pertanyaan'), sertakanUji);
    return ok_({ presensi: presensi, pertanyaan: pertanyaan, ringkasan: ringkasPresensi_(presensi) });
  });
}

/**
 * Menandai materi terkirim (Presensi) atau status pembahasan (Pertanyaan). Baris dicocokkan lagi
 * dengan waktu kirim agar tidak salah baris bila lembar diubah sejak data dimuat.
 */
function adminTandaiHariH(token, jenis, baris, waktu, nilai) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    var nama = jenis === 'presensi' ? 'Presensi' : jenis === 'pertanyaan' ? 'Pertanyaan' : '';
    if (!nama) return gagal_('VALIDASI', 'Jenis tidak dikenal.');
    var kolomNama = jenis === 'presensi' ? 'materi_dikirim' : 'status';
    var boleh = jenis === 'presensi' ? ['YA', 'TIDAK'] : STATUS_PERTANYAAN_;
    if (boleh.indexOf(nilai) < 0) return gagal_('VALIDASI', 'Nilai tidak sah.');
    return denganKunci_(function () {
      var lembar = bukaDb_().getSheetByName(nama);
      var n = parseInt(baris, 10);
      if (!lembar || !(n >= 2) || n > lembar.getLastRow()) return gagal_('VALIDASI', 'Data tidak ditemukan. Muat ulang tab ini.');
      var judul = lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0].map(function (j) { return String(j).trim(); });
      var isi = lembar.getRange(n, 1, 1, judul.length).getDisplayValues()[0];
      if (String(isi[judul.indexOf('waktu')]).trim() !== String(waktu)) return gagal_('VALIDASI', 'Data sudah berubah. Muat ulang tab ini.');
      var k = judul.indexOf(kolomNama);
      var lama = isi[k];
      lembar.getRange(n, k + 1).setValue(nilai);
      catatLog_(s.peran, 'tandai ' + jenis, 'baris ' + n, lama, nilai);
      return ok_({ baris: n, nilai: nilai });
    });
  });
}
