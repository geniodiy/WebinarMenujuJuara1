/**
 * Panel admin (PRD Bagian 13): masuk, ringkasan, pengaturan, data pendaftar, dan unduhan.
 * Setiap fungsi admin* memeriksa token dan peran di server; tampilan hanya pelengkap.
 */

var DETIK_SESI_ = 6 * 3600;
var BATAS_GAGAL_LOGIN_ = 20;
var JENDELA_GAGAL_MS_ = 15 * 60 * 1000;
var KUNCI_PENGATURAN_ADMIN_ = [
  'form_pendaftaran', 'pendaftaran_buka', 'pendaftaran_tutup', 'tanggal_hari_h', 'link_grup_wa',
  'kuota_sd_matematika', 'kuota_sd_ipa', 'kuota_sd_ips', 'kuota_smp_matematika', 'kuota_smp_ipa', 'kuota_smp_ips',
  'mode_uji', 'tampilkan_data_contoh'
];

/* ---------- Masuk dan sesi ---------- */

/** Mencatat satu login gagal; mengembalikan daftar baru dan apakah login harus dikunci. Murni. */
function catatPercobaanGagal_(daftar, sekarang) {
  var baru = (daftar || []).filter(function (t) { return sekarang - t < JENDELA_GAGAL_MS_; });
  baru.push(sekarang);
  return { daftar: baru, kunci: baru.length >= BATAS_GAGAL_LOGIN_ };
}

/** Perbandingan yang waktunya tidak bergantung pada posisi karakter pertama yang berbeda. */
function samaAman_(a, b) {
  var beda = a.length ^ b.length;
  for (var i = 0; i < Math.max(a.length, b.length); i++) {
    beda |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return beda === 0;
}

function adminLogin(password) {
  return jalankanAman_(function () {
    var cache = CacheService.getScriptCache();
    if (cache.get('login_kunci')) {
      return gagal_('TERKUNCI', 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.');
    }
    var sandiAdmin = properti_('ADMIN_PASSWORD');
    if (!sandiAdmin) return gagal_('BELUM_DIATUR', 'Kata sandi admin belum diatur di Script Properties (ADMIN_PASSWORD).');

    var peran = samaAman_(String(password || ''), sandiAdmin) ? 'admin' : '';
    if (!peran) {
      var hasil = catatPercobaanGagal_(JSON.parse(cache.get('login_gagal') || '[]'), Date.now());
      cache.put('login_gagal', JSON.stringify(hasil.daftar), JENDELA_GAGAL_MS_ / 1000);
      catatLog_('-', 'login gagal', '', '', '');
      if (hasil.kunci) {
        cache.put('login_kunci', '1', JENDELA_GAGAL_MS_ / 1000);
        catatLog_('-', 'login dikunci 15 menit', '', '', '');
      }
      Utilities.sleep(2000);
      return gagal_('SALAH', 'Kata sandi salah.');
    }

    var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    cache.put('sesi_' + token, JSON.stringify({ peran: peran }), DETIK_SESI_);
    return ok_({ token: token, peran: peran });
  });
}

function adminKeluar(token) {
  return jalankanAman_(function () {
    if (/^[a-f0-9]{64}$/.test(String(token))) CacheService.getScriptCache().remove('sesi_' + token);
    return ok_(true);
  });
}

/** Melempar SESI bila token tidak berlaku, AKSES bila peran tidak diizinkan. */
function sesi_(token, peranBoleh) {
  var data = /^[a-f0-9]{64}$/.test(String(token)) ? CacheService.getScriptCache().get('sesi_' + token) : null;
  if (!data) throw galatKode_('SESI', 'Sesi admin berakhir. Silakan masuk lagi.');
  var s = JSON.parse(data);
  if (peranBoleh.indexOf(s.peran) < 0) throw galatKode_('AKSES', 'Anda tidak punya akses ke menu ini.');
  return s;
}

/** Fungsi panitia: membuka kunci login setelah 20 kali gagal. */
function bukaKunciLogin() {
  penjagaPanitia_();
  CacheService.getScriptCache().removeAll(['login_kunci', 'login_gagal']);
  return lapor_('Kunci login dibuka. Admin bisa mencoba masuk lagi.');
}

function catatLog_(peran, aksi, kunci, lama, baru) {
  try {
    var lembar = bukaDb_().getSheetByName('Log_Admin');
    if (!lembar) return;
    var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm:ss');
    lembar.appendRow([waktu, peran, aksi, kunci, lama, baru].map(function (v) { return sanitasiSel_(String(v == null ? '' : v)); }));
  } catch (err) {
    console.warn('Log_Admin gagal ditulis: ' + err);
  }
}

/* ---------- Pengaturan ---------- */

function tampilkanContohSaatIni_() {
  return yaTidak_(kunciNilai_(bacaLembar_(bukaKonten_().getSheetByName('Pengaturan_Konten'))).tampilkan_data_contoh) ? 'YA' : 'TIDAK';
}

function pengaturanAdmin_() {
  var peng = bacaPengaturan_(true);
  var hasil = {};
  KUNCI_PENGATURAN_ADMIN_.forEach(function (k) { if (k !== 'tampilkan_data_contoh') hasil[k] = String(peng[k] == null ? '' : peng[k]); });
  hasil.tampilkan_data_contoh = tampilkanContohSaatIni_();
  return hasil;
}

/** Hanya kunci yang dikenal, dirapikan. "YYYY-MM-DDTHH:mm" dari input browser diubah ke "YYYY-MM-DD HH:mm". Murni. */
function rapikanPerubahan_(perubahan) {
  var hasil = {};
  KUNCI_PENGATURAN_ADMIN_.forEach(function (k) {
    if (!perubahan || perubahan[k] == null) return;
    var v = String(perubahan[k]).trim();
    if (k === 'pendaftaran_buka' || k === 'pendaftaran_tutup') v = v.replace('T', ' ').slice(0, 16);
    if (k === 'form_pendaftaran' || k === 'mode_uji' || k === 'tampilkan_data_contoh') v = v.toUpperCase();
    hasil[k] = v.slice(0, 500);
  });
  return hasil;
}

/** Galat pengaturan sebagai peta kunci ke pesan. Murni. */
function validasiPengaturan_(p) {
  var g = {};
  if (['OTOMATIS', 'BUKA', 'TUTUP'].indexOf(p.form_pendaftaran) < 0) g.form_pendaftaran = 'Pilih salah satu mode.';
  var buka = parseWaktuWib_(p.pendaftaran_buka);
  var tutup = parseWaktuWib_(p.pendaftaran_tutup);
  if (isNaN(buka)) g.pendaftaran_buka = 'Isi tanggal dan jam buka.';
  if (isNaN(tutup)) g.pendaftaran_tutup = 'Isi tanggal dan jam tutup.';
  if (!isNaN(buka) && !isNaN(tutup) && tutup <= buka) g.pendaftaran_tutup = 'Jam tutup harus setelah jam buka.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.tanggal_hari_h || '') || isNaN(parseWaktuWib_(p.tanggal_hari_h))) g.tanggal_hari_h = 'Isi tanggal hari H.';
  if (p.link_grup_wa && !/^https:\/\/\S+$/.test(p.link_grup_wa)) g.link_grup_wa = 'Link harus diawali https://';
  KUNCI_PENGATURAN_ADMIN_.filter(function (k) { return k.indexOf('kuota_') === 0; }).forEach(function (k) {
    if (!/^\d{1,5}$/.test(String(p[k]))) g[k] = 'Isi angka 0 atau lebih (0 berarti tanpa batas).';
  });
  ['mode_uji', 'tampilkan_data_contoh'].forEach(function (k) {
    if (['YA', 'TIDAK'].indexOf(p[k]) < 0) g[k] = 'Pilih YA atau TIDAK.';
  });
  return g;
}

function gabungPengaturan_(lama, perubahan) {
  var g = {};
  Object.keys(lama).forEach(function (k) { g[k] = lama[k]; });
  Object.keys(perubahan).forEach(function (k) { g[k] = perubahan[k]; });
  return g;
}

function dataPengaturan_(peng) {
  var sekarang = Date.now();
  return { pengaturan: peng, status: hitungStatus_(peng, sekarang), jam_server: sekarang };
}

function adminGetSettings(token) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    return ok_(dataPengaturan_(pengaturanAdmin_()));
  });
}

/** Status yang akan berlaku bila perubahan disimpan, tanpa menyimpan apa pun. */
function adminPratinjau(token, perubahan) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    var gabung = gabungPengaturan_(pengaturanAdmin_(), rapikanPerubahan_(perubahan));
    return ok_({ status: hitungStatus_(gabung, Date.now()), galat: validasiPengaturan_(gabung) });
  });
}

function adminSaveSettings(token, perubahan) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    var bersih = rapikanPerubahan_(perubahan);
    return denganKunci_(function () {
      var lama = pengaturanAdmin_();
      var gabung = gabungPengaturan_(lama, bersih);
      var galat = validasiPengaturan_(gabung);
      if (Object.keys(galat).length) {
        var g = gagal_('VALIDASI', 'Ada pengaturan yang belum sesuai.');
        g.error.kolom = galat;
        return g;
      }
      var berubah = Object.keys(bersih).filter(function (k) { return bersih[k] !== lama[k]; });
      var lembar = bukaDb_().getSheetByName('Pengaturan');
      var kunciAda = lembar.getRange(1, 1, lembar.getLastRow(), 1).getValues().map(function (b) { return String(b[0]).trim(); });
      berubah.forEach(function (k) {
        if (k === 'tampilkan_data_contoh') {
          var pk = bukaKonten_().getSheetByName('Pengaturan_Konten');
          tambahKunci_(pk, [[k, bersih[k], '']], false);
          aturKunci_(pk, k, bersih[k]);
        } else {
          var i = kunciAda.indexOf(k);
          if (i >= 0) {
            lembar.getRange(i + 1, 2).setValue(bersih[k]);
          } else {
            lembar.appendRow([k, bersih[k], '']);
            kunciAda.push(k);
          }
        }
        catatLog_(s.peran, 'ubah pengaturan', k, lama[k], bersih[k]);
      });
      bersihkanCache_();
      return ok_(dataPengaturan_(gabung));
    });
  });
}

/* ---------- Data ---------- */

function barisPendaftar_(sertakanUji) {
  var semua = bacaLembar_(bukaDb_().getSheetByName('Pendaftar'));
  return sertakanUji ? semua : semua.filter(function (b) { return !yaTidak_(b.uji); });
}

/** Orang yang menyetujui informasi program saat mendaftar. Murni. */
function saringProspek_(baris) {
  return baris.filter(function (b) { return yaTidak_(b.setuju_info_program); }).map(function (b) {
    var o = {};
    Object.keys(b).forEach(function (k) { o[k] = b[k]; });
    o.sumber_persetujuan = b.didaftarkan_oleh && b.didaftarkan_oleh !== 'MANDIRI'
      ? 'Pendaftaran (persetujuan pendamping)'
      : 'Pendaftaran';
    return o;
  });
}

function ringkasan_(semua, peng) {
  var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm');
  var rekap = hitungRekap_(semua, peng, waktu);
  var sekarang = Date.now();
  return {
    rekap: rekap,
    status: hitungStatus_(peng, sekarang),
    jam_server: sekarang,
    peringatan: { mode_uji: yaTidak_(peng.mode_uji), data_contoh: tampilkanContohSaatIni_() === 'YA' },
    jumlah_uji: semua.filter(function (b) { return yaTidak_(b.uji); }).length
  };
}

/** jenis: ringkasan, pendaftar, prospek, semua (untuk unduhan). */
function adminGetData(token, jenis, sertakanUji) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    var uji = sertakanUji === true;
    if (jenis === 'ringkasan') return ok_(ringkasan_(barisPendaftar_(true), bacaPengaturan_(true)));
    if (jenis === 'pendaftar') return ok_({ baris: barisPendaftar_(uji) });
    if (jenis === 'prospek') return ok_({ baris: saringProspek_(barisPendaftar_(uji)) });
    if (jenis === 'semua') {
      var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm');
      return ok_({ pendaftar: barisPendaftar_(uji), rekap: hitungRekap_(barisPendaftar_(true), bacaPengaturan_(true), waktu) });
    }
    return gagal_('VALIDASI', 'Jenis data tidak dikenal.');
  });
}

function adminCatatUnduhan(token, jenis) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    catatLog_(s.peran, 'unduh data', String(jenis).slice(0, 40), '', '');
    return ok_(true);
  });
}
