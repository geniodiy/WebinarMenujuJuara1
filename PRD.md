# PRD Website Webinar #MenujuJuara Eps. 1: Roadmap OSN 2027

Versi 1.2, 20 Oktober 2026
Pemilik: Tim Genio Institute (Ticketing & Marketing)

### Perubahan di versi 1.2

- Pengerjaan difokuskan pada form pendaftaran: form pendaftaran dikerjakan tepat setelah fondasi, sebelum halaman utama, dan bisa diuji sendiri lewat `?form=daftar`.
- Seluruh fitur hari H (presensi dan feedback, form pertanyaan, fase hari H di tombol floating, tab Feedback dan Pertanyaan, peran moderator) dipindahkan ke Fase 6 dan 7, setelah semua bagian pendaftaran dan konten selesai.
- Ditambah rincian tampilan, pesan galat, dan pencegahan kirim ganda untuk form pendaftaran (Bagian 10.5 dan 10.6), serta skenario uji U27 sampai U30.

### Perubahan di versi 1.1

- Website tidak memakai Vercel. Tampilan dan logika berjalan di Google Apps Script (HtmlService), lalu di-embed ke halaman Blogger.
- Ditambah **panel admin** dari ikon di pojok kanan atas: mengatur jadwal form, melihat pendaftar, feedback, dan pertanyaan, serta mengunduh data ke Excel. Panel ini menggantikan halaman moderator terpisah.
- Form pertanyaan dan presensi kini bisa dijadwalkan (jam buka dan tutup), selain dibuka atau ditutup manual.
- Gambar disimpan di Google Drive dan didaftarkan otomatis lewat menu spreadsheet.

---

## 0. Cara memakai dokumen ini

1. Buat folder proyek di komputer, misalnya `genio-menuju-juara/`, lalu simpan file ini di root dengan nama `PRD.md`.
2. Masukkan bahan hasil Fase 0 ke `assets-raw/` dan dokumen acuan ke `docs/` (lihat Bagian 4).
3. Buka Claude Code di folder tersebut dan kerjakan **satu fase per sesi**. Prompt siap pakai ada di Bagian 18.
4. Setelah tiap fase, cek daftar "Selesai bila" sebelum lanjut.

### Aturan kerja untuk Claude Code

Salin bagian ini ke `CLAUDE.md` di root folder agar selalu terbaca.

- Baca `PRD.md` dan `docs/Rancangan_Form_Webinar.pdf` sebelum mulai. PDF adalah acuan **label, teks bantuan, dan pilihan jawaban form**. PRD adalah acuan **perilaku sistem dan tampilan**. Bila berbeda, ikuti PRD dan catat perbedaannya di laporan.
- Kerjakan hanya fase yang diminta. Di akhir fase, jalankan pengecekan "Selesai bila", lalu laporkan apa yang dibuat, apa yang belum, dan langkah manual untuk pemilik.
- Fitur hari H (presensi, feedback, pertanyaan, moderator) baru dikerjakan di Fase 6 dan 7. Sebelum itu, jangan membuat kode, lembar, atau tampilan untuknya.
- Jangan memakai data orang sungguhan untuk uji coba. Gunakan data uji (Bagian 6.3).
- Jangan menulis ID spreadsheet, kata sandi, atau token di kode. Simpan di Script Properties.
- Semua teks untuk pengguna dalam Bahasa Indonesia yang ramah dan jelas, kalimat biasa (bukan huruf kapital semua).
- Semua kode ada di proyek Apps Script, dikelola dengan `clasp` dari folder `gas/`.
- Bila menemui keputusan yang belum ada di PRD, pilih opsi paling sederhana, tandai dengan komentar `// KEPUTUSAN:`, dan sebutkan di laporan.

---

## 1. Ringkasan produk

Website satu halaman untuk webinar gratis Genio Institute: memperkenalkan acara dan Genio, menerima pendaftaran (siswa, orang tua, guru pembina), menyediakan form pertanyaan dan presensi beserta feedback pada hari H, serta panel admin untuk panitia.

| Info acara | Isi |
|---|---|
| Judul | #MenujuJuara Eps. 1: Roadmap OSN 2027 |
| Tagline | Pertajam Strategi, Kuatkan Sinergi, Genggam Prestasi |
| Narasumber | Indro, S.Pd., Manajer Genio Institute |
| Waktu | Sabtu, 14 November 2026, 08.00 WIB sampai selesai |
| Media | Zoom Meeting |
| Biaya | Gratis |
| Sasaran | Siswa SD, SMP, guru pembina, dan orang tua |
| Bonus | Materi Kelas OSN (syarat lihat K3) |
| Narahubung | Lily, 0878-3886-2882 |
| Instagram | @genio_institute, @genio.diy |
| Link tercetak di poster | s.id/geniojuara1, diarahkan ke halaman Blogger |

### Ukuran keberhasilan

- Jumlah pendaftar per kategori dan per room simulasi.
- Rasio hadir: presensi dibanding pendaftar.
- Jumlah prospek: peserta yang menyetujui informasi program atau memilih "ingin dihubungi" di feedback.

### Prinsip

- **Ponsel dulu.** Sebagian besar pengunjung membuka link dari grup WhatsApp, sering lewat browser bawaan WhatsApp atau Instagram.
- **Panitia tidak menyentuh kode.** Jadwal, saklar form, kuota, dan konten diatur dari panel admin atau spreadsheet.
- **Bisa dipakai ulang** untuk episode berikutnya dengan mengganti isi spreadsheet dan gambar.

---

## 2. Keputusan yang perlu dikonfirmasi

Bila belum diputuskan, Claude Code memakai usulan default.

| No | Hal | Usulan default | Dibutuhkan di | Status |
|---|---|---|---|---|
| K1 | Nama sesi orang tua dan guru (poster: "Sharing Session", form: "Sharing Session") | "Sharing Session" dengan keterangan "Sharing session orang tua & guru" | Fase 3 | **Diputuskan: "Sharing Session"** (ikut poster). Teks PDF yang menyebut "Sharing Session" diganti |
| K2 | Teks persetujuan "Genio Yogyakarta" padahal ada dua cabang | Diganti "Genio Institute" | Fase 2 | **Disetujui** |
| K3 | Syarat bonus Materi Kelas OSN | Untuk peserta yang mengisi presensi; link materi muncul setelah presensi terkirim | Fase 3 dan 6 | |
| K4 | Tanggal buka pendaftaran (draft: 19 Oktober, sudah lewat) | Langsung terbuka begitu Rilis 1 tayang | Fase 1 | |
| K5 | Sudah ada pendaftar lewat form lain? | Bila ada, diimpor di Fase 2 | Fase 2 | |
| K6 | Kuota per room simulasi | 0 (tanpa batas, hanya dihitung) sampai diisi di panel admin | Fase 4 | |
| K7 | Jam selesai acara (untuk tombol kalender) | 12.00 WIB | Fase 2 | |
| K8 | Email konfirmasi otomatis | Tidak; kanal utama grup WhatsApp (lihat 3.5 butir 10) | Fase 2 | |
| K9 | Letak di Blogger | Halaman Blogger (Page), bukan posting, agar alamatnya tetap dan tidak tenggelam oleh posting lain | Fase 1 | |
| K10 | Satu tutor per room (2 jenjang x 3 bidang = 6 room = 6 tutor)? | Ya, tiap kartu tutor diberi label room | Fase 5 | |
| K11 | Peran moderator dipisah dari admin? | Ya. Dua kata sandi: admin (semua menu) dan moderator (hanya daftar pertanyaan, tanpa data pendaftar dan tanpa unduh) | Fase 7 | |

---

## 3. Arsitektur

### 3.1 Gambaran

```
Pengunjung (ponsel)
      |
      v
Halaman Blogger  (iframe layar penuh + gambar poster untuk pratinjau link)
      |
      v
Google Apps Script Web App (HtmlService: tampilan + fungsi server)
      |
      +--> Spreadsheet A "Database Webinar"  (privat, tim Ticketing)
      +--> Spreadsheet B "Konten Website"    (tim Marketing boleh edit)
      +--> Folder Drive "Gambar Web"         (foto dan poster, dibagikan lewat link)
```

Database dipisah dua karena data peserta hanya boleh diakses tim Ticketing (PDF 4.5), sedangkan konten perlu diedit tim lain.

### 3.2 Teknologi

- Google Apps Script (runtime V8), HtmlService dengan template dan file parsial, dikelola dengan `clasp`.
- Pemanggilan server dari browser memakai `google.script.run` (tanpa fetch dan tanpa masalah CORS).
- HTML, CSS, JavaScript biasa. Huruf Poppins dari Google Fonts, cadangan `system-ui, sans-serif`.
- SheetJS 0.18.5 dari cdnjs untuk membuat file Excel di panel admin, dimuat hanya saat panel admin dibuka.

### 3.3 Struktur folder

```
genio-menuju-juara/
├── PRD.md
├── CLAUDE.md
├── docs/
│   ├── Rancangan_Form_Webinar.pdf
│   ├── Genio_Colour_Palette_Guide.png
│   ├── poster-asli.png
│   ├── embed-blogger.html        # potongan kode untuk ditempel di Blogger
│   └── catatan-deploy.md         # URL /exec dan ID deployment
├── assets-raw/                    # bahan mentah dari Drive (logo dan lainnya)
└── gas/
    ├── appsscript.json
    ├── Code.gs                    # doGet, include(), data awal halaman
    ├── Setup.gs                   # lembar, menu panitia, data contoh, daftar gambar
    ├── Config.gs                  # pembacaan Pengaturan dan penentuan fase
    ├── Konten.gs
    ├── Pendaftaran.gs
    ├── Presensi.gs
    ├── Pertanyaan.gs
    ├── Admin.gs                   # login, peran, pengaturan, data, ekspor
    ├── Util.gs                    # normalisasi WA dan nama, sanitasi, lock
    ├── Index.html                 # kerangka halaman
    ├── Css.html
    ├── Logo.html                  # logo ditanam sebagai SVG atau data URI
    ├── JsApp.html                 # render konten, tombol floating, fase
    ├── JsFormDaftar.html
    ├── JsFormPresensi.html
    ├── JsFormTanya.html
    └── JsAdmin.html
```

### 3.4 Embed ke Blogger

Masalah utama embed biasa: tombol floating memakai posisi tetap terhadap jendela iframe, bukan terhadap layar ponsel. Bila iframe dibuat setinggi seluruh konten, tombol itu akan berada di ujung bawah halaman dan tidak lagi melayang. Karena itu iframe dibuat **menutupi seluruh layar**, sehingga Blogger hanya berfungsi sebagai alamat dan penyedia pratinjau link, sedangkan seluruh tampilan dan gulir terjadi di dalam iframe.

Potongan kode untuk ditempel di mode HTML halaman Blogger (Claude Code menyimpannya di `docs/embed-blogger.html` dengan URL yang benar):

```html
<img src="URL_GAMBAR_PRATINJAU_YANG_DIUNGGAH_KE_BLOGGER"
     alt="Webinar #MenujuJuara Eps. 1: Roadmap OSN 2027" />
<iframe src="URL_WEB_APP/exec"
        title="Webinar #MenujuJuara Eps. 1"
        style="position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:2147483647;background:#ffffff;">
</iframe>
```

- Gambar di atas iframe tertutup oleh iframe, tetapi dipakai Blogger sebagai gambar pratinjau link (og:image). Unggah gambar `poster-pratinjau.jpg` lewat editor Blogger.
- Judul halaman Blogger menjadi judul pratinjau. Aktifkan "Deskripsi penelusuran" di Setelan Blogger, lalu isi deskripsi singkat di halaman tersebut.
- Iframe tidak diberi atribut `sandbox`.
- Di Apps Script, `doGet` wajib memanggil `setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` agar boleh di-embed, serta menambahkan meta viewport lewat `addMetaTag`.
- Alamat web app `/exec` juga bisa dibuka langsung, misalnya oleh admin di laptop.
- **Perlu dicek di Fase 1:** web app Apps Script dari akun Gmail biasa kemungkinan menampilkan banner kecil dari Google di bagian atas. Banner ini dari Google dan tidak bisa dihapus lewat kode. Catat hasilnya di laporan.

### 3.5 Catatan teknis wajib

1. **Tautan keluar.** Halaman Apps Script berjalan di dalam iframe Google. Semua tautan keluar (WhatsApp, Maps, Instagram, grup WA, kalender) memakai `target="_blank" rel="noopener"`. Tambahkan `<base target="_top">` sebagai cadangan.
2. **Data awal disisipkan di template.** `doGet` membaca konfigurasi dan konten (dari cache), lalu menyisipkannya sebagai JSON di halaman, sehingga halaman tampil tanpa menunggu panggilan server kedua. Panggilan berikutnya (kirim form, cek status di hari H, panel admin) memakai `google.script.run`.
3. **Zona waktu.** `appsscript.json` memakai `"timeZone": "Asia/Jakarta"`. Semua penentuan fase dan jadwal memakai jam server.
4. **Penulisan bersamaan.** Semua penulisan dan pembuatan ID memakai `LockService.getScriptLock()` dengan waktu tunggu 20 detik.
5. **Nomor WA sebagai teks.** Kolom nomor diformat teks (`@`).
6. **Sanitasi rumus.** Isian berawalan `=`, `+`, `-`, atau `@` diberi awalan apostrof sebelum ditulis ke spreadsheet.
7. **Cache.** Konten 5 menit, status form 20 detik. Menyimpan pengaturan dari panel admin langsung membersihkan cache.
8. **Penyimpanan browser.** Di dalam iframe pihak ketiga, beberapa browser (terutama Safari iOS) membatasi `localStorage` dan `sessionStorage`. Semua pemakaiannya dibungkus `try/catch` dan bersifat pelengkap: bila gagal, fitur tetap berjalan tanpa penyimpanan. Token admin cukup disimpan di memori JavaScript.
9. **Deployment.** "Execute as: Me" dan "Who has access: Anyone" (tanpa login). Setiap pembaruan **memperbarui deployment yang sama** agar URL `/exec` tidak berubah. Sesuaikan perintah dengan versi clasp yang terpasang. URL `/dev` tidak dipakai untuk publik.
10. **Batas email.** Akun Gmail biasa hanya bisa mengirim email otomatis ke sekitar 100 penerima per hari lewat Apps Script, jadi email konfirmasi tidak dipakai (K8).
11. **Link grup WA** hanya dikirim server setelah pendaftaran berhasil, tidak pernah ditanam di halaman.
12. **Unduhan dari iframe.** Unduhan Excel dipicu langsung oleh klik admin. Bila browser memblokir unduhan di dalam iframe (misalnya browser bawaan aplikasi), tampilkan pesan yang menyarankan membuka alamat `/exec` langsung di Chrome. Uji di Fase 4.

---

## 4. Fase 0: Persiapan bahan (dikerjakan pemilik)

### 4.1 Struktur folder Google Drive

```
Genio - MenujuJuara Eps1/            ← JANGAN dibagikan publik
├── Gambar Web/                       ← satu-satunya folder yang dibagikan "Siapa saja yang memiliki link"
│   ├── poster-web.jpg
│   ├── indro.jpg
│   ├── tutor-01-[nama-panggilan].jpg
│   ├── ... sampai tutor-06
│   └── testimoni-[nama].jpg          (opsional)
├── Logo/
│   ├── genio.png
│   ├── osn.png
│   ├── genio-semarang.png
│   └── genio-jogja.png
├── Blogger/
│   └── poster-pratinjau.jpg          (diunggah ke halaman Blogger, bukan dipakai web app)
├── Dokumen/
│   ├── Rancangan_Form_Webinar.pdf
│   └── Genio_Colour_Palette_Guide.png
├── (Google Sheets) Database Webinar  ← dibuat di Fase 1
└── (Google Sheets) Konten Website    ← dibuat di Fase 1
```

Penting: bagikan hanya folder `Gambar Web`. Bila folder induk yang dibagikan, kedua spreadsheet di dalamnya ikut terbuka untuk siapa saja yang punya link.

Cara bahan dipakai:

- **Gambar Web**: menu spreadsheet "Perbarui daftar gambar" memindai folder ini dan mencatat ID tiap file. Konten cukup menyebut nama file (misalnya `tutor-01-rina.jpg`). Gambar ditampilkan lewat `https://drive.google.com/thumbnail?id=ID_FILE&sz=w800`, yang otomatis memperkecil ukuran.
- **Logo**: unduh ke `assets-raw/`. Claude Code mengompres dan menanamnya langsung di kode agar cepat tampil dan latar transparannya terjaga.
- **Blogger**: diunggah lewat editor Blogger (Bagian 3.4).

### 4.2 Spesifikasi bahan

| Bahan | Format | Ukuran | Catatan |
|---|---|---|---|
| Logo Genio, OSN, kedua cabang | PNG latar transparan, SVG lebih baik | Tinggi minimal 200 px | Jangan screenshot dari poster |
| Poster web | JPG | Lebar minimal 1080 px, rasio 4:5 | Versi tanpa QR lebih rapi di web |
| Gambar pratinjau | JPG | 1200 x 630 px, di bawah 300 KB | WhatsApp sering gagal menampilkan gambar di atas 300 KB |
| Foto narasumber dan tutor | JPG | Lebar minimal 800 px, rasio 4:5 | Latar dan pencahayaan seragam, wajah di sepertiga atas |
| Foto testimoni | JPG | Lebar minimal 400 px, rasio 1:1 | Opsional, hanya dengan izin |

### 4.3 Bahan teks

Boleh dikumpulkan dalam format bebas dulu. Template resmi berupa spreadsheet "Konten Website" dibuat otomatis di Fase 1, kolomnya ada di Bagian 6.2.

- Profil narasumber dan 6 tutor: nama dengan gelar, jabatan, room, satu kalimat ringkas, prestasi siswa binaan.
- Profil Genio: 1 sampai 2 paragraf, 3 sampai 4 angka kunci, daftar program.
- Cabang Semarang dan Jogja: alamat, link Google Maps, WA admin, Instagram.
- Prestasi siswa: tahun, nama, sekolah, jenjang, bidang, lomba, tingkat, medali.
- Testimoni orang tua: nama, keterangan, kutipan.
- FAQ, link grup WhatsApp peserta, link materi bonus (bila K3 disetujui).

### 4.4 Data contoh atau data asli

| Jenis data | Rekomendasi | Alasan |
|---|---|---|
| Data peserta (pendaftar, presensi, pertanyaan) | **Selalu data uji** selama pengembangan, ditandai otomatis dan dihapus sebelum tayang | Uji coba tidak boleh memakai data orang sungguhan; ID asli mulai dari MJ-0001 saat tayang |
| Narasumber dan tutor | **Asli** bila sudah ada, contoh bila belum | Hanya 7 orang; narasumber dibutuhkan di Rilis 1 |
| Profil Genio dan cabang | **Asli** | Teks pendek dan sudah diketahui tim |
| Prestasi dan testimoni | **Contoh dulu**, diganti bertahap | Butuh waktu dan izin orang tua; tayang di Rilis 2 |
| FAQ | **Contoh** dari Claude Code, lalu dikoreksi | |

Mekanisme:

- Tiap baris konten punya kolom `data_contoh` (YA/TIDAK).
- Pengaturan `tampilkan_data_contoh` (bisa diubah di panel admin) menentukan apakah baris contoh ikut tampil. Bila YA, kartu contoh berlabel "Contoh" dan muncul pita "Mode pratinjau: sebagian data adalah contoh".
- **Bagian tanpa baris tampil otomatis disembunyikan**, sehingga website bisa tayang dengan data asli yang sudah ada saja.
- Aturan keras: prestasi dan testimoni contoh **tidak boleh tampil di website publik**. Saat tayang, `tampilkan_data_contoh` wajib TIDAK.

---

## 5. Rencana rilis

Fokus utama adalah form pendaftaran, karena pendaftaran sudah harus berjalan dan tutup Sabtu, 7 November 2026 pukul 23.59 WIB (bisa diubah dari panel admin). Fitur hari H dikerjakan paling akhir karena baru dipakai 14 November.

| Rilis | Isi | Fase | Target usulan |
|---|---|---|---|
| Rilis 1: Bisa daftar | Form pendaftaran lengkap dan halaman konfirmasi, header dengan ikon admin, poster dan info, agenda, narasumber, footer, tombol floating untuk fase pendaftaran, panel admin untuk pendaftaran (ringkasan, pengaturan pendaftaran, daftar pendaftar, unduh Excel), embed Blogger | 1, 2, 3, 4 | Sabtu, 24 Oktober 2026 |
| Rilis 2: Konten lengkap | Tutor, profil Genio, cabang, prestasi, testimoni, ajakan bergabung, FAQ | 5 | Rabu, 28 Oktober 2026 |
| Rilis 3: Hari H | Presensi dan feedback, form pertanyaan, fase hari H dan selesai di tombol floating, pengaturan form hari H, tab Feedback dan Pertanyaan, peran moderator | 6, 7 | Selasa, 10 November 2026 |
| Gladi bersih | Uji alur hari H bersama panitia | 8 | Kamis, 12 November 2026 |
| Hari H | Sesuai Bagian 17 | | Sabtu, 14 November 2026 |

---

## 6. Struktur data

### 6.1 Spreadsheet A: "Database Webinar" (privat)

**Lembar `Pendaftar`** (satu baris per orang)

| Kolom | Isi |
|---|---|
| id_peserta | MJ-0001 dan seterusnya; data uji memakai UJI-0001 |
| id_pendaftaran | REG-0001; pendamping dan siswa yang didaftarkannya memakai ID yang sama |
| waktu_daftar | Tanggal dan jam WIB |
| peran | Siswa / Orang Tua / Guru Pembina |
| didaftarkan_oleh | MANDIRI, atau id_peserta pendamping |
| nama_lengkap | Seperti diketik |
| nama_kunci | Huruf kecil, spasi dirapikan, untuk pencocokan |
| wa | Nomor sendiri (628xxx), boleh kosong untuk siswa dari pendamping |
| wa_kunci | Nomor sendiri, atau nomor pendamping bila kosong |
| email | Pendaftar langsung |
| kota | Siswa dari pendamping mewarisi kota pendamping |
| kelas | 1 sampai 9 (siswa) |
| kategori | Siswa SD (kelas 1 sampai 6) / Siswa SMP (kelas 7 sampai 9) / Orang Tua / Guru Pembina |
| asal_sekolah, bidang, room, pengalaman_osn, siswa_genio, perangkat | Siswa. Room = jenjang + bidang, misalnya "SMP Matematika" |
| sekolah_mengajar, jenjang_dibina, bidang_dibina | Guru |
| daftarkan_siswa, jumlah_didaftarkan | Pendamping |
| minat_jenjang_anak, minat_bidang_anak, anak_siswa_genio | Orang tua yang tidak mendaftarkan anak |
| sumber_info, pertanyaan_narsum | Bagian 8 |
| setuju_kehadiran, setuju_siswa_binaan, setuju_info_program | YA/TIDAK; siswa dari pendamping mewarisi `setuju_info_program` pendamping |
| sumber_link | Parameter `ref` atau `utm_source` dari URL bila ada |
| uji | YA bila data uji |

**Lembar `Presensi`** (dibuat di Fase 6): waktu_isi, wa, nama_lengkap, nama_kunci, kategori, kelas_simulasi, nilai_strategi, nilai_kelas_simulasi, nilai_tutor, nilai_sharing_session, nilai_teknis, bagian_bermanfaat, topik_berikutnya, kritik_saran, minat_program, status_cocok (cocok / tidak ditemukan), id_peserta, uji.

**Lembar `Pertanyaan`** (dibuat di Fase 7): id (T-001), waktu_kirim, nama_inisial, kategori_penanya, jenjang, pertanyaan, status (belum dibahas / sudah dibahas), waktu_dibahas, uji.

**Lembar `Pengaturan`** (kolom: kunci, nilai, keterangan). Bisa diubah dari panel admin atau langsung di lembar. Kunci untuk hari H (`form_pertanyaan` sampai `acara_selesai`, serta `link_bonus_materi`) baru ditambahkan di Fase 6 dan 7 lewat menu "Siapkan lembar".

| Kunci | Default | Keterangan |
|---|---|---|
| form_pendaftaran | OTOMATIS | OTOMATIS mengikuti tanggal; BUKA atau TUTUP untuk paksa |
| pendaftaran_buka | 2026-10-19 00:00 | |
| pendaftaran_tutup | 2026-11-07 23:59 | |
| tanggal_hari_h | 2026-11-14 | |
| form_pertanyaan | TUTUP | TUTUP / BUKA / TERJADWAL |
| pertanyaan_buka, pertanyaan_tutup | (kosong) | Tanggal dan jam, dipakai bila TERJADWAL |
| form_presensi | TUTUP | TUTUP / BUKA / TERJADWAL |
| presensi_buka, presensi_tutup | (kosong) | Dipakai bila TERJADWAL |
| acara_selesai | TIDAK | YA untuk memaksa fase selesai |
| link_grup_wa | (kosong) | Wajib diisi sebelum tayang |
| link_bonus_materi | (kosong) | Ditampilkan setelah presensi bila K3 disetujui |
| kuota_sd_matematika, kuota_sd_ipa, kuota_sd_ips, kuota_smp_matematika, kuota_smp_ipa, kuota_smp_ips | 0 | 0 berarti tanpa batas |
| mode_uji | YA | Selama YA, semua kiriman ditandai data uji |

**Lembar `Rekap`** (diperbarui sistem): jumlah per kategori, siswa per room dibanding kuota dengan status (aman / hampir penuh di atas 90% / penuh), jumlah presensi, prospek. Data uji tidak dihitung.

**Lembar `Log_Admin`**: waktu, peran (admin/moderator), aksi, kunci, nilai_lama, nilai_baru. Mencatat setiap perubahan dari panel admin, login gagal, dan unduhan data.

**Script Properties**: `DB_SHEET_ID`, `KONTEN_SHEET_ID`, `GAMBAR_FOLDER_ID`, `ADMIN_PASSWORD`, dan mulai Fase 7 `MODERATOR_PASSWORD`.

### 6.2 Spreadsheet B: "Konten Website"

Kolom bersama: `urutan`, `tampil` (YA/TIDAK), `data_contoh` (YA/TIDAK).

| Lembar | Kolom khusus |
|---|---|
| Pengaturan_Konten | kunci, nilai: tampilkan_data_contoh, judul_acara, tagline, tanggal_teks, jam_teks, media_teks, poster, bonus_teks, bonus_syarat, narahubung_nama, narahubung_wa, instagram_1, instagram_2, cta_judul, cta_kalimat, cta_teks_tombol, cta_pesan_wa |
| Agenda | judul, deskripsi, sasaran (Semua peserta / Siswa / Orang Tua & Guru), jam |
| Narasumber_Tutor | peran (Narasumber / Tutor), nama_lengkap, jabatan, room, foto, ringkasan, prestasi_binaan (satu per baris di dalam sel) |
| Profil | kunci, nilai: judul, paragraf_1, paragraf_2, angka_1 sampai angka_4, label_1 sampai label_4, program (dipisah koma) |
| Cabang | nama, logo, alamat, link_maps, wa_admin, instagram |
| Prestasi | tahun, nama_siswa, sekolah, jenjang, bidang, lomba, tingkat, medali (Emas / Perak / Perunggu / Harapan / Lainnya), sorotan (YA/TIDAK) |
| Testimoni | nama, keterangan, kutipan, foto |
| FAQ | pertanyaan, jawaban |
| Gambar | nama_file, id_file, url, terakhir_diperbarui (diisi otomatis oleh menu "Perbarui daftar gambar") |

Kolom `foto` berisi nama file di folder Gambar Web. Default `cta_teks_tombol`: "Konsultasi Gratis via WhatsApp". Default `cta_pesan_wa`: "Halo Genio, saya tertarik dengan program olimpiade setelah melihat webinar Menuju Juara."

### 6.3 Data uji

- Selama `mode_uji` = YA, setiap kiriman diberi `uji` = YA dan ID berawalan UJI-.
- Setelah tayang, panitia tetap bisa menguji dengan nama berawalan `[UJI]`; baris itu otomatis ditandai uji.
- Menu "Hapus data uji" menghapus semua baris uji dari Pendaftar, Presensi, dan Pertanyaan.

### 6.4 Menu panitia di spreadsheet (menu "Genio")

- Siapkan lembar (membuat lembar dan header yang belum ada tanpa menghapus data)
- Isi data contoh (Konten Website)
- Perbarui daftar gambar (Konten Website)
- Hapus data uji (Database)
- Perbarui rekap (Database)
- Ganti kata sandi admin / moderator (ubah Script Properties `ADMIN_PASSWORD` / `MODERATOR_PASSWORD`, karena proyek standalone tidak punya kotak isian spreadsheet)
- Buka kunci login (fungsi `bukaKunciLogin` di editor Apps Script)
- Bersihkan cache

---

## 7. Tampilan dan desain

### 7.1 Warna

| Nama | Hex | Peran |
|---|---|---|
| Cyan Final | #1399D8 | Sorotan utama, judul bagian, ikon |
| Indigo Final | #2F377E | Kedalaman merek, teks di atas tombol terang, latar bagian gelap |
| Coral CTA | #FF8A5B | Tombol aksi utama (daftar, presensi) |
| Gold Accent | #F2C14E | Medali, prestasi, penanda bonus |
| Teal Accent | #16C7B8 | Aksen pendukung, gradasi bersama Cyan seperti poster |
| Item Color | #54563B | Teks isi dan judul |

Aturan kontras (WCAG AA):

- Teks putih di atas Coral (2,3:1) dan Teal (2,1:1) **tidak lolos**. Tombol Coral memakai teks Indigo (4,6:1).
- Teks putih di atas Cyan (3,2:1) hanya untuk teks besar atau tebal.
- Item Color di atas putih (7,6:1) dan Indigo di atas putih (10,7:1) aman untuk teks isi. Indigo di atas Gold (6,4:1) aman untuk label medali.

Halaman memakai latar terang seperti poster, dengan latar `body` ditetapkan eksplisit.

**Gradien Cyan ke Teal** (`linear-gradient(90deg, #1399D8, #16C7B8)`) dipakai di beberapa tempat saja, seperti poster: sorotan judul (kotak "OSN 2027"), label "#MenujuJuara", strip tanggal pelaksanaan, pita bonus, dan latar bagian bawah halaman. Tombol, kartu isi, dan teks panjang tetap warna rata. Teks di atas gradien memakai putih tebal berukuran besar (lihat aturan kontras di atas).

### 7.2 Huruf dan tata letak

- Poppins: 400 untuk isi, 600 untuk label, 700 sampai 800 untuk judul. Isi minimal 16 px di ponsel.
- Lebar konten maksimal 1120 px, baris teks maksimal sekitar 70 karakter. Rancang dari lebar 360 px.
- Ruang bawah halaman disisakan setinggi tombol floating.
- Hormati `prefers-reduced-motion`; cukup satu momen animasi di bagian pembuka.
- Fokus keyboard terlihat, semua input berlabel, area sentuh minimal 44 px.

---

## 8. Spesifikasi halaman utama (urutan dari atas)

1. **Header.** Seperti poster: logo Genio dan OSN berukuran kecil di kiri, lencana centang dengan teks dua baris "Terbuka untuk Siswa SD, SMP," / "Guru & Orang tua" di kanan. Tidak ada ikon admin yang terlihat: **mengetuk ikon centang membuka layar masuk panel admin** (pintu tersembunyi; tetap dilindungi kata sandi). Header berada di luar kotak konten, di atas latar halaman, seperti logo pada referensi. Seluruh halaman, termasuk di desktop, berupa satu kolom di tengah (lebar maksimal sekitar 760 px) dengan jarak dari tepi layar, mengikuti referensi go.okegas.app.
2. **Poster dan info acara.** Paling atas langsung poster penuh lebar kolom (bisa diketuk untuk diperbesar). Di bawahnya strip "Pelaksanaan" (tanggal dan label Gratis), lalu kartu "Pukul" dan "Live di", lalu hitung mundur "Pendaftaran ditutup dalam X hari" selama fase daftar, dari jam server. Bila poster belum diunggah, tampil judul acara sebagai gantinya.
3. **Agenda.** Timeline vertikal bernomor 1 sampai 3, dengan label sasaran dan jam bila diisi.
4. **Narasumber.** Kartu besar Indro: foto, nama, jabatan, ringkasan, 3 prestasi teratas, "Lihat selengkapnya" membuka panel dari bawah layar.
5. **Tutor.** Kartu geser horizontal (scroll-snap) di ponsel dengan kartu berikutnya terlihat di tepi dan indikator titik; grid 3 kolom di layar lebar. Tiap kartu: foto, nama, label room, ringkasan, 2 prestasi teratas, "Lihat selengkapnya" membuka panel dari bawah (bukan dropdown, agar tinggi kartu seragam).
6. **Apa itu Genio.** Judul, 1 sampai 2 paragraf, 3 sampai 4 angka kunci, chip program.
7. **Cabang.** Dua kartu sebaris (Semarang dan Jogja): logo, nama, alamat singkat, tautan Maps, WhatsApp admin, Instagram.
8. **Prestasi terbaru.** Ringkasan jumlah medali per jenis (warna Gold), chip filter bidang (Semua, Matematika, IPA, IPS), daftar ringkas per baris (ikon medali, nama, sekolah, lomba, tingkat, tahun). Baris `sorotan` di atas, lalu tahun terbaru. Tampil 8, lalu "Tampilkan lebih banyak" menambah 8.
9. **Apa kata orang tua.** Kartu geser: kutipan, nama, keterangan, foto bila ada.
10. **Ajakan bergabung.** "Tertarik bergabung dengan Genio?", satu kalimat pendukung, tombol Indigo dengan teks `cta_teks_tombol`. Tombol membuka pilihan cabang, lalu WhatsApp admin cabang dengan pesan `cta_pesan_wa`.
11. **FAQ.** Akordeon. Draf: apakah gratis, kapan link Zoom dibagikan, apakah ada sertifikat, bolehkah dua anak satu perangkat (kaitannya dengan room), syarat bonus materi, bagaimana bila siswa tidak punya WhatsApp.
12. **Footer.** Narahubung, dua akun Instagram, hak cipta Genio Institute.

Bagian 5 sampai 11 disembunyikan otomatis bila tidak ada data yang tampil. Bila server gagal dihubungi, bagian dinamis menampilkan pesan singkat dengan tombol "Muat ulang", dan tombol floating menampilkan "Hubungi narahubung".

---

## 9. Tombol floating dan fase acara

Fase dihitung server. Fase `belum_buka`, `daftar`, dan `tutup` dibuat di Fase 3. Fase `hari_h` dan `selesai` baru dibuat di Fase 6; sebelum itu, setelah pendaftaran ditutup tombol tetap bertuliskan "Pendaftaran Ditutup".

| Fase | Kondisi | Tampilan tombol |
|---|---|---|
| belum_buka | Sebelum `pendaftaran_buka` (mode OTOMATIS) | Tidak aktif: "Pendaftaran dibuka [tanggal]" |
| daftar | Pendaftaran terbuka | Gradien Coral ke Gold, teks putih, berdetak pelan: "Daftar" (keterangan "Gratis" dan hitung mundur di sebelah kiri) |
| tutup | Pendaftaran tertutup dan belum hari H | Tidak aktif: "Pendaftaran Ditutup", dengan teks kecil "Sudah daftar tapi belum masuk grup? Hubungi Lily" |
| hari_h | Tanggal = `tanggal_hari_h` dan belum selesai | Dua tombol: "Ajukan Pertanyaan" dan "Isi Presensi", masing-masing aktif hanya bila form-nya sedang terbuka; bila tidak, tampil redup dengan keterangan "Belum dibuka" atau "Sudah ditutup" |
| selesai | `acara_selesai` = YA, atau presensi terjadwal sudah lewat jam tutup, atau tanggal sudah lewat hari H | "Terima kasih sudah hadir", dengan tautan Instagram untuk episode berikutnya |

Status form pertanyaan dan presensi:

- TUTUP: selalu tertutup. BUKA: selalu terbuka. TERJADWAL: terbuka di antara jam buka dan jam tutup.
- Pada fase `hari_h`, halaman memeriksa status setiap 30 detik, sehingga tombol aktif tanpa memuat ulang halaman.
- Tautan langsung `?form=daftar`, `?form=tanya`, `?form=presensi` (pada URL halaman Blogger atau `/exec`) membuka form terkait. Bila form tertutup, tampil pesan "Form ini belum dibuka" atau "Form ini sudah ditutup", bukan isian.
- Form pertanyaan khusus orang tua dan guru; judulnya menyebutkan hal itu.
- Server selalu memeriksa ulang status saat menerima kiriman.

Catatan untuk Claude Code: halaman Blogger meneruskan parameter `?form=` ke iframe lewat skrip kecil di potongan embed (membaca `location.search` halaman Blogger lalu menambahkannya ke `src` iframe). Sertakan skrip itu di `docs/embed-blogger.html`.

---

## 10. Form pendaftaran (fokus utama)

### 10.1 Bentuk

Form bertahap layar penuh (bukan gaya chat seperti referensi), satu bagian per langkah, dengan bilah kemajuan, tombol "Kembali" dan "Lanjut", dan halaman ringkasan sebelum kirim. Draf isian disimpan sementara di browser bila memungkinkan (lihat 3.5 butir 8), lalu dihapus setelah terkirim; tombol "Mulai ulang" juga menghapus draf.

### 10.2 Alur

Label, pilihan, dan teks bantuan mengikuti **PDF Bagian 0 sampai 8** (kecuali teks persetujuan bila K2 disetujui).

| Jalur | Urutan bagian |
|---|---|
| Siswa | 0, 1, 2, 8 |
| Orang tua, mendaftarkan anak | 0, 1, 3, 5, 7 (diulang), 8 |
| Orang tua, tidak mendaftarkan anak | 0, 1, 3, 5, 6, 8 |
| Guru, mendaftarkan siswa | 0, 1, 3, 4, 5, 7 (diulang), 8 |
| Guru, tidak mendaftarkan siswa | 0, 1, 3, 4, 5, 8 |

### 10.3 Aturan

- Validasi wajib isi hanya untuk bagian yang tampil, di browser dan di server.
- **Nomor WA** diterima sebagai 08xxx, 628xxx, +628xxx, termasuk spasi dan tanda hubung, disimpan sebagai 628xxx, valid bila cocok `^628\d{7,11}$`. Pesan salah: "Nomor WhatsApp belum sesuai. Contoh: 081234567890."
- **Kelas** menentukan kategori: 1 sampai 6 Siswa SD, 7 sampai 9 Siswa SMP. Room = jenjang + bidang.
- **Bagian 5**: jumlah minimal 1 tanpa batas atas menentukan jumlah blok Bagian 7; tersedia juga tombol "Tambah siswa" dan "Hapus" per blok.
- **Bagian 7**: blok bisa dilipat (menampilkan nama dan room). Untuk guru, Asal Sekolah terisi dari Bagian 4 dan dapat diubah. Tombol "Salin sekolah dan bidang dari siswa sebelumnya". WA siswa boleh kosong; bila kosong, `wa_kunci` memakai nomor pendamping.
- **Persetujuan** Bagian 8 mengikuti jalur (PDF). Poin 4 hanya untuk guru yang mendaftarkan siswa. Poin 5 tidak wajib.
- **Cegah daftar ganda** dengan kunci `wa_kunci` + `nama_kunci`, terhadap data yang ada dan antar-siswa dalam satu kiriman:
  - Pendaftar mandiri yang sudah terdaftar: "Peserta ini sudah terdaftar", tanpa baris baru.
  - Sebagian siswa kiriman pendamping sudah terdaftar: nama-namanya ditampilkan di ringkasan dan pengguna diminta menghapus blok itu sebelum kirim. Kiriman bersifat semua-atau-tidak-sama-sekali.
  - Pendamping yang sudah terdaftar menambah siswa: hanya siswa baru disimpan, tersambung ke `id_pendaftaran` lama, dan pengguna diberi tahu.
- **ID** dibuat di server di dalam lock.
- **Kuota**: setelah menyimpan, hitung siswa per room dan perbarui Rekap. Pendaftaran tetap diterima; room yang penuh ditandai di panel admin.
- **Anti-bot ringan**: isian tersembunyi (honeypot) dan penolakan kiriman yang selesai kurang dari 5 detik.
- **Gagal kirim**: isian tidak hilang, tampil "Coba kirim lagi" dan tautan narahubung.

### 10.4 Halaman konfirmasi

- "Pendaftaran berhasil", ID Pendaftaran, ringkasan nama, kategori, dan room untuk siswa.
- Untuk pendamping: daftar siswa beserta room, dan pengingat bila ada siswa yang berbagi perangkat.
- Tombol utama "Gabung Grup WhatsApp Peserta" (link dari server).
- Tombol "Tambahkan ke Google Calendar" dengan `dates=20261114T010000Z/20261114T050000Z` (08.00 sampai 12.00 WIB, sesuaikan K7).
- Saran "Simpan tangkapan layar halaman ini".

### 10.5 Rincian tampilan

- Bagian 0 tampil sebagai dua kartu pilihan besar: "Siswa" (mendaftar untuk diri sendiri) dan "Pendamping" (orang tua atau guru pembina, bisa sekaligus mendaftarkan anak atau siswa binaan).
- Penanda "Langkah X dari Y", dengan Y menyesuaikan jalur. Seluruh blok Bagian 7 dihitung sebagai satu langkah "Data siswa".
- Judul langkah memakai nama bagian di PDF dalam bahasa yang ramah, misalnya "Data diri", "Data siswa", "Penutup".
- Isian: nama memakai `autocomplete="name"`; WA memakai `type="tel"`, `inputmode="tel"`, `autocomplete="tel"`; email memakai `type="email"`, `autocomplete="email"`; kelas berupa dropdown; pilihan ganda dan kotak centang berupa kartu sentuh besar.
- Validasi dijalankan saat kolom ditinggalkan dan saat menekan "Lanjut", bukan di setiap ketikan. Pesan tampil di bawah kolom, dan fokus pindah ke kolom pertama yang belum benar.
- **Ganti jalur:** bila pengguna kembali dan mengubah Daftar Sebagai, Peran Anda, atau pilihan mendaftarkan siswa, isian bagian yang tidak lagi relevan dibuang sebelum dikirim. Server juga mengabaikan isian di luar jalur.
- Blok Bagian 7: blok baru langsung terbuka, blok sebelumnya terlipat, dengan penghitung "Siswa 3 dari 12". Blok yang masih berisi isian salah tetap ditandai saat terlipat.
- Halaman ringkasan dikelompokkan per bagian, dengan tautan "Ubah" yang langsung menuju langkah terkait.
- Tombol akhir bertuliskan "Kirim Pendaftaran".

### 10.6 Pesan dan pengiriman

| Kondisi | Pesan |
|---|---|
| Isian wajib kosong | Bagian ini perlu diisi. |
| Nomor WA tidak sesuai | Nomor WhatsApp belum sesuai. Contoh: 081234567890. |
| Email tidak sesuai | Alamat email belum sesuai. Contoh: nama@gmail.com. |
| Jumlah siswa kurang dari 1 | Isi minimal 1 siswa. |
| Persetujuan wajib belum dicentang | Centang persetujuan ini untuk melanjutkan. |
| Pendaftar sudah terdaftar | Peserta ini sudah terdaftar. |
| Pendaftaran tertutup saat mengirim | Pendaftaran sudah ditutup. Hubungi Lily di 0878-3886-2882 bila ada kendala. |
| Koneksi terputus | Pendaftaran belum terkirim karena koneksi terputus. Isian Anda masih ada, silakan coba kirim lagi. |

- Saat tombol kirim diketuk, tombol langsung nonaktif dan bertuliskan "Menyimpan pendaftaran…" agar tidak terkirim dua kali.
- Setiap form membawa `kode_kiriman` acak yang dibuat saat form dibuka. Bila server menerima kode yang sama lagi dalam 6 jam (misalnya pengguna mencoba ulang setelah koneksi putus padahal data sudah tersimpan), server mengembalikan hasil pendaftaran yang sama, bukan pesan duplikat.

---

## 11. Form presensi dan feedback

- Isi mengikuti **PDF Form 2** beserta percabangan kategori.
- Hanya bisa diisi saat form presensi terbuka.
- Pencocokan WA + `nama_kunci` ke `wa_kunci` + `nama_kunci` di Pendaftar. Bila tidak ditemukan, peringatan lunak: "Nama atau nomor tidak ditemukan di data pendaftar. Pastikan sama seperti saat mendaftar." dengan pilihan "Periksa lagi" atau "Tetap kirim" (tersimpan sebagai tidak ditemukan).
- Satu kali per kombinasi WA + nama; percobaan kedua: "Presensi untuk nama ini sudah tercatat."
- Setelah terkirim: terima kasih dan, bila K3 disetujui, tombol "Unduh Materi Kelas OSN".

## 12. Form pertanyaan

- Isi mengikuti **PDF Form 3**. Judul: "Pertanyaan untuk Sharing Session (khusus orang tua & guru)".
- Hanya bisa diisi saat form pertanyaan terbuka. Pertanyaan maksimal 1.000 karakter; nama boleh kosong.
- Setelah terkirim: "Pertanyaan terkirim. Mas Indro akan membahasnya sesuai urutan." dan tombol "Kirim pertanyaan lain".

---

## 13. Panel admin

Dibuka dengan mengetuk ikon centang di header, atau langsung lewat `?admin=1`. Tampil sebagai lapisan layar penuh di atas halaman.

Pembagian pengerjaan:

| Fase | Bagian panel admin |
|---|---|
| Fase 4 | 13.1 (peran admin saja), 13.2 (angka pendaftaran dan kuota), 13.3 (kelompok Pendaftaran, Hari H, link grup WA, Kuota, Lainnya), 13.4, dan 13.7 (lembar Pendaftar, Rekap, dan prospek dari pendaftaran) |
| Fase 6 | Pengaturan form presensi, tandai acara selesai, link materi bonus, angka presensi di Ringkasan, tab Feedback (13.5), data feedback di unduhan |
| Fase 7 | Pengaturan form pertanyaan, tab Pertanyaan (13.6), peran moderator |

### 13.1 Masuk dan peran

- Layar masuk: satu kolom kata sandi dan tombol "Masuk".
- Server mencocokkan kata sandi dengan `ADMIN_PASSWORD` atau `MODERATOR_PASSWORD`, lalu mengembalikan token acak berisi peran, berlaku 6 jam (CacheService). Token hanya disimpan di memori; memuat ulang halaman berarti masuk lagi.
- Setiap login gagal ditunda 2 detik. Setelah 20 kali gagal dalam 15 menit, login dikunci 15 menit (bisa dibuka lewat menu "Buka kunci login"). Semua login gagal dicatat di Log_Admin.
- Tombol "Keluar" di pojok panel.
- **Admin** melihat semua tab. **Moderator** hanya melihat tab Pertanyaan. Peran diperiksa di server pada setiap pemanggilan, bukan hanya disembunyikan di tampilan.

### 13.2 Tab Ringkasan (admin, tab pertama)

- Angka utama: total pendaftar, jumlah per kategori, jumlah presensi dan rasio hadir, jumlah prospek, pertanyaan belum dibahas.
- Tabel siswa per room dibanding kuota dengan status (aman / hampir penuh / penuh).
- Fase saat ini dan jam server.
- Pita peringatan bila `mode_uji` = YA atau `tampilkan_data_contoh` = YA.

### 13.3 Tab Pengaturan (admin)

| Kelompok | Isian |
|---|---|
| Pendaftaran | Mode (Otomatis ikut tanggal / Buka sekarang / Tutup sekarang), tanggal dan jam buka, tanggal dan jam tutup |
| Hari H | Tanggal hari H |
| Form pertanyaan | Mode (Tutup / Buka / Terjadwal), jam buka dan jam tutup bila terjadwal |
| Form presensi | Mode (Tutup / Buka / Terjadwal), jam buka dan jam tutup bila terjadwal |
| Acara | Tandai acara selesai |
| Tautan | Link grup WhatsApp, link materi bonus |
| Kuota | Enam isian kuota per room |
| Lainnya | Mode uji, tampilkan data contoh |

- Memakai input tanggal dan jam bawaan browser, ditampilkan dalam WIB.
- Validasi: jam tutup harus setelah jam buka; link harus diawali `https://`.
- Di bawah isian tampil pratinjau "Dengan pengaturan ini, status sekarang: [fase dan status tiap form]".
- Tombol "Simpan pengaturan". Perubahan berdampak besar meminta konfirmasi dengan label tindakan yang jelas, misalnya "Tutup pendaftaran sekarang?" dengan tombol "Tutup pendaftaran" dan "Batal".
- Menyimpan menulis ke lembar Pengaturan (dan Pengaturan_Konten untuk data contoh), membersihkan cache, dan mencatat ke Log_Admin.

### 13.4 Tab Pendaftar (admin)

- Pencarian (nama, nomor WA, ID, sekolah) dan filter (kategori, room, peran, didaftarkan pendamping atau mandiri).
- Di layar lebar: tabel. Di ponsel: daftar kartu. Paginasi 50 baris.
- Mengetuk satu baris membuka detail lengkap, termasuk siswa lain dalam ID Pendaftaran yang sama.
- Kolom penanda perangkat bersama, agar panitia breakout room bisa mengantisipasi.

### 13.5 Tab Feedback (admin)

- Jumlah presensi, jumlah tidak cocok dengan data pendaftar.
- Rata-rata nilai: materi strategi, kelas simulasi per room, kejelasan tutor per room, Sharing Session, kelancaran teknis.
- Daftar jawaban teks (bagian bermanfaat, topik berikutnya, kritik dan saran) dengan filter kategori.

### 13.6 Tab Pertanyaan (admin dan moderator)

- Terbaru di atas, dimuat ulang otomatis setiap 5 detik tanpa mengubah posisi gulir.
- Filter kategori penanya, jenjang, status. Penghitung "Belum dibahas: N".
- Tombol "Tandai sudah dibahas" per pertanyaan, bisa dibatalkan; yang sudah dibahas tampil redup.
- Huruf besar dan kontras tinggi agar mudah dibacakan.

### 13.7 Unduh Excel (admin)

- Tombol "Unduh semua data (.xlsx)": file berisi lembar Pendaftar, Presensi_Feedback, Pertanyaan, Rekap.
- Tombol "Unduh daftar prospek (.xlsx)": hanya orang yang menyetujui informasi program di pendaftaran atau memilih ingin dihubungi di feedback, dengan kolom sumber persetujuan.
- Pilihan "Sertakan data uji" (default tidak dicentang).
- Judul kolom memakai bahasa yang mudah dibaca; nomor WA tetap teks; waktu dalam WIB.
- Nama file: `MenujuJuara-Eps1_[jenis]_[YYYY-MM-DD_HHmm].xlsx`.
- Setiap unduhan dicatat di Log_Admin.
- File dibuat di browser dengan SheetJS dari data yang dikirim server; lihat 3.5 butir 12 bila unduhan diblokir.

---

## 14. Fungsi server (dipanggil lewat `google.script.run`)

Semua fungsi mengembalikan `{ ok: true, data }` atau `{ ok: false, error: { code, message } }`.

| Fungsi | Masukan | Keluaran |
|---|---|---|
| `getConfig()` | | fase, status tiap form, jam server, sisa hari pendaftaran |
| `getContent()` | | Konten yang lolos aturan `tampil` dan `data_contoh` |
| `submitDaftar(data)` | Data form beserta `kode_kiriman` | id_pendaftaran, peserta (nama, ID, room), link_grup_wa. Galat: `TUTUP`, `DUPLIKAT`, `VALIDASI` |
| `submitPresensi(data, paksa)` | Data form | status_cocok, link_bonus_materi. Galat: `TUTUP`, `SUDAH_PRESENSI`, `TIDAK_DITEMUKAN` |
| `submitTanya(data)` | Data form | id. Galat: `TUTUP`, `VALIDASI` |
| `adminLogin(password)` | | token, peran. Galat: `SALAH`, `TERKUNCI` |
| `adminGetSettings(token)` | | Isi Pengaturan dan pratinjau fase |
| `adminSaveSettings(token, perubahan)` | | Pengaturan baru. Galat: `VALIDASI` |
| `adminGetData(token, jenis, sertakanUji)` | jenis: ringkasan / pendaftar / feedback / pertanyaan / prospek | Baris data |
| `adminTandaiPertanyaan(token, id, status)` | | ok |
| `adminCatatUnduhan(token, jenis)` | | ok |

`doGet` merender `Index.html` dengan data awal dari `getConfig()` dan `getContent()`. Tidak ada fungsi publik yang mengembalikan data peserta; semua fungsi `admin*` memeriksa token dan peran.

---

## 15. Keamanan dan privasi

- Mengikuti PDF 4.5. Kedua spreadsheet tidak dibagikan publik; Database hanya untuk tim Ticketing. Hanya folder Gambar Web yang dibagikan lewat link.
- Kata sandi admin dan moderator berbeda, minimal 12 karakter, diganti lewat menu spreadsheet, dan dibagikan hanya kepada panitia yang perlu.
- Ikon admin terlihat publik, jadi perlindungan sepenuhnya ada di kata sandi, penundaan login gagal, penguncian, dan pemeriksaan peran di server.
- Tindak lanjut penawaran program hanya untuk orang yang menyetujuinya; unduhan prospek sudah tersaring.
- Nama dan foto siswa di prestasi dan testimoni hanya ditampilkan setelah ada izin orang tua (lewat kolom `tampil`).
- Semua masukan divalidasi ulang di server, dipotong panjangnya, dan disanitasi.

## 16. Kebutuhan non-fungsional

- Halaman tampil dalam sekitar 3 detik di jaringan 4G (termasuk waktu muat Apps Script).
- Gambar dari Drive memakai alamat langsung `https://lh3.googleusercontent.com/d/ID=w<lebar>` (cadangan: `drive.google.com/thumbnail`) dengan ukuran sesuai layar (poster 600/1080 px, kartu 400/800 px) dan `loading="lazy"` kecuali poster. Alamat poster ditanam server di HTML beserta `preload` agar langsung diunduh.
- Diuji di dalam embed Blogger dan di alamat `/exec` langsung, pada Chrome Android, Safari iOS, browser bawaan WhatsApp dan Instagram, serta Chrome desktop.
- Tahan sekitar 300 kiriman presensi dalam 10 menit; browser mencoba ulang otomatis sekali bila server sibuk.

---

## 17. Panduan hari H untuk panitia

Semua pengaturan dilakukan di panel admin, tab Pengaturan. Bila rundown sudah pasti, form bisa dijadwalkan sekaligus di pagi hari; bila belum, gunakan mode Buka dan Tutup secara manual.

| Waktu | Tindakan | Lainnya |
|---|---|---|
| Pagi sebelum acara | Cek form pertanyaan dan presensi berstatus Tutup atau Terjadwal dengan jam yang benar | Moderator masuk ke panel admin dengan kata sandi moderator, tab Pertanyaan |
| Sharing Session dimulai | Form pertanyaan: Buka (bila tidak terjadwal) | Bagikan link `?form=tanya` di chat Zoom Sharing Session |
| Sharing Session berakhir | Form pertanyaan: Tutup | |
| Menjelang penutupan | Form presensi: Buka | Umumkan dan bagikan link `?form=presensi` di chat Zoom |
| Sekitar 15 menit setelah penutupan | Form presensi: Tutup, tandai acara selesai | Unduh semua data |

Perubahan tampil di halaman pengunjung paling lambat sekitar 30 detik.

---

## 18. Fase pengerjaan untuk Claude Code

### Fase 1: Fondasi dan uji embed

Langkah manual pemilik (Claude Code memandu satu per satu):

1. Buat dua Google Sheets kosong, "Database Webinar" dan "Konten Website", serta folder "Gambar Web" yang dibagikan lewat link. Salin ID ketiganya.
2. Aktifkan Google Apps Script API di https://script.google.com/home/usersettings (syarat clasp).
3. Pasang clasp dan login.
4. Buat halaman Blogger percobaan (bisa disimpan sebagai draf).

Pekerjaan Claude Code:

- Struktur folder sesuai 3.3, `appsscript.json` dengan zona waktu Asia/Jakarta.
- `Setup.gs`: lembar Database untuk pendaftaran saja (Pendaftar, Pengaturan tanpa kunci hari H, Rekap, Log_Admin), seluruh lembar Konten Website, kolom WA sebagai teks, menu panitia, data contoh, pemindai folder Gambar Web.
- `Code.gs`: `doGet` dengan `include()`, data awal di template, `ALLOWALL`, meta viewport. `getConfig()` (fase pendaftaran saja) dan `getContent()` dengan cache.
- Halaman uji sederhana yang menampilkan fase dan satu tombol floating.
- `docs/embed-blogger.html` dan `docs/catatan-deploy.md`.

Selesai bila: halaman uji tampil di `/exec` dan di halaman Blogger percobaan; tombol floating tetap melayang di bawah layar ponsel saat digulir; tautan WhatsApp uji terbuka; ada atau tidaknya banner Google tercatat; menu "Genio" muncul di kedua spreadsheet.

### Fase 2: Form pendaftaran (fokus utama)

- Seluruh Bagian 10 (termasuk 10.5 dan 10.6) dan `Pendaftaran.gs`, beserta Rekap dan penghitungan kuota.
- Form bisa dibuka lewat `?form=daftar` dari halaman uji Fase 1, sehingga bisa diuji tuntas sebelum halaman utama dibuat.
- Bila K5 ada pendaftar lama: skrip impor sekali jalan dengan pemetaan kolom yang dikonfirmasi pemilik.

Selesai bila: skenario U1 sampai U8 dan U27 sampai U30 lolos, di ponsel (termasuk browser bawaan WhatsApp) dan di laptop.

### Fase 3: Halaman utama Rilis 1

- Logo ditanam di `Logo.html`. Bagian 1 sampai 4 dan 12 halaman utama, strip info, hitung mundur, ikon admin (membuka layar masuk kosong dulu).
- Tombol floating untuk fase `belum_buka`, `daftar`, dan `tutup`, terhubung ke form pendaftaran, serta tautan `?form=daftar` dari halaman Blogger.

Selesai bila: rapi di lebar 360 px dan 1280 px, ketiga fase sudah dicoba lewat lembar Pengaturan, pratinjau link halaman Blogger di WhatsApp menampilkan gambar dan judul.

### Fase 4: Panel admin untuk pendaftaran

- Bagian panel admin untuk Fase 4 sesuai tabel pembagian di Bagian 13, `Admin.gs`, Log_Admin, menu ganti kata sandi admin dan buka kunci login.

Selesai bila: skenario U20 sampai U25 lolos, lalu checklist tayang (Bagian 20) dijalankan untuk **Rilis 1**.

### Fase 5: Konten Rilis 2

- Bagian 5 sampai 11 halaman utama, panel "Lihat selengkapnya", filter prestasi, pilihan cabang untuk tombol ajakan.
- Penyembunyian otomatis bagian kosong dan mode pratinjau data contoh.

Selesai bila: dengan data contoh dimatikan hanya data asli yang tampil dan bagian kosong tersembunyi; dengan data contoh dinyalakan, label "Contoh" dan pita pratinjau muncul.

### Fase 6: Presensi dan feedback (fitur hari H, bagian 1)

- Bagian 11, `Presensi.gs`, lembar Presensi, kunci Pengaturan untuk hari H.
- Fase `hari_h` dan `selesai` di tombol floating (tombol "Ajukan Pertanyaan" tampil redup "Belum dibuka" sampai Fase 7).
- Bagian panel admin untuk Fase 6 sesuai tabel di Bagian 13.

Selesai bila: skenario U9 sampai U12 lolos.

### Fase 7: Pertanyaan dan moderator (fitur hari H, bagian 2)

- Bagian 12, `Pertanyaan.gs`, lembar Pertanyaan, bagian panel admin untuk Fase 7, `MODERATOR_PASSWORD` dan menu ganti kata sandi moderator.

Selesai bila: skenario U13 sampai U16 dan U26 lolos.

### Fase 8: Uji menyeluruh dan gladi bersih

- Seluruh skenario Bagian 19, termasuk uji beban U17.
- Checklist tayang untuk **Rilis 3**.
- `docs/panduan-panitia.md`: cara memakai panel admin, mengisi konten, menu Genio, panduan hari H.

### Prompt siap pakai

Fase 1, pilih salah satu:

> Baca PRD.md dan docs/Rancangan_Form_Webinar.pdf. Kerjakan Fase 1 saja. Isi spreadsheet Konten Website dengan data contoh untuk semua bagian. Pandu saya langkah manualnya satu per satu. Setelah selesai, jalankan pengecekan "Selesai bila" dan laporkan.

> Baca PRD.md dan docs/Rancangan_Form_Webinar.pdf. Kerjakan Fase 1 saja. Gunakan data asli dari assets-raw/, folder Gambar Web, dan spreadsheet Konten Website yang sudah saya isi; buat data contoh hanya untuk bagian yang masih kosong. Pandu saya langkah manualnya satu per satu. Setelah selesai, jalankan pengecekan "Selesai bila" dan laporkan.

Fase berikutnya:

> Lanjutkan Fase [N] sesuai PRD.md. Sebelum menulis kode, jelaskan rencanamu singkat. Setelah selesai, jalankan pengecekan "Selesai bila" dan laporkan hal yang perlu saya lakukan manual.

---

## 19. Skenario uji

| No | Skenario | Hasil yang diharapkan |
|---|---|---|
| U1 | Siswa kelas 3 mendaftar sendiri, bidang IPA | 1 baris, Siswa SD, room SD IPA |
| U2 | Orang tua mendaftarkan 3 anak, satu tanpa WA | 4 baris, ID Pendaftaran sama, anak tanpa WA memakai `wa_kunci` orang tua |
| U3 | Orang tua tidak mendaftarkan anak | Bagian 6 muncul, 1 baris dengan data minat |
| U4 | Guru mendaftarkan 12 siswa | 13 baris, asal sekolah terisi otomatis, persetujuan poin 4 wajib |
| U5 | Nomor +62 812-3456-7890, 0812 3456 7890, 6281234567890 | Ketiganya tersimpan 6281234567890 |
| U6 | Siswa yang sama mendaftar dua kali | "Peserta ini sudah terdaftar", tanpa baris baru |
| U7 | Pendamping terdaftar kembali menambah 1 siswa | Hanya siswa baru tersimpan, tersambung ke ID lama |
| U8 | Kirim setelah pendaftaran ditutup lewat panel admin, tanpa memuat ulang halaman pengunjung | Server menolak dengan pesan tutup |
| U9 | Presensi sebelum dibuka | Pesan "belum dibuka", tanpa isian |
| U10 | Presensi dua kali dengan nama dan nomor sama | Kiriman kedua ditolak |
| U11 | Presensi dengan nama sedikit berbeda | Peringatan lunak; "Tetap kirim" tersimpan sebagai tidak ditemukan |
| U12 | Siswa SMP presensi | Bagian 2A muncul, 2B tidak |
| U13 | Kirim pertanyaan saat tutup | Ditolak |
| U14 | Form pertanyaan TERJADWAL, jam buka tiba | Tombol aktif dalam 30 detik tanpa memuat ulang |
| U15 | Pertanyaan baru masuk saat tab Pertanyaan terbuka | Muncul di atas dalam 5 detik |
| U16 | Dua moderator menandai pertanyaan yang sama | Status konsisten di kedua layar |
| U17 | 30 kiriman pendaftaran bersamaan (skrip uji) | Semua tersimpan, tanpa ID dobel |
| U18 | Buka halaman Blogger dari WhatsApp dan Instagram | Tampilan, tombol floating, dan form berjalan normal |
| U19 | Jaringan lambat (simulasi 3G) | Pesan muat tampil, form tetap bisa dipakai |
| U20 | Kata sandi salah | Tidak masuk, tercatat di Log_Admin, penundaan terasa |
| U21 | 20 kali salah dalam 15 menit | Login terkunci; menu "Buka kunci login" membukanya |
| U22 | Admin mengubah tanggal tutup pendaftaran | Lembar Pengaturan berubah, hitung mundur pengunjung ikut berubah, Log_Admin mencatat nilai lama dan baru |
| U23 | Jam tutup diisi sebelum jam buka | Ditolak dengan pesan jelas |
| U24 | Unduh semua data dan daftar prospek, di laptop dan ponsel | File .xlsx terbuka di Excel, nomor WA utuh, data uji tidak ikut |
| U25 | Cari peserta lewat nomor dengan format 0812... | Ditemukan meski tersimpan 628... |
| U26 | Masuk dengan kata sandi moderator, lalu memanggil fungsi data pendaftar lewat konsol browser | Ditolak server |
| U27 | Memilih Pendamping dan mengisi data guru, lalu kembali dan mengganti menjadi Siswa | Isian guru dan siswa binaan tidak ikut terkirim; tersimpan 1 baris siswa |
| U28 | Tombol kirim diketuk dua kali dengan cepat | Hanya satu set baris tersimpan |
| U29 | Koneksi diputus saat mengirim, lalu "Coba kirim lagi" | Isian masih ada; hanya satu set baris tersimpan dan halaman konfirmasi tampil normal |
| U30 | Kembali ke langkah sebelumnya lalu maju lagi, dan memuat ulang halaman di tengah form | Isian tetap ada (memuat ulang: bila browser mengizinkan penyimpanan) |

---

## 20. Checklist tayang

Jalankan sebelum Rilis 1 dan ulangi sebelum Rilis 3.

- [ ] Menu "Hapus data uji" sudah dijalankan; mode uji mati; penomoran mulai dari MJ-0001.
- [ ] Tampilkan data contoh mati dan tidak ada baris contoh yang tampil.
- [ ] Link grup WA terisi dan sudah dicoba.
- [ ] Tanggal dan status form di tab Pengaturan benar.
- [ ] Kata sandi admin (dan moderator untuk Rilis 3) sudah diganti dari nilai awal.
- [ ] Halaman Blogger dipublikasikan; s.id/geniojuara1 diarahkan ke halaman itu.
- [ ] Link dikirim ke chat WhatsApp sendiri dan pratinjaunya tampil dengan gambar.
- [ ] Deployment yang dipakai iframe adalah versi terbaru (URL `/exec` sama seperti di `docs/catatan-deploy.md`).
- [ ] Akses spreadsheet dan folder sudah dicek: hanya Gambar Web yang dibagikan lewat link. Database Webinar **wajib** Dibatasi (per 20 Oktober masih Pelihat lewat link).
- [ ] Panitia sudah membaca `docs/panduan-panitia.md`.
