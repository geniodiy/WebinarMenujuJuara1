# Website Webinar #MenujuJuara Eps. 1: Roadmap OSN 2027

Website satu halaman untuk webinar gratis Genio Institute: info acara, pendaftaran, dan panel admin. Berjalan di Google Apps Script dan di-embed ke halaman Blogger.

- Spesifikasi: `PRD.md`
- Referensi dan keputusan desain: `docs/referensi.md`
- Langkah deploy dan pengecekan: `docs/catatan-deploy.md`
- Kode Apps Script: `gas/` (dikirim dengan `clasp push`)

## Pengembangan lokal

Apps Script tidak bisa dijalankan lokal. Logika murni (fase, normalisasi WA, penyaringan konten) diuji dengan Node:

```bash
npm test
npm run pratinjau   # membuat pratinjau.html dari Index.html dengan data contoh
```

## Status

| Fase | Isi | Status |
|---|---|---|
| 1 | Fondasi dan uji embed | Kode selesai, menunggu langkah manual di `docs/catatan-deploy.md` |
| 2 | Form pendaftaran | Belum |
| 3 | Halaman utama Rilis 1 | Belum |
| 4 | Panel admin pendaftaran | Belum |
| 5 | Konten Rilis 2 | Belum |
| 6 | Presensi dan feedback | Belum |
| 7 | Pertanyaan dan moderator | Belum |
| 8 | Uji menyeluruh | Belum |
