/**
 * Fungsi panitia (dijalankan dari editor Apps Script), pembuatan lembar, dan data contoh.
 *
 * KEPUTUSAN: proyek Apps Script berdiri sendiri (standalone), terpisah dari kedua spreadsheet,
 * sesuai yang sudah dibuat pemilik. Akibatnya tidak ada menu "Genio" di spreadsheet: fungsi
 * panitia dijalankan dari editor (pilih nama fungsi, lalu Jalankan) dan hasilnya tampil di log
 * eksekusi. ID spreadsheet dan folder diisi di Script Properties. Perubahan di Konten Website
 * tampil sendiri paling lambat 5 menit, dan daftar gambar dipindai ulang otomatis.
 */

var KOLOM_PENDAFTAR_ = [
  'id_peserta', 'id_pendaftaran', 'waktu_daftar', 'peran', 'didaftarkan_oleh',
  'nama_lengkap', 'nama_kunci', 'wa', 'wa_kunci', 'email', 'kota', 'kelas', 'kategori',
  'asal_sekolah', 'bidang', 'room', 'pengalaman_osn', 'siswa_genio', 'perangkat',
  'sekolah_mengajar', 'jenjang_dibina', 'bidang_dibina',
  'daftarkan_siswa', 'jumlah_didaftarkan',
  'minat_jenjang_anak', 'minat_bidang_anak', 'anak_siswa_genio',
  'sumber_info', 'pertanyaan_narsum',
  'setuju_kehadiran', 'setuju_siswa_binaan', 'setuju_info_program',
  'sumber_link', 'uji'
];
// KEPUTUSAN: kolom Rekap belum dirinci di PRD; isinya diisi sistem mulai Fase 2.
var KOLOM_REKAP_ = ['kelompok', 'nama', 'jumlah', 'kuota', 'status', 'diperbarui'];
var KOLOM_LOG_ADMIN_ = ['waktu', 'peran', 'aksi', 'kunci', 'nilai_lama', 'nilai_baru'];
var KOLOM_KUNCI_NILAI_ = ['kunci', 'nilai', 'keterangan'];
var KOLOM_GAMBAR_ = ['nama_file', 'id_file', 'url', 'terakhir_diperbarui'];

var PENGATURAN_KONTEN_AWAL_ = [
  ['tampilkan_data_contoh', 'TIDAK', 'YA untuk pratinjau. Wajib TIDAK saat tayang'],
  ['tampil_tutor', 'YA', 'TIDAK menyembunyikan bagian Profil tutor kelas'],
  ['tampil_profil', 'YA', 'TIDAK menyembunyikan bagian Apa itu Genio'],
  ['tampil_cabang', 'YA', 'TIDAK menyembunyikan bagian Cabang'],
  ['tampil_prestasi', 'YA', 'TIDAK menyembunyikan bagian Prestasi'],
  ['tampil_ajakan', 'YA', 'TIDAK menyembunyikan bagian Ajakan bergabung'],
  ['judul_acara', '#MenujuJuara Eps. 1: Roadmap OSN 2027', ''],
  ['tagline', 'Pertajam Strategi, Kuatkan Sinergi, Genggam Prestasi', ''],
  ['tanggal_teks', 'Sabtu, 14 November 2026', ''],
  ['jam_teks', '08.00 WIB - Selesai', ''],
  ['media_teks', 'Zoom Meeting', ''],
  ['poster', 'poster-web.jpg', 'Nama file poster di folder Gambar Web (rasio 4:5)'],
  ['bonus_teks', 'Materi Kelas OSN', ''],
  ['bonus_syarat', 'Gratis untuk peserta yang mengisi presensi di hari H.', ''],
  ['narahubung_nama', 'Lily', ''],
  ['narahubung_wa', '6287838862882', 'Format 628xxx'],
  ['instagram_1', 'genio_institute', 'Tanpa @'],
  ['instagram_2', 'genio.diy', 'Tanpa @'],
  ['cta_judul', 'Tertarik bergabung dengan Genio?', ''],
  ['cta_kalimat', 'Konsultasi gratis via WhatsApp dengan admin cabang.', 'Satu kalimat pendukung'],
  ['cta_teks_tombol', 'Konsultasi Gratis via WhatsApp', ''],
  ['cta_pesan_wa', 'Halo Genio, saya tertarik dengan program olimpiade setelah melihat webinar Menuju Juara.', '']
];

var PROFIL_AWAL_ = [
  ['data_contoh', 'TIDAK', 'YA bila isi profil masih contoh'],
  ['judul', '', ''], ['paragraf_1', '', ''], ['paragraf_2', '', ''],
  ['angka_1', '', ''], ['label_1', '', ''], ['angka_2', '', ''], ['label_2', '', ''],
  ['angka_3', '', ''], ['label_3', '', ''], ['angka_4', '', ''], ['label_4', '', ''],
  ['program', '', 'Dipisah koma']
];

/**
 * Fungsi panitia bernama publik agar muncul di daftar Jalankan pada editor, sehingga bisa juga
 * dipanggil lewat google.script.run. Pengunjung web app tidak punya akun aktif yang sama dengan
 * pemilik skrip, jadi pemeriksaan ini menolak mereka.
 */
function penjagaPanitia_() {
  var aktif = Session.getActiveUser().getEmail();
  if (!aktif || aktif !== Session.getEffectiveUser().getEmail()) {
    throw new Error('Fungsi ini hanya bisa dijalankan pemilik skrip dari editor Apps Script.');
  }
}

function lapor_(pesan) {
  console.log(pesan);
  return pesan;
}

/** Memastikan Script Properties berisi ID yang bisa dibuka. */
function periksaProperti_() {
  var kurang = [];
  var cek = [
    ['DB_SHEET_ID', 'spreadsheet Database Webinar', function (id) { SpreadsheetApp.openById(id); }],
    ['KONTEN_SHEET_ID', 'spreadsheet Konten Website', function (id) { SpreadsheetApp.openById(id); }],
    ['GAMBAR_FOLDER_ID', 'folder Gambar Web', function (id) { DriveApp.getFolderById(id).getName(); }]
  ];
  cek.forEach(function (c) {
    var id = ambilIdDariUrl_(properti_(c[0]));
    try {
      if (!id) throw new Error('kosong');
      c[2](id);
      if (id !== properti_(c[0])) PropertiesService.getScriptProperties().setProperty(c[0], id);
    } catch (err) {
      kurang.push(c[0] + ' (' + c[1] + ')');
    }
  });
  if (kurang.length) {
    throw new Error('Script Properties belum diisi atau tidak bisa dibuka: ' + kurang.join(', ') +
      '. Isi di Setelan project > Properti skrip dengan ID atau URL-nya.');
  }
}

function siapkanLembar() {
  penjagaPanitia_();
  periksaProperti_();

  var db = bukaDb_();
  var pendaftar = pastikanLembar_(db, 'Pendaftar', KOLOM_PENDAFTAR_);
  formatTeks_(pendaftar, ['wa', 'wa_kunci', 'kelas']);
  var pengaturan = pastikanLembar_(db, 'Pengaturan', KOLOM_KUNCI_NILAI_);
  formatTeks_(pengaturan, ['nilai']);
  tambahKunci_(pengaturan, PENGATURAN_AWAL_, false);
  pastikanLembar_(db, 'Rekap', KOLOM_REKAP_);
  pastikanLembar_(db, 'Log_Admin', KOLOM_LOG_ADMIN_);
  hapusLembarKosongBawaan_(db);

  var konten = bukaKonten_();
  var pk = pastikanLembar_(konten, 'Pengaturan_Konten', KOLOM_KUNCI_NILAI_);
  formatTeks_(pk, ['nilai']);
  tambahKunci_(pk, PENGATURAN_KONTEN_AWAL_, false);
  Object.keys(LEMBAR_DAFTAR_KONTEN_).forEach(function (nama) {
    var lembar = pastikanLembar_(konten, nama, KOLOM_BERSAMA_.concat(LEMBAR_DAFTAR_KONTEN_[nama]));
    formatTeks_(lembar, ['jam', 'wa_admin', 'tahun']);
    aturPilihan_(lembar, 'tampil', ['YA', 'TIDAK']);
    aturPilihan_(lembar, 'data_contoh', ['YA', 'TIDAK']);
    aturPilihan_(lembar, 'jenis', JENIS_PRESTASI_);
    aturPilihan_(lembar, 'medali', JENIS_PRESTASI_);
  });
  var profil = pastikanLembar_(konten, 'Profil', KOLOM_KUNCI_NILAI_);
  formatTeks_(profil, ['nilai']);
  tambahKunci_(profil, PROFIL_AWAL_, false);
  pastikanLembar_(konten, 'Gambar', KOLOM_GAMBAR_);
  hapusLembarKosongBawaan_(konten);

  bersihkanCache_();
  return lapor_('Lembar siap. Lembar di Database Webinar dan Konten Website sudah dibuat atau dilengkapi; data yang sudah ada tidak diubah.');
}

/** Membuat lembar bila belum ada dan menambahkan kolom yang belum ada di ujung, tanpa menghapus data. */
function pastikanLembar_(ss, nama, kolom) {
  var lembar = ss.getSheetByName(nama) || ss.insertSheet(nama);
  var ada = lembar.getLastColumn() > 0
    ? lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0].map(function (j) { return String(j).trim(); })
    : [];
  var kurang = kolom.filter(function (k) { return ada.indexOf(k) < 0; });
  if (kurang.length) {
    var mulai = ada.filter(String).length === 0 ? 1 : lembar.getLastColumn() + 1;
    if (lembar.getMaxColumns() < mulai + kurang.length - 1) {
      lembar.insertColumnsAfter(lembar.getMaxColumns(), mulai + kurang.length - 1 - lembar.getMaxColumns());
    }
    lembar.getRange(1, mulai, 1, kurang.length).setValues([kurang]);
  }
  lembar.getRange(1, 1, 1, lembar.getLastColumn()).setFontWeight('bold');
  lembar.setFrozenRows(1);
  return lembar;
}

/** Format teks (@) agar nomor WA dan tanggal tidak diubah otomatis oleh spreadsheet. */
function formatTeks_(lembar, namaKolom) {
  var judul = lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0];
  namaKolom.forEach(function (n) {
    var i = judul.indexOf(n);
    if (i >= 0) lembar.getRange(1, i + 1, lembar.getMaxRows(), 1).setNumberFormat('@');
  });
}

/** Dropdown pilihan untuk satu kolom (bila kolomnya ada), dari baris 2 sampai bawah. */
function aturPilihan_(lembar, namaKolom, pilihan) {
  var judul = lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0];
  var i = judul.indexOf(namaKolom);
  if (i < 0 || lembar.getMaxRows() < 2) return;
  var aturan = SpreadsheetApp.newDataValidation().requireValueInList(pilihan, true).setAllowInvalid(false).build();
  lembar.getRange(2, i + 1, lembar.getMaxRows() - 1, 1).setDataValidation(aturan);
}

/** Menulis daftar objek sebagai baris sesuai judul kolom. Bila ganti, isi lama dihapus dulu. */
function tulisBarisObjek_(lembar, daftar, ganti) {
  var judul = lembar.getRange(1, 1, 1, lembar.getLastColumn()).getValues()[0].map(function (j) { return String(j).trim(); });
  if (ganti && lembar.getLastRow() > 1) lembar.getRange(2, 1, lembar.getLastRow() - 1, judul.length).clearContent();
  if (!daftar.length) return;
  var baris = daftar.map(function (obj) {
    return judul.map(function (j) { return obj[j] == null ? '' : sanitasiSel_(obj[j]); });
  });
  var mulai = ganti ? 2 : lembar.getLastRow() + 1;
  if (lembar.getMaxRows() < mulai + baris.length - 1) lembar.insertRowsAfter(lembar.getMaxRows(), mulai + baris.length - 1 - lembar.getMaxRows());
  lembar.getRange(mulai, 1, baris.length, judul.length).setValues(baris);
}

/**
 * Menambah baris kunci yang belum ada. Bila isiKosong, nilai kosong pada kunci yang ada ikut diisi.
 * Mengembalikan jumlah kunci yang ditambah atau diisi.
 */
function tambahKunci_(lembar, pasangan, isiKosong) {
  var ada = {};
  if (lembar.getLastRow() > 1) {
    lembar.getRange(2, 1, lembar.getLastRow() - 1, 2).getValues().forEach(function (b, i) {
      ada[String(b[0]).trim()] = { baris: i + 2, nilai: String(b[1]) };
    });
  }
  var baru = [];
  var diisi = 0;
  pasangan.forEach(function (p) {
    var lama = ada[p[0]];
    if (!lama) {
      baru.push([p[0], p[1], p[2] || '']);
    } else if (isiKosong && lama.nilai === '' && p[1] !== '') {
      lembar.getRange(lama.baris, 2).setValue(p[1]);
      diisi++;
    }
  });
  if (baru.length) lembar.getRange(lembar.getLastRow() + 1, 1, baru.length, 3).setValues(baru);
  return baru.length + diisi;
}

function hapusLembarKosongBawaan_(ss) {
  ['Sheet1', 'Lembar1', 'Lembar 1'].forEach(function (n) {
    var l = ss.getSheetByName(n);
    if (l && ss.getSheets().length > 1 && l.getLastRow() === 0) ss.deleteSheet(l);
  });
}

function isiDataContoh() {
  penjagaPanitia_();
  var konten = bukaKonten_();
  var terisi = [];
  var dilewati = [];

  Object.keys(DATA_CONTOH_).forEach(function (nama) {
    var lembar = konten.getSheetByName(nama);
    if (!lembar) throw new Error('Lembar ' + nama + ' belum ada. Jalankan siapkanLembar dulu.');
    if (lembar.getLastRow() > 1) {
      dilewati.push(nama);
      return;
    }
    tulisBarisObjek_(lembar, DATA_CONTOH_[nama], false);
    terisi.push(nama);
  });

  var pk = konten.getSheetByName('Pengaturan_Konten');
  tambahKunci_(pk, PENGATURAN_KONTEN_AWAL_, true);
  aturKunci_(pk, 'tampilkan_data_contoh', 'YA');
  // Profil berisi teks yang sudah disepakati (bukan contoh), jadi hanya kunci yang masih kosong yang diisi.
  tambahKunci_(konten.getSheetByName('Profil'), PROFIL_GENIO_, true);

  bersihkanCache_();
  return lapor_('Data contoh. Diisi: ' + (terisi.join(', ') || '-') +
    '. Dilewati karena sudah berisi: ' + (dilewati.join(', ') || '-') +
    '. Profil dan Pengaturan_Konten: hanya kunci yang masih kosong yang diisi.' +
    ' tampilkan_data_contoh sekarang YA; ubah menjadi TIDAK sebelum tayang.');
}

/**
 * Fungsi panitia untuk Fase 5: mengisi teks profil yang disepakati, testimoni contoh (data_contoh YA),
 * dan contoh prestasi tutor. Data asli yang sudah ada tidak ditimpa: profil hanya ditulis bila masih
 * kosong atau masih contoh, testimoni hanya bila lembarnya kosong atau isinya contoh semua, dan
 * Prestasi_Tutor hanya bila kosong.
 */
function isiKontenFase5() {
  penjagaPanitia_();
  var konten = bukaKonten_();
  if (!konten.getSheetByName('Prestasi_Tutor')) throw new Error('Lembar Prestasi_Tutor belum ada. Jalankan siapkanLembar dulu.');
  var hasil = [];

  tambahKunci_(konten.getSheetByName('Pengaturan_Konten'), PENGATURAN_KONTEN_AWAL_, true);

  var lembarProfil = konten.getSheetByName('Profil');
  var profil = kunciNilai_(bacaLembar_(lembarProfil));
  var profilKosong = !PROFIL_GENIO_.some(function (p) { return p[0] !== 'data_contoh' && profil[p[0]]; });
  if (profilKosong || yaTidak_(profil.data_contoh)) {
    tambahKunci_(lembarProfil, PROFIL_GENIO_, false);
    PROFIL_GENIO_.forEach(function (p) { aturKunci_(lembarProfil, p[0], p[1]); });
    hasil.push('Profil diisi teks yang disepakati');
  } else {
    hasil.push('Profil dilewati karena sudah berisi data asli');
  }

  var testi = konten.getSheetByName('Testimoni');
  var barisTesti = bacaLembar_(testi);
  if (barisTesti.every(function (b) { return yaTidak_(b.data_contoh); })) {
    tulisBarisObjek_(testi, DATA_CONTOH_.Testimoni, true);
    hasil.push('Testimoni diisi ' + DATA_CONTOH_.Testimoni.length + ' contoh');
  } else {
    hasil.push('Testimoni dilewati karena berisi data asli');
  }

  var pt = konten.getSheetByName('Prestasi_Tutor');
  if (pt.getLastRow() < 2) {
    tulisBarisObjek_(pt, DATA_CONTOH_.Prestasi_Tutor, true);
    hasil.push('Prestasi_Tutor diisi ' + DATA_CONTOH_.Prestasi_Tutor.length + ' contoh');
  } else {
    hasil.push('Prestasi_Tutor dilewati karena sudah berisi');
  }

  // Nama foto contoh yang tidak ada di folder dikosongkan, agar tidak memicu pemindaian folder berulang.
  var nt = konten.getSheetByName('Narasumber_Tutor');
  var peta = petaGambar_(konten);
  var dikosongkan = 0;
  if (nt.getLastRow() > 1) {
    var data = nt.getDataRange().getValues();
    var iFoto = data[0].indexOf('foto');
    var iContoh = data[0].indexOf('data_contoh');
    for (var i = 1; i < data.length && iFoto >= 0 && iContoh >= 0; i++) {
      var foto = String(data[i][iFoto]).trim();
      if (foto && yaTidak_(data[i][iContoh]) && !peta[foto.toLowerCase()]) {
        nt.getRange(i + 1, iFoto + 1).setValue('');
        dikosongkan++;
      }
    }
  }
  if (dikosongkan) hasil.push(dikosongkan + ' nama foto contoh yang tidak ada di folder dikosongkan');

  bersihkanCache_();
  return lapor_(hasil.join('. ') + '. Untuk melihat data contoh, ubah tampilkan_data_contoh menjadi YA (di panel admin atau lembar Pengaturan_Konten).');
}

function aturKunci_(lembar, kunci, nilai) {
  var data = lembar.getRange(2, 1, Math.max(lembar.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === kunci) {
      lembar.getRange(i + 2, 2).setValue(nilai);
      return;
    }
  }
}

function perbaruiDaftarGambar() {
  penjagaPanitia_();
  var peta = perbaruiDaftarGambar_(bukaKonten_());
  bersihkanCache_();
  return lapor_('Daftar gambar diperbarui: ' + Object.keys(peta).length + ' gambar ditemukan di folder Gambar Web.');
}

/** Menghapus baris uji = YA. Mulai Fase 6 dan 7 ikut lembar Presensi dan Pertanyaan. */
function hapusDataUji() {
  penjagaPanitia_();
  var jumlah = denganKunci_(function () {
    var lembar = bukaDb_().getSheetByName('Pendaftar');
    var n = hapusBarisUji_(lembar);
    tulisRekap_(bacaLembar_(lembar), bacaPengaturan_());
    return n;
  });
  bersihkanCache_();
  return lapor_(jumlah + ' baris data uji dihapus dari lembar Pendaftar.');
}

function hapusBarisUji_(lembar) {
  if (!lembar || lembar.getLastRow() < 2) return 0;
  var data = lembar.getDataRange().getValues();
  var kolom = data[0].indexOf('uji');
  if (kolom < 0) return 0;
  var jumlah = 0;
  // Dari bawah ke atas agar nomor baris yang belum diproses tidak bergeser.
  for (var i = data.length - 1; i >= 1; i--) {
    if (yaTidak_(data[i][kolom])) {
      lembar.deleteRow(i + 1);
      jumlah++;
    }
  }
  return jumlah;
}

function bersihkanCache() {
  penjagaPanitia_();
  bersihkanCache_();
  return lapor_('Cache dibersihkan. Halaman pengunjung memakai data terbaru saat dimuat ulang.');
}
