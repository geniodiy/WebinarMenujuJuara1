/**
 * Helper umum. Fungsi murni (tanpa layanan Apps Script) ditulis terpisah
 * agar bisa diuji dengan Node (lihat tests/).
 */

var ZONA_WAKTU_ = 'Asia/Jakarta';
var SELISIH_WIB_MS_ = 7 * 3600 * 1000;
var SATU_HARI_MS_ = 24 * 3600 * 1000;

/** Galat dengan kode yang diteruskan apa adanya ke browser (misalnya SESI). */
function galatKode_(kode, pesan) {
  var e = new Error(pesan);
  e.kode = kode;
  return e;
}

function ok_(data) {
  return { ok: true, data: data };
}

function gagal_(code, message) {
  return { ok: false, error: { code: code, message: message } };
}

/** Membungkus fungsi publik agar galat tak terduga tetap berbentuk { ok: false }. */
function jalankanAman_(fn) {
  try {
    return fn();
  } catch (err) {
    if (err && err.kode) return gagal_(err.kode, err.message);
    console.error(err && err.stack ? err.stack : err);
    return gagal_('SERVER', 'Terjadi kendala di server. Silakan coba lagi sebentar lagi.');
  }
}

/** 08xxx, 628xxx, +628xxx (boleh spasi dan tanda hubung) menjadi 628xxx. */
function normalisasiWa_(nilai) {
  var angka = String(nilai == null ? '' : nilai).replace(/[^\d]/g, '');
  if (angka.indexOf('0') === 0) angka = '62' + angka.slice(1);
  return angka;
}

function waValid_(waTernormalisasi) {
  return /^628\d{7,11}$/.test(waTernormalisasi);
}

/** Huruf kecil dan spasi dirapikan, untuk pencocokan nama. */
function namaKunci_(nama) {
  return String(nama == null ? '' : nama).toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Mencegah isian dibaca sebagai rumus oleh spreadsheet. */
function sanitasiSel_(nilai) {
  if (typeof nilai !== 'string') return nilai;
  return /^[=+\-@]/.test(nilai) ? "'" + nilai : nilai;
}

function potong_(nilai, panjang) {
  return String(nilai == null ? '' : nilai).trim().slice(0, panjang);
}

function yaTidak_(nilai) {
  return String(nilai == null ? '' : nilai).trim().toUpperCase() === 'YA';
}

/** Menerima ID atau URL Google Sheets/Drive, mengembalikan ID-nya saja. */
function ambilIdDariUrl_(teks) {
  var s = String(teks == null ? '' : teks).trim();
  var cocok = s.match(/\/d\/([\w-]{20,})/) || s.match(/folders\/([\w-]{20,})/) || s.match(/[?&]id=([\w-]{20,})/);
  if (cocok) return cocok[1];
  return /^[\w-]{20,}$/.test(s) ? s : '';
}

/** JSON yang aman disisipkan di dalam tag <script>. */
function jsonAman_(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function denganKunci_(fn) {
  var kunci = LockService.getScriptLock();
  if (!kunci.tryLock(20000)) {
    throw new Error('Server sedang sibuk. Silakan coba lagi beberapa detik lagi.');
  }
  try {
    return fn();
  } finally {
    kunci.releaseLock();
  }
}

function properti_(nama) {
  return PropertiesService.getScriptProperties().getProperty(nama) || '';
}

function bukaDb_() {
  var id = ambilIdDariUrl_(properti_('DB_SHEET_ID'));
  if (!id) throw new Error('DB_SHEET_ID belum diisi di Script Properties.');
  return SpreadsheetApp.openById(id);
}

function bukaKonten_() {
  var id = ambilIdDariUrl_(properti_('KONTEN_SHEET_ID'));
  if (!id) throw new Error('KONTEN_SHEET_ID belum diisi di Script Properties.');
  return SpreadsheetApp.openById(id);
}

/** Membaca lembar sebagai daftar objek berdasarkan baris judul. Semua nilai berupa teks tampilan. */
function bacaLembar_(lembar) {
  if (!lembar || lembar.getLastRow() < 2) return [];
  var nilai = lembar.getDataRange().getDisplayValues();
  var judul = nilai[0].map(function (j) { return String(j).trim().toLowerCase(); });
  var hasil = [];
  for (var i = 1; i < nilai.length; i++) {
    var baris = {};
    for (var k = 0; k < judul.length; k++) {
      if (judul[k]) baris[judul[k]] = String(nilai[i][k]).trim();
    }
    hasil.push(baris);
  }
  return hasil;
}

function bersihkanCache_() {
  CacheService.getScriptCache().removeAll([KUNCI_CACHE_PENGATURAN_, KUNCI_CACHE_KONTEN_]);
}
