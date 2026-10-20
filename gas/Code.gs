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

/** Parameter URL yang dipakai halaman: ?form=daftar, ?ref=..., ?utm_source=... */
function paramAman_(p) {
  p = p || {};
  var hasil = {};
  ['form', 'ref', 'utm_source'].forEach(function (k) {
    if (p[k]) hasil[k] = String(p[k]).replace(/[^\w.\-]/g, '').slice(0, 40);
  });
  return hasil;
}

/** Dipakai di template: <?!= include('Css') ?> */
function include(nama) {
  return HtmlService.createHtmlOutputFromFile(nama).getContent();
}
