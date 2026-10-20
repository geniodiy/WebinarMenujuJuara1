# CLAUDE.md

Website webinar #MenujuJuara Eps. 1: Roadmap OSN 2027 (Genio Institute). Acuan utama: `PRD.md`. Catatan referensi dan perbedaan yang belum diputuskan: `docs/referensi.md`.

## Aturan kerja (dari PRD Bagian 0)

- Baca `PRD.md` dan `docs/Rancangan_Form_Webinar.pdf` sebelum mulai. PDF adalah acuan **label, teks bantuan, dan pilihan jawaban form**. PRD adalah acuan **perilaku sistem dan tampilan**. Bila berbeda, ikuti PRD dan catat perbedaannya di laporan.
- Kerjakan hanya fase yang diminta. Di akhir fase, jalankan pengecekan "Selesai bila", lalu laporkan apa yang dibuat, apa yang belum, dan langkah manual untuk pemilik.
- Fitur hari H (presensi, feedback, pertanyaan, moderator) baru dikerjakan di Fase 6 dan 7. Sebelum itu, jangan membuat kode, lembar, atau tampilan untuknya.
- Jangan memakai data orang sungguhan untuk uji coba. Gunakan data uji (PRD Bagian 6.3).
- Jangan menulis ID spreadsheet, kata sandi, atau token di kode. Simpan di Script Properties.
- Semua teks untuk pengguna dalam Bahasa Indonesia yang ramah dan jelas, kalimat biasa (bukan huruf kapital semua).
- Semua kode ada di proyek Apps Script, dikelola dengan `clasp` dari folder `gas/`.
- Bila menemui keputusan yang belum ada di PRD, pilih opsi paling sederhana, tandai dengan komentar `// KEPUTUSAN:`, dan sebutkan di laporan.

## Catatan teknis (keputusan yang sudah diambil)

- Proyek Apps Script **berdiri sendiri (standalone)**, terpisah dari kedua spreadsheet. Tidak ada menu "Genio" di spreadsheet; fungsi panitia (PRD 6.4) dijalankan pemilik dari editor Apps Script dan hasilnya tampil di log eksekusi. ID spreadsheet dan folder ada di Script Properties (`DB_SHEET_ID`, `KONTEN_SHEET_ID`, `GAMBAR_FOLDER_ID`).
- Fungsi panitia bernama publik, jadi bisa dipanggil `google.script.run`. Setiap fungsi panitia wajib memanggil `penjagaPanitia_()` di baris pertama.
- Pemilik mengirim kode dengan salin-tempel dari iPad (tanpa clasp). Jaga jumlah file di `gas/` tetap sedikit dan sebutkan file yang berubah di setiap laporan.
- Semua fungsi publik untuk browser mengembalikan `{ ok, data }` atau `{ ok: false, error: { code, message } }` lewat `jalankanAman_`.
- Data contoh Konten Website ada di `gas/DataContoh.gs` (dipisah dari `Setup.gs` agar mudah dibaca).
- Fungsi murni (tanpa layanan Apps Script) diuji dengan `npm test`. Pratinjau halaman tanpa Apps Script: `npm run pratinjau`. Form pendaftaran diuji ujung-ke-ujung dengan `npm run e2e`.
- Aturan form (jalur, validasi, perapian isian) hanya ada di `gas/LogikaDaftar.html`, dipakai browser lewat include dan server lewat `logikaDaftar_()`. Jangan menduplikasi aturan itu di tempat lain.
- Jangan memakai `window.confirm`/`alert` di halaman: bisa diblokir di iframe Apps Script. Pakai konfirmasi di halaman (lihat `duaKetukan` di `JsFormDaftar.html`).
