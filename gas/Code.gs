/**
 * Titik masuk web app: merender halaman dengan data awal tertanam,
 * sehingga halaman tampil tanpa menunggu panggilan server kedua.
 */

var JUDUL_DEFAULT_ = '#MenujuJuara Eps. 1: Roadmap OSN 2027';

function doGet(e) {
  var config = getConfig();
  var konten = getContent();
  var judul = konten.ok && konten.data.pengaturan.judul_acara ? konten.data.pengaturan.judul_acara : JUDUL_DEFAULT_;

  var templat = HtmlService.createTemplateFromFile('Index');
  var poster = atributPoster_(konten.ok ? konten.data.poster_url : '');
  templat.kepalaPoster = poster.kepala;
  templat.atributPoster = poster.atribut;
  templat.wadahPoster = poster.wadah;
  templat.judulCadangan = poster.cadangan;
  templat.dataAwal = jsonAman_({
    config: config.ok ? config.data : null,
    konten: konten.ok ? konten.data : null,
    param: paramAman_(e && e.parameter)
  });

  return templat.evaluate()
    .setTitle(judul + ' | Genio Institute')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

var UKURAN_POSTER_ = '(max-width: 760px) 100vw, 736px';

/**
 * Atribut poster ditanam langsung di HTML agar browser mulai mengunduhnya sebelum JavaScript
 * berjalan; ponsel cukup mengunduh versi 600 px.
 */
function atributPoster_(url) {
  if (!/^https:\/\/[\w.\/-]+$/.test(String(url || ''))) return { kepala: '', atribut: '', wadah: 'hidden', cadangan: '' };
  var srcset = url + '=w600 600w, ' + url + '=w1080 1080w';
  return {
    kepala: '<link rel="preload" as="image" imagesrcset="' + srcset + '" imagesizes="' + UKURAN_POSTER_ + '" fetchpriority="high">',
    atribut: 'src="' + url + '=w1080" srcset="' + srcset + '" sizes="' + UKURAN_POSTER_ + '"',
    wadah: '',
    cadangan: 'hidden'
  };
}

/** Parameter URL yang dipakai halaman: ?form=daftar, ?admin=1, ?ref=..., ?utm_source=... */
function paramAman_(p) {
  p = p || {};
  var hasil = {};
  ['form', 'ref', 'utm_source', 'admin'].forEach(function (k) {
    if (p[k]) hasil[k] = String(p[k]).replace(/[^\w.\-]/g, '').slice(0, 40);
  });
  return hasil;
}

/** Dipakai di template: <?!= include('Css') ?> */
function include(nama) {
  return HtmlService.createHtmlOutputFromFile(nama).getContent();
}
