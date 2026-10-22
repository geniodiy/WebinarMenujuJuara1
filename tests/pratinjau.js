// Membuat pratinjau statis Index.html dengan data contoh, tanpa Apps Script.
// Pakai: node tests/pratinjau.js [daftar|belum_buka|tutup|galat] [form] > pratinjau.html
// Argumen kedua "form" membuka form pendaftaran langsung (seperti ?form=daftar).
const fs = require('fs');
const path = require('path');
const muatGas = require('./muat-gas');

const g = muatGas(['Util.gs', 'Config.gs', 'Konten.gs', 'Setup.gs', 'DataContoh.gs']);
const param = process.argv[3] === 'form' ? { form: 'daftar' } : {};
const fase = process.argv[2] || 'daftar';
const dir = path.join(__dirname, '..', 'gas');
const baca = (n) => fs.readFileSync(path.join(dir, n + '.html'), 'utf8');

const sekarang = { belum_buka: '2026-10-18 10:00', daftar: '2026-10-20 17:00', tutup: '2026-11-09 10:00' }[fase] || '2026-10-20 17:00';
const peng = {};
g.PENGATURAN_AWAL_.forEach((b) => { peng[b[0]] = b[1]; });
const config = Object.assign(g.hitungStatus_(peng, g.parseWaktuWib_(sekarang)), { jam_server: g.parseWaktuWib_(sekarang) });

const pengKonten = {};
g.PENGATURAN_KONTEN_AWAL_.forEach((b) => { pengKonten[b[0]] = b[1]; });
const daftar = {};
for (const nama of Object.keys(g.DATA_CONTOH_)) {
  daftar[nama] = g.saringBaris_(g.DATA_CONTOH_[nama].map((b) => {
    const s = {};
    Object.keys(b).forEach((k) => { s[k] = String(b[k]); });
    return s;
  }), true);
}
daftar.Narasumber_Tutor.forEach((b, i) => {
  if (b.peran === 'Tutor') {
    b.prestasi = g.prestasiTutor_(b, daftar.Prestasi_Tutor);
    b.bidang = g.bidangTutor_(b.jabatan);
    if (i === 1 && process.env.PRATINJAU_TUTOR) b.foto_url = 'file://' + process.env.PRATINJAU_TUTOR + '#';
  }
  b.prestasi_binaan = String(b.prestasi_binaan || '').split(/\r?\n/).filter(Boolean);
  // Akhiran # membuat =w<lebar> dari halaman jatuh ke fragmen URL dan diabaikan.
  if (b.peran === 'Narasumber' && process.env.PRATINJAU_FOTO) b.foto_url = 'file://' + process.env.PRATINJAU_FOTO + '#';
});
daftar.Prestasi.forEach((b) => { b.medali = g.jenisPrestasi_(b.medali, b.prestasi); });
daftar.Prestasi = g.urutkanSorotan_(daftar.Prestasi);
daftar.Cabang.forEach((b) => {
  const logo = path.join(__dirname, '..', 'assets-raw', b.logo);
  // Sama seperti server (dataUriGambarKecil_): logo kecil ditanam agar latar transparan tetap.
  if (b.logo && fs.existsSync(logo)) b.logo_data = 'data:image/png;base64,' + fs.readFileSync(logo).toString('base64');
});
const profil = {};
g.PROFIL_GENIO_.forEach((p) => { profil[p[0]] = p[1]; });
profil.contoh = false;
delete profil.data_contoh;
const konten = {
  poster_url: process.env.PRATINJAU_POSTER ? 'file://' + process.env.PRATINJAU_POSTER + '#' : '',
  pengaturan: pengKonten,
  agenda: daftar.Agenda,
  narasumber: daftar.Narasumber_Tutor.filter((b) => b.peran === 'Narasumber'),
  tutor: daftar.Narasumber_Tutor.filter((b) => b.peran === 'Tutor'),
  profil,
  cabang: daftar.Cabang, prestasi: daftar.Prestasi, testimoni: daftar.Testimoni,
  ada_contoh: true
};
const dataAwal = fase === 'galat' ? { config: null, konten: null, param } : { config, konten, param };

const poster = konten.poster_url && fase !== 'galat'
  ? { kepala: '', atribut: 'src="' + konten.poster_url + '=w1080"', wadah: '', cadangan: 'hidden' }
  : { kepala: '', atribut: '', wadah: 'hidden', cadangan: '' };
const variabel = {
  dataAwal: g.jsonAman_(dataAwal),
  kepalaPoster: poster.kepala,
  atributPoster: poster.atribut,
  wadahPoster: poster.wadah,
  judulCadangan: poster.cadangan
};
const html = baca('Index')
  .replace(/<\?!= include\('(\w+)'\) \?>/g, (_, n) => baca(n))
  .replace(/<\?!= (\w+) \?>/g, (_, n) => variabel[n] != null ? variabel[n] : '')
  .replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
process.stdout.write(html);
