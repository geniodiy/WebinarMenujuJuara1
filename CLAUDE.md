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

- Proyek Apps Script **terikat ke spreadsheet Database Webinar**, sehingga menu "Genio" hanya ada di sana (alasan di `gas/Setup.gs` dan `docs/catatan-deploy.md`). Konten Website dibaca lewat `KONTEN_SHEET_ID`.
- Fungsi menu bernama publik, jadi bisa dipanggil `google.script.run`. Setiap fungsi menu wajib memanggil `uiPanitia_()` di baris pertama sebagai penjaga.
- Semua fungsi publik untuk browser mengembalikan `{ ok, data }` atau `{ ok: false, error: { code, message } }` lewat `jalankanAman_`.
- Data contoh Konten Website ada di `gas/DataContoh.gs` (dipisah dari `Setup.gs` agar mudah dibaca).
- Fungsi murni (tanpa layanan Apps Script) diuji dengan `npm test`. Pratinjau halaman tanpa Apps Script: `npm run pratinjau`.
