/**
 * Pembacaan spreadsheet "Konten Website" untuk halaman publik.
 */

var KUNCI_CACHE_KONTEN_ = 'konten';
var DETIK_CACHE_KONTEN_ = 300;
var KOLOM_BERSAMA_ = ['urutan', 'tampil', 'data_contoh'];
var URL_THUMBNAIL_ = 'https://drive.google.com/thumbnail?id=';
// Alamat langsung tanpa pengalihan, lebih cepat dari thumbnail. Browser menambahkan =w<lebar>.
var URL_GAMBAR_ = 'https://lh3.googleusercontent.com/d/';

/** Lembar daftar: nama lembar ke kolom khusus (setelah kolom bersama). */
var LEMBAR_DAFTAR_KONTEN_ = {
  Agenda: ['judul', 'deskripsi', 'sasaran', 'jam'],
  Narasumber_Tutor: ['peran', 'nama_lengkap', 'jabatan', 'room', 'foto', 'ringkasan', 'prestasi_binaan'],
  Prestasi_Tutor: ['nama_tutor', 'jenis', 'prestasi'],
  Cabang: ['nama', 'logo', 'alamat', 'link_maps', 'wa_admin', 'instagram'],
  Prestasi: ['tahun', 'nama_siswa', 'sekolah', 'jenjang', 'bidang', 'lomba', 'tingkat', 'medali', 'sorotan', 'prestasi'],
  Testimoni: ['nama', 'keterangan', 'kutipan', 'foto', 'jam'],
  FAQ: ['pertanyaan', 'jawaban']
};
var JENIS_PRESTASI_ = ['Emas', 'Perak', 'Perunggu', 'Lainnya'];

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

/**
 * Jenis prestasi dari isian kolom jenis/medali, atau dari teks prestasinya bila kolom itu kosong
 * atau tidak dikenal. Juara I/II/III setara Emas/Perak/Perunggu; finalis, harapan, dan lainnya
 * masuk Lainnya. Murni.
 */
function jenisPrestasi_(jenis, teks) {
  var j = String(jenis == null ? '' : jenis).trim().toLowerCase();
  for (var i = 0; i < JENIS_PRESTASI_.length; i++) {
    if (j === JENIS_PRESTASI_[i].toLowerCase()) return JENIS_PRESTASI_[i];
  }
  var t = (j + ' ' + String(teks == null ? '' : teks)).toLowerCase();
  if (/emas|gold|juara (i|1)\b|juara pertama/.test(t)) return 'Emas';
  if (/perak|silver|juara (ii|2)\b|juara kedua/.test(t)) return 'Perak';
  if (/perunggu|bronze|juara (iii|3)\b|juara ketiga/.test(t)) return 'Perunggu';
  return 'Lainnya';
}

/** Bidang tutor dari jabatannya, untuk warna kartu: mat, ipa, ips, atau kosong. Murni. */
function bidangTutor_(jabatan) {
  var j = String(jabatan == null ? '' : jabatan).toLowerCase();
  if (/matematika/.test(j)) return 'mat';
  if (/\bipa\b|sains/.test(j)) return 'ipa';
  if (/\bips\b|sosial/.test(j)) return 'ips';
  return '';
}

/**
 * Daftar prestasi siswa binaan tiap tutor: dari lembar Prestasi_Tutor bila ada baris untuk nama itu,
 * selain itu dari kolom prestasi_binaan (satu per baris) dengan jenis ditebak dari teksnya. Murni.
 */
function prestasiTutor_(tutor, barisPrestasi) {
  var milik = barisPrestasi.filter(function (p) {
    return p.prestasi && namaKunci_(p.nama_tutor) === namaKunci_(tutor.nama_lengkap);
  });
  if (milik.length) {
    return milik.map(function (p) { return { jenis: jenisPrestasi_(p.jenis, p.prestasi), teks: p.prestasi }; });
  }
  return String(tutor.prestasi_binaan || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(String)
    .map(function (s) { return { jenis: jenisPrestasi_('', s), teks: s }; });
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
  return id ? URL_GAMBAR_ + id : '';
}

/** Bagian halaman yang bisa disembunyikan admin, sesuai kunci tampil_<nama> di Pengaturan_Konten. */
var BAGIAN_OPSIONAL_ = ['tutor', 'profil', 'cabang', 'prestasi', 'ajakan'];

/** Peta bagian ke true/false. Kunci yang kosong atau belum ada dianggap tampil. Murni. */
function bagianTampil_(pengaturan) {
  var t = {};
  BAGIAN_OPSIONAL_.forEach(function (k) {
    t[k] = String(pengaturan['tampil_' + k] == null ? '' : pengaturan['tampil_' + k]).trim().toUpperCase() !== 'TIDAK';
  });
  return t;
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

  // Bagian yang disembunyikan admin tidak dikirim ke browser. Data cabang tetap dikirim bila
  // salah satu dari bagian Cabang atau Ajakan masih tampil, karena keduanya memakai data yang sama.
  var tampil = bagianTampil_(pengaturan);
  if (!tampil.tutor) daftar.Narasumber_Tutor = daftar.Narasumber_Tutor.filter(function (b) { return b.peran !== 'Tutor'; });
  if (!tampil.profil) profil = null;
  if (!tampil.prestasi) daftar.Prestasi = [];
  if (!tampil.cabang && !tampil.ajakan) daftar.Cabang = [];

  // KEPUTUSAN: lembar Gambar dipindai ulang otomatis bila ada nama file yang belum terdaftar,
  // karena tidak ada menu di spreadsheet (lihat gas/Setup.gs).
  var peta = petaGambar_(ss);
  var butuh = [];
  daftar.Narasumber_Tutor.concat(daftar.Testimoni).forEach(function (b) { if (b.foto) butuh.push(b.foto); });
  daftar.Cabang.forEach(function (b) { if (b.logo) butuh.push(b.logo); });
  if (pengaturan.poster) butuh.push(pengaturan.poster);
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
    if (b.peran === 'Tutor') {
      b.prestasi = prestasiTutor_(b, daftar.Prestasi_Tutor);
      b.bidang = bidangTutor_(b.jabatan);
    }
    b.prestasi_binaan = String(b.prestasi_binaan || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(String);
  });
  daftar.Cabang.forEach(function (b) {
    b.logo_url = urlGambar_(peta, b.logo);
    b.logo_id = b.logo ? (peta[String(b.logo).toLowerCase()] || '') : '';
  });
  daftar.Prestasi.forEach(function (b) { b.medali = jenisPrestasi_(b.medali, b.prestasi); });

  // KEPUTUSAN: FAQ tidak ditampilkan (keputusan pemilik), jadi tidak dikirim dan tidak memicu pita contoh.
  var dipakai = ['Agenda', 'Narasumber_Tutor', 'Cabang', 'Prestasi', 'Testimoni'];
  var semua = [].concat.apply([], dipakai.map(function (k) { return daftar[k]; }));
  var adaContoh = semua.some(function (b) { return b.contoh; }) || (profil !== null && profil.contoh);

  return {
    pengaturan: pengaturan,
    poster_url: urlGambar_(peta, pengaturan.poster),
    agenda: daftar.Agenda,
    narasumber: daftar.Narasumber_Tutor.filter(function (b) { return b.peran === 'Narasumber'; }),
    tutor: daftar.Narasumber_Tutor.filter(function (b) { return b.peran === 'Tutor'; }),
    profil: profil,
    cabang: daftar.Cabang,
    prestasi: daftar.Prestasi,
    testimoni: daftar.Testimoni,
    tampil: tampil,
    ada_contoh: !!adaContoh
  };
}

// KEPUTUSAN: layanan gambar Drive (lh3 dan thumbnail) mengubah latar transparan PNG menjadi hitam.
// Logo cabang yang kecil ditanam sebagai data URI agar transparansinya tetap. Data URI disimpan
// di cache terpisah per file supaya cache konten tetap di bawah batas 100 KB.
var BATAS_BYTE_LOGO_ = 80 * 1024;
var DETIK_CACHE_LOGO_ = 6 * 3600;

/** Data URI gambar kecil dari Drive, atau '' bila terlalu besar atau gagal dibaca. */
function dataUriGambarKecil_(id) {
  if (!id) return '';
  var cache = CacheService.getScriptCache();
  var kunci = 'gambar_' + id;
  var tersimpan = cache.get(kunci);
  if (tersimpan !== null) return tersimpan;
  var hasil = '';
  try {
    var file = DriveApp.getFileById(id);
    if (file.getSize() <= BATAS_BYTE_LOGO_) {
      var blob = file.getBlob();
      hasil = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
    }
  } catch (err) {
    console.warn('Logo ' + id + ' tidak bisa dibaca: ' + err);
  }
  try { cache.put(kunci, hasil, DETIK_CACHE_LOGO_); } catch (err) { /* terlalu besar untuk cache */ }
  return hasil;
}

function isiLogoCabang_(konten) {
  (konten.cabang || []).forEach(function (c) { c.logo_data = dataUriGambarKecil_(c.logo_id); });
  return konten;
}

function ambilKonten_() {
  var cache = CacheService.getScriptCache();
  var tersimpan = cache.get(KUNCI_CACHE_KONTEN_);
  if (tersimpan) return isiLogoCabang_(JSON.parse(tersimpan));
  var konten = bangunKonten_();
  try {
    cache.put(KUNCI_CACHE_KONTEN_, JSON.stringify(konten), DETIK_CACHE_KONTEN_);
  } catch (err) {
    // Batas 100 KB per kunci cache; konten tetap dikirim tanpa cache.
    console.warn('Konten tidak bisa disimpan di cache: ' + err);
  }
  return isiLogoCabang_(konten);
}

/** Konten publik yang lolos aturan tampil dan data_contoh. */
function getContent() {
  return jalankanAman_(function () {
    return ok_(ambilKonten_());
  });
}
