# Catatan deploy

## Data deployment (isi setelah langkah 6)

| Hal | Nilai |
|---|---|
| Script ID | |
| ID deployment | |
| URL web app `/exec` | |
| URL halaman Blogger | |
| Banner Google di atas halaman | (ada / tidak ada, dicek di langkah 8) |

ID spreadsheet, ID folder, dan kata sandi **tidak** dicatat di sini. Semuanya tersimpan di Script Properties.

## Langkah pertama kali (Fase 1)

Susunan yang dipakai: satu folder berisi folder `Gambar Web`, spreadsheet `Database Webinar`, spreadsheet `Konten Website`, dan proyek Apps Script terpisah. Kode dikirim dengan salin-tempel dari browser (bisa dari iPad). Bila kelak memakai laptop, `clasp` tetap bisa dipakai dengan ID Skrip proyek ini.

### 1. Atur izin berbagi di Google Drive

Hanya `Gambar Web` yang boleh dibuka siapa saja. Yang lain dibatasi.

1. Folder induk: Bagikan > Akses umum > **Dibatasi**.
2. `Database Webinar`, `Konten Website`, dan proyek Apps Script: periksa satu per satu, Akses umum harus **Dibatasi**. `Konten Website` boleh dibagikan sebagai editor ke email tim Marketing.
3. Folder `Gambar Web`: Akses umum > **Siapa saja yang memiliki link**, peran **Pelihat**.

Web app tetap bisa membaca kedua spreadsheet walau dibatasi, karena berjalan dengan akun pemilik.

> **Status 20 Oktober 2026:** atas keputusan pemilik, folder induk dan seluruh isinya (termasuk Database Webinar) masih "Siapa saja yang memiliki link: Pelihat". Selama berisi data uji, risikonya kecil. **Sebelum Rilis 1 (data peserta asli mulai masuk), Database Webinar wajib diubah menjadi Dibatasi** (lihat checklist tayang PRD Bagian 20).

### 2. Tempel kode ke proyek Apps Script

1. Buka proyek Apps Script. Di iPad, ketuk **aA** di bilah alamat Safari, lalu **Minta Situs Web Desktop**.
2. Setelan project (ikon roda): centang **Tampilkan file manifes "appsscript.json" di editor**.
3. Untuk tiap file di folder `gas/` pada GitHub: buka file, ketuk ikon **Salin** (Copy raw file), lalu tempel ke file bernama sama di editor dan simpan. Buat file yang belum ada lewat **+** di samping "File", ketik nama **tanpa** akhiran.

| File di GitHub | Nama di editor | Jenis |
|---|---|---|
| `appsscript.json` | `appsscript.json` (timpa isinya) | manifes |
| `Code.gs` | `Code` (timpa isi bawaan) | Skrip |
| `Config.gs`, `Util.gs`, `Konten.gs`, `Setup.gs`, `DataContoh.gs` | `Config`, `Util`, `Konten`, `Setup`, `DataContoh` | Skrip |
| `Index.html`, `Css.html`, `JsApp.html` | `Index`, `Css`, `JsApp` | HTML |

### 3. Isi Script Properties

Setelan project > **Properti skrip** > Tambahkan properti skrip. Nilainya boleh ID atau URL lengkap.

| Properti | Nilai |
|---|---|
| `DB_SHEET_ID` | URL spreadsheet Database Webinar |
| `KONTEN_SHEET_ID` | URL spreadsheet Konten Website |
| `GAMBAR_FOLDER_ID` | URL folder Gambar Web |

Tambahkan juga `ADMIN_PASSWORD`: kata sandi panel admin, minimal 12 karakter, hanya dibagikan ke panitia yang perlu. Untuk menggantinya, ubah nilai properti ini (sesi yang sedang masuk tetap berlaku sampai 6 jam atau sampai Keluar).

### 4. Jalankan siapkanLembar

1. Di editor, buka file `Setup`. Di bilah atas, pilih fungsi **siapkanLembar**, lalu ketuk **Jalankan**.
2. Pertama kali, Google meminta izin. Pilih akun pemilik, lalu **Lanjutan > Buka MenujuJuara#1 (tidak aman)** > **Izinkan**. Peringatan ini muncul karena skrip buatan sendiri belum diverifikasi Google.
3. Log eksekusi di bawah menampilkan "Lembar siap". Bila muncul pesan Script Properties belum diisi, periksa langkah 3.

Hasilnya: lembar Pendaftar, Pengaturan, Rekap, dan Log_Admin di Database, serta lembar konten di Konten Website. Fungsi ini aman dijalankan berulang kali karena tidak menghapus data.

### 5. Jalankan isiDataContoh

Pilih fungsi **isiDataContoh**, lalu **Jalankan**. Lembar yang sudah berisi tidak disentuh.

- Agenda dan narasumber (Indro) diambil dari poster dan ditandai data asli.
- Tutor, profil Genio, cabang, prestasi, testimoni, dan FAQ masih contoh (`data_contoh` = YA).
- `tampilkan_data_contoh` diubah menjadi YA supaya contoh terlihat saat pratinjau. **Wajib** diubah menjadi TIDAK sebelum tayang.

### 5b. Fase 5: konten tambahan

1. Tempel ulang semua file yang berubah, termasuk file baru `AdminKonten.gs`.
2. Jalankan **siapkanLembar** lagi: menambah lembar `Prestasi_Tutor`, kolom `prestasi` di Prestasi, kolom `jam` di Testimoni, dan dropdown jenis medali. Data lama tidak diubah.
3. Jalankan **isiKontenFase5**: mengisi teks profil Genio yang disepakati, 5 testimoni contoh, dan contoh prestasi tutor. Data asli yang sudah ada tidak ditimpa.
4. Impor data prestasi asli: buka `Prestasi-Genio-2024-2026.xlsx` (dikirim terpisah, tidak disimpan di repo), salin semua baris di bawah judul, lalu tempel di lembar Prestasi mulai baris 2 setelah menghapus baris contoh. Urutan kolom berkas sama dengan lembar.
5. Unggah foto tutor (PNG potongan tanpa latar) ke folder Gambar Web, lalu pilih fotonya di panel admin tab **Tutor** atau tulis nama filenya di kolom `foto`.
6. Untuk melihat testimoni dan tutor contoh, ubah `tampilkan_data_contoh` menjadi YA (panel admin, tab Pengaturan). **Wajib** TIDAK lagi sebelum tayang; tanpa data asli, bagian Testimoni otomatis tersembunyi.

### 6. Deploy web app

1. Di editor, ketuk **Terapkan > Deployment baru**.
2. Pilih jenis **Aplikasi web**. Deskripsi: `Rilis 1`. Jalankan sebagai: **Saya**. Yang memiliki akses: **Siapa saja**.
3. Ketuk **Terapkan**, lalu salin URL yang berakhiran `/exec` dan ID deployment ke tabel di atas.

### 7. Buat halaman Blogger percobaan

> Atas permintaan pemilik, langkah ini dikerjakan paling akhir (setelah halaman utama jadi). Selama itu, pengujian memakai URL `/exec` langsung.

1. Di Blogger, buka **Halaman > Halaman baru** (bukan Postingan).
2. Pindah ke **Tampilan HTML**, tempel isi `docs/embed-blogger.html`.
3. Ganti `ID_DEPLOYMENT` di dua tempat dengan URL `/exec` dari langkah 6. Gambar pratinjau boleh menyusul.
4. Simpan sebagai draf, lalu ketuk **Pratinjau**.

### 8. Pengecekan "Selesai bila"

- [ ] Halaman uji tampil di URL `/exec`.
- [ ] Halaman uji tampil di halaman Blogger percobaan.
- [ ] Di ponsel, tombol di bawah layar tetap melayang saat halaman digulir sampai bawah (di `/exec` dan di Blogger).
- [ ] Tombol **Uji WhatsApp narahubung** membuka WhatsApp, dan **Uji Instagram** membuka Instagram.
- [ ] **Cek ulang ke server** menampilkan "Berhasil diperbarui".
- [ ] Ubah `form_pendaftaran` di lembar Pengaturan menjadi `TUTUP`, tunggu 20 detik, lalu muat ulang. Tombol berubah menjadi "Pendaftaran Ditutup". Kembalikan ke `OTOMATIS`.
- [ ] Ada atau tidaknya banner Google di atas halaman dicatat di tabel atas. Banner ini dari Google untuk akun Gmail biasa dan tidak bisa dihapus lewat kode.
- [ ] Fungsi panitia berjalan dari editor (`siapkanLembar`, `isiDataContoh`). Pengganti menu "Genio" di PRD 6.4.

## Panel admin

Ketuk ikon centang di header (atau buka alamat `/exec?admin=1`), lalu masukkan kata sandi `ADMIN_PASSWORD`. Tab: Ringkasan, Pengaturan, Pendaftar (tabel yang bisa digeser, diurutkan, dan dibagi per halaman), Tutor (nama, jabatan, foto dari folder Gambar Web, ringkasan, prestasi siswa binaan), Prestasi (tambah, ubah, hapus, atur urutan; disimpan sekaligus), dan Lihat data (spreadsheet laporan plus unduh cadangan .xlsx). Setiap perubahan pengaturan, login gagal, pembaruan laporan, dan unduhan dicatat di lembar Log_Admin.

**Spreadsheet laporan (sekali saja):** jalankan `siapkanLaporan` dari editor. Fungsi ini membuat file "Laporan Pendaftar #MenujuJuara Eps. 1" di Drive Saya (boleh dipindah sendiri ke folder proyek; tautannya tidak berubah), mengisinya, dan memasang pembaruan otomatis tiap 10 menit (Google meminta izin sekali). Bagikan file laporan dengan akses Pelihat ke akun panitia yang perlu melihatnya. Isi laporan ditimpa skrip, jadi jangan mengedit datanya; urutkan dan saring lewat ikon filter di judul kolom.

Bila unduhan Excel tidak muncul (browser bawaan aplikasi kadang memblokir unduhan di dalam iframe), buka alamat `/exec` langsung di Chrome lalu unduh lagi.

## Fungsi panitia (pengganti menu "Genio")

Jalankan dari editor Apps Script: pilih nama fungsi, lalu **Jalankan**. Hasilnya tampil di log eksekusi.

| Fungsi | Kegunaan |
|---|---|
| `siapkanLembar` | Membuat lembar dan kolom yang belum ada tanpa menghapus data |
| `isiDataContoh` | Mengisi Konten Website dengan data contoh (lembar kosong saja) |
| `perbaruiDaftarGambar` | Memindai folder Gambar Web dan mengisi lembar Gambar |
| `hapusDataUji` | Menghapus semua baris `uji` = YA di lembar Pendaftar, langsung tanpa konfirmasi |
| `bukaKunciLogin` | Membuka kunci panel admin setelah 20 kali salah kata sandi dalam 15 menit |
| `perbaruiRekap` | Menghitung ulang lembar Rekap dari lembar Pendaftar |
| `bersihkanCache` | Memaksa halaman memakai data terbaru |
| `siapkanLaporan` | Membuat atau menata ulang spreadsheet laporan dan memasang pembaruan otomatis tiap 10 menit |

## Memperbarui web app (setiap ada perubahan kode)

URL `/exec` harus tetap sama, jadi **perbarui deployment yang sama**, jangan membuat deployment baru.

1. Tempel ulang file yang berubah (atau `clasp push` bila memakai laptop).
2. Di editor Apps Script: **Terapkan > Kelola deployment**, klik ikon pensil pada deployment `Rilis 1`, pilih **Versi: Versi baru**, lalu **Terapkan**.

Cara lewat terminal (cek dulu versi dengan `clasp --version`):

```bash
clasp deploy --deploymentId ID_DEPLOYMENT --description "pesan singkat"   # clasp 3
clasp deploy -i ID_DEPLOYMENT -d "pesan singkat"                         # clasp 2
```

URL `/dev` hanya untuk pemilik dan tidak dipakai untuk publik.
