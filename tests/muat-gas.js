// Memuat berkas .gs ke satu konteks agar fungsi murni bisa diuji dengan Node.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function muatGas(berkas) {
  const konteks = vm.createContext({ console });
  for (const nama of berkas) {
    const kode = fs.readFileSync(path.join(__dirname, '..', 'gas', nama), 'utf8');
    vm.runInContext(kode, konteks, { filename: nama });
  }
  return konteks;
};
