// Memuat berkas .gs ke satu konteks agar fungsi murni bisa diuji dengan Node.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR_GAS = path.join(__dirname, '..', 'gas');

// Hanya bagian HtmlService yang dipakai logikaDaftar_ untuk membaca LogikaDaftar.html.
const HtmlService = {
  createTemplateFromFile: (nama) => ({
    getRawContent: () => fs.readFileSync(path.join(DIR_GAS, nama + '.html'), 'utf8')
  })
};

module.exports = function muatGas(berkas) {
  const konteks = vm.createContext({ console, HtmlService });
  for (const nama of berkas) {
    const kode = fs.readFileSync(path.join(DIR_GAS, nama), 'utf8');
    vm.runInContext(kode, konteks, { filename: nama });
  }
  return konteks;
};
