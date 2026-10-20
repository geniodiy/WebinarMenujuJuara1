/**
 * Pembacaan lembar Pengaturan dan penentuan fase acara.
 * Fase 1 sampai 5 hanya mengenal fase pendaftaran: belum_buka, daftar, tutup.
 */

var KUNCI_CACHE_PENGATURAN_ = 'pengaturan';
var DETIK_CACHE_PENGATURAN_ = 20;

/** [kunci, nilai awal, keterangan]. Kunci hari H ditambahkan di Fase 6 dan 7. */
var PENGATURAN_AWAL_ = [
  ['form_pendaftaran', 'OTOMATIS', 'OTOMATIS mengikuti tanggal; BUKA atau TUTUP untuk paksa'],
  ['pendaftaran_buka', '2026-10-19 00:00', 'Format YYYY-MM-DD HH:mm, WIB'],
  ['pendaftaran_tutup', '2026-11-07 23:59', 'Format YYYY-MM-DD HH:mm, WIB'],
  ['tanggal_hari_h', '2026-11-14', 'Format YYYY-MM-DD'],
  ['link_grup_wa', '', 'Wajib diisi sebelum tayang. Hanya dikirim setelah pendaftaran berhasil'],
  ['kuota_sd_matematika', '0', '0 berarti tanpa batas'],
  ['kuota_sd_ipa', '0', '0 berarti tanpa batas'],
  ['kuota_sd_ips', '0', '0 berarti tanpa batas'],
  ['kuota_smp_matematika', '0', '0 berarti tanpa batas'],
  ['kuota_smp_ipa', '0', '0 berarti tanpa batas'],
  ['kuota_smp_ips', '0', '0 berarti tanpa batas'],
  ['mode_uji', 'YA', 'Selama YA, semua kiriman ditandai data uji']
];

/** "YYYY-MM-DD" atau "YYYY-MM-DD HH:mm" (WIB) menjadi milidetik. NaN bila tidak sah. */
function parseWaktuWib_(teks) {
  var m = String(teks == null ? '' : teks).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2})[:.](\d{2}))?$/);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], (m[4] ? +m[4] : 0) - 7, m[5] ? +m[5] : 0);
}

/** Nomor hari kalender menurut WIB, untuk menghitung selisih hari. */
function hariWib_(ms) {
  return Math.floor((ms + SELISIH_WIB_MS_) / SATU_HARI_MS_);
}

/**
 * Menghitung fase dan status form dari pengaturan pada waktu tertentu.
 * Murni: tidak memakai layanan Apps Script.
 */
function hitungStatus_(peng, sekarang) {
  var mode = String(peng.form_pendaftaran || 'OTOMATIS').trim().toUpperCase();
  var buka = parseWaktuWib_(peng.pendaftaran_buka);
  var tutup = parseWaktuWib_(peng.pendaftaran_tutup);
  // KEPUTUSAN: jam tutup berlaku sampai akhir menitnya (23:59 berarti sampai 23:59:59).
  var akhirTutup = tutup + 60 * 1000;

  var terbuka;
  if (mode === 'BUKA') terbuka = true;
  else if (mode === 'TUTUP') terbuka = false;
  else terbuka = sekarang >= buka && sekarang < akhirTutup;

  var fase = 'tutup';
  if (terbuka) fase = 'daftar';
  else if (mode !== 'BUKA' && mode !== 'TUTUP' && sekarang < buka) fase = 'belum_buka';

  var sisaHari = null;
  if (terbuka && !isNaN(tutup) && sekarang < akhirTutup) sisaHari = hariWib_(tutup) - hariWib_(sekarang);

  return {
    fase: fase,
    form: { pendaftaran: terbuka ? 'BUKA' : 'TUTUP' },
    pendaftaran_buka: isNaN(buka) ? null : buka,
    pendaftaran_tutup: isNaN(tutup) ? null : tutup,
    tanggal_hari_h: String(peng.tanggal_hari_h || ''),
    sisa_hari: sisaHari
  };
}

/** Isi lembar Pengaturan sebagai objek kunci ke teks, dengan cache 20 detik. segar = abaikan cache. */
function bacaPengaturan_(segar) {
  var cache = CacheService.getScriptCache();
  var tersimpan = segar ? null : cache.get(KUNCI_CACHE_PENGATURAN_);
  if (tersimpan) return JSON.parse(tersimpan);

  var peng = {};
  PENGATURAN_AWAL_.forEach(function (b) { peng[b[0]] = b[1]; });
  var lembar = bukaDb_().getSheetByName('Pengaturan');
  if (lembar && lembar.getLastRow() > 1) {
    lembar.getRange(2, 1, lembar.getLastRow() - 1, 2).getValues().forEach(function (b) {
      var kunci = String(b[0]).trim();
      if (!kunci) return;
      // Sel bisa berubah menjadi tanggal bila format teksnya hilang; kembalikan ke teks WIB.
      peng[kunci] = b[1] instanceof Date
        ? Utilities.formatDate(b[1], ZONA_WAKTU_, 'yyyy-MM-dd HH:mm')
        : String(b[1]).trim();
    });
  }
  cache.put(KUNCI_CACHE_PENGATURAN_, JSON.stringify(peng), DETIK_CACHE_PENGATURAN_);
  return peng;
}

/** Status publik: fase, status form, jam server. Tidak memuat link grup, kuota, atau data peserta. */
function getConfig() {
  return jalankanAman_(function () {
    var sekarang = Date.now();
    var status = hitungStatus_(bacaPengaturan_(), sekarang);
    status.jam_server = sekarang;
    return ok_(status);
  });
}
