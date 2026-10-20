/**
 * Pembacaan spreadsheet "Konten Website" untuk halaman publik.
 */

var KUNCI_CACHE_KONTEN_ = 'konten';
var DETIK_CACHE_KONTEN_ = 300;
var KOLOM_BERSAMA_ = ['urutan', 'tampil', 'data_contoh'];
var URL_THUMBNAIL_ = 'https://drive.google.com/thumbnail?id=';

/** Lembar daftar: nama lembar ke kolom khusus (setelah kolom bersama). */
var LEMBAR_DAFTAR_KONTEN_ = {
  Agenda: ['judul', 'deskripsi', 'sasaran', 'jam'],
  Narasumber_Tutor: ['peran', 'nama_lengkap', 'jabatan', 'room', 'foto', 'ringkasan', 'prestasi_binaan'],
  Cabang: ['nama', 'logo', 'alamat', 'link_maps', 'wa_admin', 'instagram'],
  Prestasi: ['tahun', 'nama_siswa', 'sekolah', 'jenjang', 'bidang', 'lomba', 'tingkat', 'medali', 'sorotan'],
  Testimoni: ['nama', 'keterangan', 'kutipan', 'foto'],
  FAQ: ['pertanyaan', 'jawaban']
};

/**
 * Menyaring baris konten: hanya tampil = YA, baris contoh hanya bila diizinkan,
 * baris kosong dibuang, lalu diurutkan. Murni.
 */
function saringBaris_(baris, tampilkanContoh) {
  return baris
    .filter(function (b) {
      if (!yaTidak_(b.tampil)) return false;
      if (yaTidak_(b.data_contoh) && !tampilkanContoh) return false;
      return Object.keys(b).some(function (k) { return KOLOM_BERSAMA_.indexOf(k) < 0 && b[k] !== ''; });
    })
    .map(function (b, i) {
      var hasil = { contoh: yaTidak_(b.data_contoh) };
      Object.keys(b).forEach(function (k) {
        if (KOLOM_BERSAMA_.indexOf(k) < 0) hasil[k] = b[k];
      });
      var urutan = parseFloat(b.urutan);
      hasil._urut = isNaN(urutan) ? Infinity : urutan;
      hasil._asal = i;
      return hasil;
    })
    .sort(function (a, b) { return a._urut - b._urut || a._asal - b._asal; })
    .map(function (b) {
      delete b._urut;
      delete b._asal;
      return b;
    });
}

/** Baris kunci/nilai menjadi objek. Murni. */
function kunciNilai_(baris) {
  var obj = {};
  baris.forEach(function (b) {
    if (b.kunci) obj[b.kunci] = b.nilai == null ? '' : b.nilai;
  });
  return obj;
}

function petaGambar_(ss) {
  var peta = {};
  bacaLembar_(ss.getSheetByName('Gambar')).forEach(function (b) {
    if (b.nama_file && b.id_file) peta[b.nama_file.toLowerCase()] = b.id_file;
  });
  return peta;
}

/** Memindai folder Gambar Web dan menulis ulang lembar Gambar. Mengembalikan peta nama ke ID. */
function perbaruiDaftarGambar_(ss) {
  var idFolder = ambilIdDariUrl_(properti_('GAMBAR_FOLDER_ID'));
  if (!idFolder) throw new Error('GAMBAR_FOLDER_ID belum diisi di Script Properties.');
  var file = DriveApp.getFolderById(idFolder).getFiles();
  var baris = [];
  var sekarang = Utilities.formatDate(new Date(), ZONA_WAKTU_, 'yyyy-MM-dd HH:mm');
  while (file.hasNext()) {
    var f = file.next();
    if (f.getMimeType().indexOf('image/') !== 0) continue;
    baris.push([f.getName(), f.getId(), URL_THUMBNAIL_ + f.getId() + '&sz=w800', sekarang]);
  }
  baris.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });

  var lembar = ss.getSheetByName('Gambar');
  if (lembar.getLastRow() > 1) lembar.getRange(2, 1, lembar.getLastRow() - 1, 4).clearContent();
  if (baris.length) lembar.getRange(2, 1, baris.length, 4).setValues(baris);

  var peta = {};
  baris.forEach(function (b) { peta[b[0].toLowerCase()] = b[1]; });
  return peta;
}

function urlGambar_(peta, namaFile) {
  var id = namaFile ? peta[String(namaFile).toLowerCase()] : '';
  return id ? URL_THUMBNAIL_ + id : '';
}

function bangunKonten_() {
  var ss = bukaKonten_();
  var pengaturan = kunciNilai_(bacaLembar_(ss.getSheetByName('Pengaturan_Konten')));
  var tampilkanContoh = yaTidak_(pengaturan.tampilkan_data_contoh);

  var daftar = {};
  Object.keys(LEMBAR_DAFTAR_KONTEN_).forEach(function (nama) {
    daftar[nama] = saringBaris_(bacaLembar_(ss.getSheetByName(nama)), tampilkanContoh);
  });

  var profil = kunciNilai_(bacaLembar_(ss.getSheetByName('Profil')));
  var profilContoh = yaTidak_(profil.data_contoh);
  delete profil.data_contoh;
  var adaIsiProfil = Object.keys(profil).some(function (k) { return profil[k] !== ''; });
  if (!adaIsiProfil || (profilContoh && !tampilkanContoh)) profil = null;
  else profil.contoh = profilContoh;

  // KEPUTUSAN: lembar Gambar dipindai ulang otomatis bila ada nama file yang belum terdaftar,
  // karena tidak ada menu di spreadsheet (lihat gas/Setup.gs).
  var peta = petaGambar_(ss);
  var butuh = [];
  daftar.Narasumber_Tutor.concat(daftar.Testimoni).forEach(function (b) { if (b.foto) butuh.push(b.foto); });
  daftar.Cabang.forEach(function (b) { if (b.logo) butuh.push(b.logo); });
  var adaYangHilang = butuh.some(function (n) { return !peta[n.toLowerCase()]; });
  if (adaYangHilang && properti_('GAMBAR_FOLDER_ID')) {
    try {
      peta = perbaruiDaftarGambar_(ss);
    } catch (err) {
      console.warn('Gagal memindai folder gambar: ' + err);
    }
  }

  daftar.Narasumber_Tutor.concat(daftar.Testimoni).forEach(function (b) {
    b.foto_url = urlGambar_(peta, b.foto);
  });
  daftar.Narasumber_Tutor.forEach(function (b) {
    b.prestasi_binaan = String(b.prestasi_binaan || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(String);
  });
  daftar.Cabang.forEach(function (b) { b.logo_url = urlGambar_(peta, b.logo); });

  var semua = [].concat.apply([], Object.keys(daftar).map(function (k) { return daftar[k]; }));
  var adaContoh = semua.some(function (b) { return b.contoh; }) || (profil !== null && profil.contoh);

  return {
    pengaturan: pengaturan,
    agenda: daftar.Agenda,
    narasumber: daftar.Narasumber_Tutor.filter(function (b) { return b.peran === 'Narasumber'; }),
    tutor: daftar.Narasumber_Tutor.filter(function (b) { return b.peran === 'Tutor'; }),
    profil: profil,
    cabang: daftar.Cabang,
    prestasi: daftar.Prestasi,
    testimoni: daftar.Testimoni,
    faq: daftar.FAQ,
    ada_contoh: !!adaContoh
  };
}

function ambilKonten_() {
  var cache = CacheService.getScriptCache();
  var tersimpan = cache.get(KUNCI_CACHE_KONTEN_);
  if (tersimpan) return JSON.parse(tersimpan);
  var konten = bangunKonten_();
  try {
    cache.put(KUNCI_CACHE_KONTEN_, JSON.stringify(konten), DETIK_CACHE_KONTEN_);
  } catch (err) {
    // Batas 100 KB per kunci cache; konten tetap dikirim tanpa cache.
    console.warn('Konten tidak bisa disimpan di cache: ' + err);
  }
  return konten;
}

/** Konten publik yang lolos aturan tampil dan data_contoh. */
function getContent() {
  return jalankanAman_(function () {
    return ok_(ambilKonten_());
  });
}
