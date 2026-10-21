/**
 * Spreadsheet laporan: salinan data pendaftar yang rapi untuk dilihat admin (urut dan filter bawaan
 * Google Sheets). Datanya disalin dari lembar Pendaftar oleh skrip, bukan lewat rumus, karena hasil
 * rumus seperti QUERY atau IMPORTRANGE tidak bisa diurutkan dengan filter bawaan.
 *
 * KEPUTUSAN: diperbarui otomatis tiap 10 menit lewat pemicu waktu, ditambah tombol "Perbarui sekarang"
 * di panel admin. Data uji tidak ikut. ID spreadsheet laporan disimpan di Script Properties
 * (LAPORAN_SHEET_ID) oleh fungsi siapkanLaporan.
 */

var NAMA_FILE_LAPORAN_ = 'Laporan Pendaftar #MenujuJuara Eps. 1';
var WARNA_LAPORAN_ = { kepala: '#54563B', belang: '#F6F7F2', garis: '#DDE5EC' };
// [kunci di lembar Pendaftar, judul kolom, lebar piksel]
var KOLOM_LAPORAN_ = [
  ['nama_lengkap', 'Nama Lengkap', 190],
  ['kategori', 'Kategori', 100],
  ['room', 'Room', 120],
  ['kelas', 'Kelas', 70],
  ['sekolah', 'Sekolah', 190],
  ['bidang', 'Bidang', 100],
  ['wa_kunci', 'WhatsApp', 120],
  ['email', 'Email', 190],
  ['kota', 'Kota/Kabupaten', 140],
  ['peran', 'Peran', 100],
  ['didaftarkan_oleh', 'Didaftarkan Oleh', 130],
  ['pengalaman_osn', 'Pengalaman OSN', 130],
  ['siswa_genio', 'Siswa Genio', 90],
  ['perangkat', 'Perangkat', 150],
  ['sumber_info', 'Sumber Informasi', 160],
  ['setuju_info_program', 'Setuju Info Program', 120],
  ['waktu_daftar', 'Waktu Daftar (WIB)', 140],
  ['id_peserta', 'ID Peserta', 110],
  ['id_pendaftaran', 'ID Pendaftaran', 120]
];

/** Baris laporan (terbaru di atas) dari baris lembar Pendaftar. Murni. */
function susunBarisLaporan_(baris) {
  var urut = baris.slice().sort(function (a, b) {
    return String(b.waktu_daftar || '').localeCompare(String(a.waktu_daftar || ''));
  });
  return urut.map(function (b) {
    return KOLOM_LAPORAN_.map(function (k) {
      var v = k[0] === 'sekolah' ? (b.asal_sekolah || b.sekolah_mengajar || '') : b[k[0]];
      return v == null ? '' : String(v);
    });
  });
}

/** Sidik isi laporan, untuk melewati penulisan ulang bila data tidak berubah. Murni kecuali digest. */
function sidikLaporan_(isi) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(isi));
  return bytes.map(function (x) { return ((x + 256) % 256).toString(16); }).join('');
}

function idLaporan_() {
  return ambilIdDariUrl_(properti_('LAPORAN_SHEET_ID'));
}

function urlLaporan_(id) {
  return 'https://docs.google.com/spreadsheets/d/' + id + '/edit';
}

/** Header, lebar kolom, baris belang, beku, dan filter. Dipanggil saat menyiapkan laporan. */
function tataLembarLaporan_(lembar) {
  var n = KOLOM_LAPORAN_.length;
  if (lembar.getMaxColumns() < n) lembar.insertColumnsAfter(lembar.getMaxColumns(), n - lembar.getMaxColumns());
  if (lembar.getMaxColumns() > n) lembar.deleteColumns(n + 1, lembar.getMaxColumns() - n);
  if (lembar.getMaxRows() < 1000) lembar.insertRowsAfter(lembar.getMaxRows(), 1000 - lembar.getMaxRows());
  var semua = lembar.getRange(1, 1, lembar.getMaxRows(), n);
  semua.setFontFamily('Poppins').setFontSize(10).setFontColor('#54563B').setVerticalAlignment('middle').setNumberFormat('@');
  var kepala = lembar.getRange(1, 1, 1, n);
  kepala.setValues([KOLOM_LAPORAN_.map(function (k) { return k[1]; })])
    .setFontWeight('bold').setFontColor('#FFFFFF').setBackground(WARNA_LAPORAN_.kepala).setWrap(true);
  lembar.setRowHeight(1, 34);
  KOLOM_LAPORAN_.forEach(function (k, i) { lembar.setColumnWidth(i + 1, k[2]); });
  lembar.setFrozenRows(1);
  lembar.setFrozenColumns(1);
  lembar.getBandings().forEach(function (b) { b.remove(); });
  semua.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor(WARNA_LAPORAN_.kepala).setFirstRowColor('#FFFFFF').setSecondRowColor(WARNA_LAPORAN_.belang);
  if (lembar.getFilter()) lembar.getFilter().remove();
  semua.createFilter();
  // Hanya peringatan: isi lembar ditimpa skrip, jadi perubahan manual akan hilang.
  lembar.protect().setDescription('Diisi otomatis dari lembar Pendaftar').setWarningOnly(true);
}

function tataRingkasanLaporan_(lembar) {
  lembar.getRange(1, 1, lembar.getMaxRows(), 5).setFontFamily('Poppins').setFontSize(10).setFontColor('#54563B');
  lembar.setColumnWidths(1, 1, 110);
  lembar.setColumnWidths(2, 1, 190);
  lembar.setColumnWidths(3, 3, 90);
  lembar.protect().setDescription('Diisi otomatis dari lembar Pendaftar').setWarningOnly(true);
}

/** Menulis ulang isi laporan bila data berubah. Mengembalikan waktu pembaruan (teks WIB). */
function perbaruiLaporan_() {
  var id = idLaporan_();
  if (!id) throw new Error('Laporan belum disiapkan. Jalankan siapkanLaporan di editor Apps Script.');
  var baris = barisPendaftar_(false);
  var isi = susunBarisLaporan_(baris);
  var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm');
  var sidik = sidikLaporan_(isi);
  var props = PropertiesService.getScriptProperties();
  if (sidik !== props.getProperty('LAPORAN_SIDIK')) {
    var ss = SpreadsheetApp.openById(id);
    var lembar = ss.getSheetByName('Pendaftar');
    var n = KOLOM_LAPORAN_.length;
    if (lembar.getMaxRows() < isi.length + 50) lembar.insertRowsAfter(lembar.getMaxRows(), isi.length + 50 - lembar.getMaxRows());
    if (lembar.getLastRow() > 1) lembar.getRange(2, 1, lembar.getLastRow() - 1, n).clearContent();
    if (isi.length) lembar.getRange(2, 1, isi.length, n).setValues(isi);
    var f = lembar.getFilter();
    if (!f || f.getRange().getNumRows() < lembar.getMaxRows()) {
      if (f) f.remove();
      lembar.getRange(1, 1, lembar.getMaxRows(), n).createFilter();
    }
    tulisRingkasanLaporan_(ss.getSheetByName('Ringkasan'), barisPendaftar_(true), waktu);
    props.setProperty('LAPORAN_SIDIK', sidik);
  }
  props.setProperty('LAPORAN_DIPERBARUI', waktu);
  return waktu;
}

function tulisRingkasanLaporan_(lembar, semua, waktu) {
  if (!lembar) return;
  var rekap = hitungRekap_(semua, bacaPengaturan_(true), waktu);
  lembar.clearContents();
  lembar.getRange(1, 1).setValue('Ringkasan pendaftar').setFontWeight('bold').setFontSize(12);
  lembar.getRange(2, 1).setValue('Diperbarui ' + waktu + ' WIB. Data uji tidak ikut.').setFontColor('#6B6E5A');
  var kepala = [['Kelompok', 'Nama', 'Jumlah', 'Kuota', 'Status']];
  lembar.getRange(4, 1, 1, 5).setValues(kepala).setFontWeight('bold').setFontColor('#FFFFFF').setBackground(WARNA_LAPORAN_.kepala);
  var isi = rekap.map(function (b) { return [b[0], b[1], b[2], b[3] === '' ? 'Tanpa batas' : b[3], b[4] || '']; });
  lembar.getRange(5, 1, isi.length, 5).setValues(isi).setBackground(null);
}

/**
 * Fungsi panitia: membuat (atau menata ulang) spreadsheet laporan di folder yang sama dengan
 * spreadsheet database, mengisinya, lalu memasang pembaruan otomatis tiap 10 menit.
 */
function siapkanLaporan() {
  penjagaPanitia_();
  var id = idLaporan_();
  var ss = null;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (err) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(NAMA_FILE_LAPORAN_);
    var berkas = DriveApp.getFileById(ss.getId());
    var induk = DriveApp.getFileById(bukaDb_().getId()).getParents();
    if (induk.hasNext()) berkas.moveTo(induk.next());
    PropertiesService.getScriptProperties().setProperty('LAPORAN_SHEET_ID', ss.getId());
  }
  var lembar = ss.getSheetByName('Pendaftar') || ss.insertSheet('Pendaftar', 0);
  var ringkasan = ss.getSheetByName('Ringkasan') || ss.insertSheet('Ringkasan');
  hapusLembarKosongBawaan_(ss);
  tataLembarLaporan_(lembar);
  tataRingkasanLaporan_(ringkasan);
  PropertiesService.getScriptProperties().deleteProperty('LAPORAN_SIDIK');
  perbaruiLaporan_();

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'perbaruiLaporanOtomatis') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('perbaruiLaporanOtomatis').timeBased().everyMinutes(10).create();
  return lapor_('Laporan siap dan diperbarui otomatis tiap 10 menit: ' + urlLaporan_(ss.getId()) +
    '. Bagikan file ini (akses Pelihat) ke akun panitia yang perlu melihatnya.');
}

/**
 * Dipanggil pemicu waktu. Harus bernama publik agar bisa dipakai pemicu; bila dipanggil dari luar
 * pemicu, hanya pemilik skrip yang boleh. Tidak mengembalikan data apa pun.
 */
function perbaruiLaporanOtomatis(e) {
  if (!(e && e.triggerUid)) penjagaPanitia_();
  if (!idLaporan_()) return;
  denganKunci_(function () { perbaruiLaporan_(); });
}

/* ---------- Untuk panel admin ---------- */

function infoLaporan_() {
  var id = idLaporan_();
  return { siap: !!id, url: id ? urlLaporan_(id) : '', diperbarui: properti_('LAPORAN_DIPERBARUI') };
}

function adminInfoLaporan(token) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    return ok_(infoLaporan_());
  });
}

function adminPerbaruiLaporan(token) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    if (!idLaporan_()) return gagal_('VALIDASI', 'Laporan belum disiapkan. Pemilik perlu menjalankan siapkanLaporan sekali di editor Apps Script.');
    denganKunci_(function () { perbaruiLaporan_(); });
    catatLog_(s.peran, 'perbarui laporan', '', '', '');
    return ok_(infoLaporan_());
  });
}
