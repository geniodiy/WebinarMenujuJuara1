/**
 * Penerimaan form pendaftaran (PRD Bagian 10) dan pembaruan lembar Rekap.
 */

var DETIK_KODE_KIRIMAN_ = 6 * 3600;
var DURASI_MINIMUM_MS_ = 5000;
var ROOM_ = ['SD Matematika', 'SD IPA', 'SD IPS', 'SMP Matematika', 'SMP IPA', 'SMP IPS'];
var KATEGORI_ = ['Siswa SD', 'Siswa SMP', 'Orang Tua', 'Guru Pembina'];

var logikaDaftarTersimpan_ = null;

/** Aturan bersama dari LogikaDaftar.html, dievaluasi sekali per eksekusi. */
function logikaDaftar_() {
  if (!logikaDaftarTersimpan_) {
    var sumber = HtmlService.createTemplateFromFile('LogikaDaftar').getRawContent()
      .replace(/^\s*<script>/, '')
      .replace(/<\/script>\s*$/, '');
    logikaDaftarTersimpan_ = new Function(sumber + '\nreturn LogikaDaftar;')();
  }
  return logikaDaftarTersimpan_;
}

function pesanTutup_() {
  return 'Pendaftaran sudah ditutup. Hubungi Lily di 0878-3886-2882 bila ada kendala.';
}

/**
 * Menerima kiriman form. Mengembalikan id_pendaftaran, daftar peserta, dan link grup WA.
 * Galat: TUTUP, DUPLIKAT, VALIDASI.
 */
function submitDaftar(data) {
  return jalankanAman_(function () {
    data = data || {};
    var kode = String(data.kode_kiriman || '');
    if (!/^[A-Za-z0-9-]{8,64}$/.test(kode)) return gagal_('VALIDASI', 'Form perlu dimuat ulang. Silakan muat ulang halaman lalu kirim lagi.');

    var cache = CacheService.getScriptCache();
    var tersimpan = cache.get('kirim_' + kode);
    if (tersimpan) return JSON.parse(tersimpan);

    if (String(data.hp || '') !== '' || !(Number(data.durasi_ms) >= DURASI_MINIMUM_MS_)) {
      return gagal_('VALIDASI', 'Pendaftaran belum bisa diproses. Periksa kembali isian Anda, lalu kirim lagi.');
    }

    var peng = bacaPengaturan_();
    if (hitungStatus_(peng, Date.now()).form.pendaftaran !== 'BUKA') return gagal_('TUTUP', pesanTutup_());

    var L = logikaDaftar_();
    var r = L.rapikan(data);
    var galat = L.validasiSemua(r);
    var kunciGalat = Object.keys(galat);
    if (kunciGalat.length) {
      var hasilGalat = gagal_('VALIDASI', 'Ada isian yang belum sesuai. Periksa kembali sebelum mengirim.');
      hasilGalat.error.kolom = galat;
      return hasilGalat;
    }
    r.sumber_link = String(data.sumber_link || '').replace(/[^\w.\-]/g, '').slice(0, 40);

    return denganKunci_(function () {
      // Diperiksa lagi di dalam kunci: dua ketukan cepat bisa sampai hampir bersamaan.
      var ulang = cache.get('kirim_' + kode);
      if (ulang) return JSON.parse(ulang);
      var hasil = simpanPendaftaran_(r, peng);
      if (hasil.ok) cache.put('kirim_' + kode, JSON.stringify(hasil), DETIK_KODE_KIRIMAN_);
      return hasil;
    });
  });
}

function simpanPendaftaran_(r, peng) {
  var lembar = bukaDb_().getSheetByName('Pendaftar');
  if (!lembar) throw new Error('Lembar Pendaftar belum ada. Jalankan siapkanLembar.');
  var nilai = lembar.getDataRange().getValues();
  var judul = nilai[0].map(function (j) { return String(j).trim(); });
  var ada = nilai.slice(1).map(function (b) {
    var o = {};
    judul.forEach(function (j, i) { o[j] = b[i] instanceof Date ? b[i].toISOString() : String(b[i]); });
    return o;
  });

  var uji = yaTidak_(peng.mode_uji) || /^\s*\[UJI\]/i.test(r.nama);
  var rencana = rencanakanPendaftaran_(r, ada, uji);
  if (!rencana.ok) return rencana;

  var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm:ss');
  var baris = rencana.baris.map(function (o) {
    o.waktu_daftar = waktu;
    o.sumber_link = r.sumber_link;
    return judul.map(function (j) { return sanitasiSel_(o[j] == null ? '' : String(o[j])); });
  });
  if (baris.length) lembar.getRange(lembar.getLastRow() + 1, 1, baris.length, judul.length).setValues(baris);

  if (rencana.perbaruiPendamping) {
    var p = rencana.perbaruiPendamping;
    var kolomJumlah = judul.indexOf('jumlah_didaftarkan');
    var kolomDaftarkan = judul.indexOf('daftarkan_siswa');
    if (kolomJumlah >= 0) lembar.getRange(p.baris, kolomJumlah + 1).setValue(String(p.jumlah));
    if (kolomDaftarkan >= 0) lembar.getRange(p.baris, kolomDaftarkan + 1).setValue('YA');
  }

  try {
    tulisRekap_(ada.concat(rencana.baris), peng);
  } catch (err) {
    // Rekap hanya ringkasan; pendaftaran yang sudah tersimpan tidak boleh gagal karenanya.
    console.warn('Rekap gagal diperbarui: ' + err);
  }

  var data = rencana.hasil;
  data.link_grup_wa = /^https:\/\//.test(String(peng.link_grup_wa || '')) ? String(peng.link_grup_wa) : '';
  return ok_(data);
}

/** Nomor urut berikutnya untuk awalan tertentu, misalnya MJ- atau UJI-REG-. Murni. */
function nomorBerikut_(daftarId, awalan) {
  var maks = 0;
  var pola = new RegExp('^' + awalan.replace(/[-]/g, '\\-') + '(\\d+)$');
  daftarId.forEach(function (id) {
    var m = String(id).match(pola);
    if (m) maks = Math.max(maks, parseInt(m[1], 10));
  });
  return maks + 1;
}

function formatId_(awalan, n) {
  return awalan + ('000' + n).slice(-Math.max(4, String(n).length));
}

function yt_(b) {
  return b ? 'YA' : 'TIDAK';
}

/**
 * Menentukan baris yang akan ditulis, termasuk cek daftar ganda dan pembuatan ID.
 * Murni: menerima isian yang sudah dirapikan dan isi lembar Pendaftar sebagai objek.
 */
function rencanakanPendaftaran_(r, ada, uji) {
  var L = logikaDaftar_();
  var awalPeserta = uji ? 'UJI-' : 'MJ-';
  // KEPUTUSAN: ID pendaftaran data uji memakai awalan UJI-REG- agar penomoran asli tetap mulai dari REG-0001.
  var awalDaftar = uji ? 'UJI-REG-' : 'REG-';
  var nPeserta = nomorBerikut_(ada.map(function (b) { return b.id_peserta; }), awalPeserta);
  var nDaftar = nomorBerikut_(ada.map(function (b) { return b.id_pendaftaran; }), awalDaftar);

  var indeks = {};
  ada.forEach(function (b, i) {
    indeks[b.wa_kunci + '|' + b.nama_kunci] = { baris: i + 2, data: b };
  });
  function cari(nama, waKunci) {
    return indeks[waKunci + '|' + L.namaKunci(nama)];
  }

  var ujiTeks = yt_(uji);
  var waUtama = r.wa;
  var lama = cari(r.nama, waUtama);
  var anak = r.anak || [];

  if (lama && (r.daftar_sebagai === 'Siswa' || anak.length === 0 || lama.data.peran === 'Siswa')) {
    return gagal_('DUPLIKAT', 'Peserta ini sudah terdaftar.');
  }

  var sudah = anak.filter(function (a) { return cari(a.nama, a.wa || waUtama); }).map(function (a) { return a.nama; });
  if (sudah.length) {
    var g = gagal_('DUPLIKAT', 'Sebagian siswa sudah terdaftar: ' + sudah.join(', ') + '. Hapus siswa tersebut dari daftar, lalu kirim lagi.');
    g.error.nama = sudah;
    return g;
  }

  var baris = [];
  var idDaftar;
  var idUtama;
  var perbaruiPendamping = null;
  var tambahan = false;

  if (lama) {
    // Pendamping yang sudah terdaftar menambah siswa: siswa baru disambungkan ke pendaftaran lama.
    tambahan = true;
    idDaftar = lama.data.id_pendaftaran;
    idUtama = lama.data.id_peserta;
    perbaruiPendamping = { baris: lama.baris, jumlah: (parseInt(lama.data.jumlah_didaftarkan, 10) || 0) + anak.length };
  } else {
    idDaftar = formatId_(awalDaftar, nDaftar);
    idUtama = formatId_(awalPeserta, nPeserta++);
    var utama = {
      id_peserta: idUtama,
      id_pendaftaran: idDaftar,
      didaftarkan_oleh: 'MANDIRI',
      nama_lengkap: r.nama,
      nama_kunci: L.namaKunci(r.nama),
      wa: waUtama,
      wa_kunci: waUtama,
      email: r.email,
      kota: r.kota,
      sumber_info: r.sumber_info.join(', '),
      pertanyaan_narsum: r.pertanyaan_narsum,
      setuju_kehadiran: yt_(r.setuju_kehadiran),
      setuju_info_program: yt_(r.setuju_info_program),
      uji: ujiTeks
    };
    if (r.daftar_sebagai === 'Siswa') {
      utama.peran = 'Siswa';
      utama.kelas = r.kelas;
      utama.kategori = L.kategoriDariKelas(r.kelas);
      utama.asal_sekolah = r.asal_sekolah;
      utama.bidang = r.bidang;
      utama.room = L.room(r.kelas, r.bidang);
      utama.pengalaman_osn = r.pengalaman_osn;
      utama.siswa_genio = r.siswa_genio;
    } else {
      utama.peran = r.peran;
      utama.kategori = r.peran;
      utama.daftarkan_siswa = r.daftarkan === 'Ya' ? 'YA' : 'TIDAK';
      utama.jumlah_didaftarkan = r.daftarkan === 'Ya' ? String(anak.length) : '0';
      if (r.peran === 'Guru Pembina') {
        utama.sekolah_mengajar = r.sekolah_mengajar;
        utama.jenjang_dibina = r.jenjang_dibina.join(', ');
        utama.bidang_dibina = r.bidang_dibina.join(', ');
        if (r.daftarkan === 'Ya') utama.setuju_siswa_binaan = yt_(r.setuju_siswa_binaan);
      }
      if (r.minat_jenjang_anak) {
        utama.minat_jenjang_anak = r.minat_jenjang_anak.join(', ');
        utama.minat_bidang_anak = r.minat_bidang_anak.join(', ');
        utama.anak_siswa_genio = r.anak_siswa_genio;
      }
    }
    baris.push(utama);
  }

  var kotaPendamping = lama ? lama.data.kota : r.kota;
  var setujuInfo = lama ? lama.data.setuju_info_program : yt_(r.setuju_info_program);
  anak.forEach(function (a) {
    baris.push({
      id_peserta: formatId_(awalPeserta, nPeserta++),
      id_pendaftaran: idDaftar,
      peran: 'Siswa',
      didaftarkan_oleh: idUtama,
      nama_lengkap: a.nama,
      nama_kunci: L.namaKunci(a.nama),
      wa: a.wa,
      wa_kunci: a.wa || waUtama,
      kota: kotaPendamping,
      kelas: a.kelas,
      kategori: L.kategoriDariKelas(a.kelas),
      asal_sekolah: a.asal_sekolah,
      bidang: a.bidang,
      room: L.room(a.kelas, a.bidang),
      pengalaman_osn: a.pengalaman_osn,
      siswa_genio: a.siswa_genio,
      perangkat: a.perangkat,
      setuju_info_program: setujuInfo,
      uji: ujiTeks
    });
  });

  return {
    ok: true,
    baris: baris,
    perbaruiPendamping: perbaruiPendamping,
    hasil: {
      id_pendaftaran: idDaftar,
      tambahan: tambahan,
      peserta: baris.map(function (b) {
        return { id: b.id_peserta, nama: b.nama_lengkap, kategori: b.kategori, room: b.room || '', perangkat: b.perangkat || '' };
      })
    }
  };
}

/** Baris lembar Rekap dari seluruh pendaftar (data uji tidak dihitung). Murni. */
function hitungRekap_(semua, peng, waktu) {
  var asli = semua.filter(function (b) { return !yaTidak_(b.uji); });
  function hitung(kolom, nilai) {
    return asli.filter(function (b) { return b[kolom] === nilai; }).length;
  }
  var hasil = [['Total', 'Semua pendaftar', asli.length, '', '', waktu]];
  KATEGORI_.forEach(function (k) { hasil.push(['Kategori', k, hitung('kategori', k), '', '', waktu]); });
  ROOM_.forEach(function (room) {
    var jumlah = hitung('room', room);
    var kuota = parseInt(peng['kuota_' + room.toLowerCase().replace(' ', '_')], 10) || 0;
    var status = 'tanpa batas';
    if (kuota > 0) status = jumlah >= kuota ? 'penuh' : jumlah > kuota * 0.9 ? 'hampir penuh' : 'aman';
    hasil.push(['Room', room, jumlah, kuota || '', status, waktu]);
  });
  hasil.push(['Prospek', 'Setuju informasi program', hitung('setuju_info_program', 'YA'), '', '', waktu]);
  return hasil;
}

function tulisRekap_(semua, peng) {
  var lembar = bukaDb_().getSheetByName('Rekap');
  if (!lembar) return;
  var waktu = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm');
  var baris = hitungRekap_(semua, peng, waktu);
  if (lembar.getLastRow() > 1) lembar.getRange(2, 1, lembar.getLastRow() - 1, 6).clearContent();
  lembar.getRange(2, 1, baris.length, 6).setValues(baris);
}

/** Fungsi panitia: menghitung ulang Rekap dari lembar Pendaftar. */
function perbaruiRekap() {
  penjagaPanitia_();
  var lembar = bukaDb_().getSheetByName('Pendaftar');
  tulisRekap_(bacaLembar_(lembar), bacaPengaturan_());
  return lapor_('Rekap diperbarui.');
}
