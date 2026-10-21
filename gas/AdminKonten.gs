/**
 * Panel admin, tab Tutor dan Prestasi (Fase 5). Datanya sama dengan lembar Narasumber_Tutor,
 * Prestasi_Tutor, dan Prestasi di Konten Website, jadi admin boleh mengubah lewat panel maupun
 * langsung di spreadsheet. Setiap simpan tercatat di Log_Admin dan membersihkan cache konten.
 *
 * KEPUTUSAN: foto tutor hanya dipilih dari file yang sudah ada di folder Gambar Web. Unggah foto
 * dari web tidak disertakan karena butuh izin tulis Google Drive.
 */

var KOLOM_PRESTASI_ADMIN_ = ['tahun', 'nama_siswa', 'sekolah', 'jenjang', 'bidang', 'lomba', 'tingkat', 'medali', 'sorotan', 'prestasi'];
var BATAS_PRESTASI_ADMIN_ = 300;
var BATAS_PRESTASI_TUTOR_ = 20;

/** Baris diurutkan menurut kolom urutan; yang tanpa urutan di belakang, urutan asal dipertahankan. Murni. */
function urutkanBaris_(baris) {
  return baris.map(function (b, i) {
    var u = parseFloat(b.urutan);
    return { b: b, u: isNaN(u) ? Infinity : u, i: i };
  }).sort(function (x, y) { return x.u - y.u || x.i - y.i; }).map(function (x) { return x.b; });
}

/** Tutor dari baris lembar, beserta nomor baris spreadsheet dan prestasinya. Murni. */
function susunTutorAdmin_(barisNt, barisPt, peta) {
  var prestasi = urutkanBaris_(barisPt);
  var hasil = [];
  barisNt.forEach(function (b, i) {
    if (b.peran !== 'Tutor') return;
    hasil.push({
      baris: i + 2,
      nama_lengkap: b.nama_lengkap || '',
      jabatan: b.jabatan || '',
      room: b.room || '',
      foto: b.foto || '',
      foto_url: urlGambar_(peta, b.foto),
      ringkasan: b.ringkasan || '',
      tampil: yaTidak_(b.tampil),
      contoh: yaTidak_(b.data_contoh),
      bidang: bidangTutor_(b.jabatan),
      prestasi: prestasiTutor_(b, prestasi)
    });
  });
  return hasil;
}

/** Prestasi siswa dari baris lembar, urut seperti di halaman. Murni. */
function susunPrestasiAdmin_(baris) {
  return urutkanBaris_(baris).map(function (b) {
    var o = { tampil: yaTidak_(b.tampil), contoh: yaTidak_(b.data_contoh) };
    KOLOM_PRESTASI_ADMIN_.forEach(function (k) { o[k] = b[k] || ''; });
    o.medali = jenisPrestasi_(b.medali, b.prestasi);
    o.sorotan = yaTidak_(b.sorotan);
    return o;
  });
}

/**
 * Isian tutor dirapikan dan diperiksa. namaLain: nama tutor lain (huruf kecil) agar tidak bentrok,
 * gambar: nama file di folder Gambar Web. Murni.
 */
function rapikanTutor_(data, namaLain, gambar) {
  var d = data || {};
  var galat = {};
  var nilai = {
    nama_lengkap: potong_(d.nama_lengkap, 80),
    jabatan: potong_(d.jabatan, 80),
    foto: potong_(d.foto, 120),
    ringkasan: potong_(d.ringkasan, 400),
    prestasi: []
  };
  if (!nilai.nama_lengkap) galat.nama_lengkap = 'Isi nama tutor.';
  else if (namaLain.indexOf(namaKunci_(nilai.nama_lengkap)) >= 0) galat.nama_lengkap = 'Nama ini sudah dipakai tutor lain.';
  if (!nilai.jabatan) galat.jabatan = 'Isi jabatan, misalnya Tutor Matematika SD.';
  var daftarGambar = gambar.map(function (g) { return g.toLowerCase(); });
  if (nilai.foto && daftarGambar.indexOf(nilai.foto.toLowerCase()) < 0) galat.foto = 'File foto tidak ada di folder Gambar Web.';
  (Array.isArray(d.prestasi) ? d.prestasi : []).forEach(function (p) {
    var teks = potong_(p && p.teks, 200);
    if (teks) nilai.prestasi.push({ jenis: jenisPrestasi_(p.jenis, teks), teks: teks });
  });
  if (nilai.prestasi.length > BATAS_PRESTASI_TUTOR_) galat.prestasi = 'Paling banyak ' + BATAS_PRESTASI_TUTOR_ + ' prestasi per tutor.';
  return { nilai: nilai, galat: galat };
}

/** Daftar prestasi siswa dari panel dirapikan menjadi baris lembar Prestasi. Murni. */
function rapikanDaftarPrestasi_(daftar) {
  var galat = [];
  var baris = [];
  (Array.isArray(daftar) ? daftar : []).forEach(function (p) {
    p = p || {};
    var o = {
      tahun: potong_(p.tahun, 4), nama_siswa: potong_(p.nama_siswa, 100), sekolah: potong_(p.sekolah, 120),
      jenjang: potong_(p.jenjang, 20), bidang: potong_(p.bidang, 40), lomba: potong_(p.lomba, 60),
      tingkat: potong_(p.tingkat, 40), prestasi: potong_(p.prestasi, 250)
    };
    if (!o.nama_siswa && !o.prestasi && !o.sekolah && !o.tahun) return;
    var no = baris.length + 1;
    if (!o.nama_siswa) galat.push('Baris ' + no + ': isi nama siswa.');
    if (!o.prestasi) galat.push('Baris ' + no + ': isi teks prestasi.');
    if (!/^\d{4}$/.test(o.tahun)) galat.push('Baris ' + no + ': tahun harus 4 angka, misalnya 2026.');
    o.medali = jenisPrestasi_(p.medali, o.prestasi);
    o.sorotan = p.sorotan === true || yaTidak_(p.sorotan) ? 'YA' : 'TIDAK';
    o.tampil = p.tampil === false ? 'TIDAK' : 'YA';
    o.data_contoh = p.contoh === true ? 'YA' : 'TIDAK';
    o.urutan = no;
    baris.push(o);
  });
  if (baris.length > BATAS_PRESTASI_ADMIN_) galat.push('Paling banyak ' + BATAS_PRESTASI_ADMIN_ + ' baris prestasi.');
  return { baris: baris, galat: galat };
}

/** Sidik isi lembar Prestasi, untuk menolak simpan bila lembar diubah orang lain sejak dibuka. */
function sidikPrestasi_(ss) {
  return sidikLaporan_(bacaLembar_(ss.getSheetByName('Prestasi')));
}

function namaGambar_(peta) {
  return Object.keys(peta).sort();
}

function dataKontenAdmin_(ss, peta) {
  return {
    tutor: susunTutorAdmin_(bacaLembar_(ss.getSheetByName('Narasumber_Tutor')), bacaLembar_(ss.getSheetByName('Prestasi_Tutor')), peta),
    prestasi: susunPrestasiAdmin_(bacaLembar_(ss.getSheetByName('Prestasi'))),
    sidik_prestasi: sidikPrestasi_(ss),
    gambar: namaGambar_(peta)
  };
}

/** Data tab Tutor dan Prestasi. Folder Gambar Web dipindai ulang agar foto yang baru diunggah ikut terdaftar. */
function adminGetKonten(token) {
  return jalankanAman_(function () {
    sesi_(token, ['admin']);
    var ss = bukaKonten_();
    if (!ss.getSheetByName('Prestasi_Tutor')) return gagal_('VALIDASI', 'Lembar Prestasi_Tutor belum ada. Pemilik perlu menjalankan siapkanLembar di editor Apps Script.');
    var peta;
    try {
      peta = perbaruiDaftarGambar_(ss);
    } catch (err) {
      peta = petaGambar_(ss);
    }
    return ok_(dataKontenAdmin_(ss, peta));
  });
}

function adminSimpanTutor(token, data) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    return denganKunci_(function () {
      var ss = bukaKonten_();
      var nt = ss.getSheetByName('Narasumber_Tutor');
      var semua = bacaLembar_(nt);
      var nomor = parseInt(data && data.baris, 10);
      var lama = semua[nomor - 2];
      if (!lama || lama.peran !== 'Tutor' || namaKunci_(lama.nama_lengkap) !== namaKunci_(data.nama_asal)) {
        return gagal_('BERUBAH', 'Data tutor ini sudah berubah di spreadsheet. Muat ulang tab Tutor lalu coba lagi.');
      }
      var namaLain = semua.filter(function (b, i) { return b.peran === 'Tutor' && i !== nomor - 2; })
        .map(function (b) { return namaKunci_(b.nama_lengkap); });
      var peta = petaGambar_(ss);
      var r = rapikanTutor_(data, namaLain, namaGambar_(peta));
      if (Object.keys(r.galat).length) {
        var g = gagal_('VALIDASI', 'Ada isian tutor yang belum sesuai.');
        g.error.kolom = r.galat;
        return g;
      }
      var v = r.nilai;

      var judul = nt.getRange(1, 1, 1, nt.getLastColumn()).getValues()[0].map(function (j) { return String(j).trim(); });
      var sel = nt.getRange(nomor, 1, 1, judul.length);
      var isi = sel.getValues()[0];
      ['nama_lengkap', 'jabatan', 'foto', 'ringkasan'].forEach(function (k) {
        var i = judul.indexOf(k);
        if (i >= 0) isi[i] = sanitasiSel_(v[k]);
      });
      sel.setValues([isi]);

      // Prestasi tutor ini (nama lama maupun baru) diganti seluruhnya dengan daftar dari panel.
      var pt = ss.getSheetByName('Prestasi_Tutor');
      var kunci = [namaKunci_(lama.nama_lengkap), namaKunci_(v.nama_lengkap)];
      var sisa = bacaLembar_(pt).filter(function (b) { return kunci.indexOf(namaKunci_(b.nama_tutor)) < 0; });
      var baru = v.prestasi.map(function (p, i) {
        return { urutan: i + 1, tampil: 'YA', data_contoh: lama.data_contoh || 'TIDAK', nama_tutor: v.nama_lengkap, jenis: p.jenis, prestasi: p.teks };
      });
      tulisBarisObjek_(pt, sisa.concat(baru), true);

      catatLog_(s.peran, 'ubah tutor', v.nama_lengkap,
        [lama.nama_lengkap, lama.jabatan, lama.foto].join(' | '),
        [v.nama_lengkap, v.jabatan, v.foto, v.prestasi.length + ' prestasi'].join(' | '));
      bersihkanCache_();
      return ok_(dataKontenAdmin_(ss, peta));
    });
  });
}

function adminSimpanPrestasi(token, daftar, sidik) {
  return jalankanAman_(function () {
    var s = sesi_(token, ['admin']);
    return denganKunci_(function () {
      var ss = bukaKonten_();
      if (sidikPrestasi_(ss) !== sidik) {
        return gagal_('BERUBAH', 'Lembar Prestasi sudah diubah di spreadsheet sejak tab ini dibuka. Muat ulang tab Prestasi lalu ulangi perubahan.');
      }
      var r = rapikanDaftarPrestasi_(daftar);
      if (r.galat.length) return gagal_('VALIDASI', r.galat.slice(0, 3).join(' '));
      var lembar = ss.getSheetByName('Prestasi');
      var jumlahLama = bacaLembar_(lembar).length;
      tulisBarisObjek_(lembar, r.baris, true);
      catatLog_(s.peran, 'ubah prestasi', '', jumlahLama + ' baris', r.baris.length + ' baris');
      bersihkanCache_();
      return ok_(dataKontenAdmin_(ss, petaGambar_(ss)));
    });
  });
}
