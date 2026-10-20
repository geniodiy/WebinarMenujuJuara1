# Catatan deploy

## Data deployment (isi setelah langkah 9)

| Hal | Nilai |
|---|---|
| Script ID | |
| ID deployment | |
| URL web app `/exec` | |
| URL halaman Blogger | |
| Banner Google di atas halaman | (ada / tidak ada, dicek di langkah 11) |

ID spreadsheet, ID folder, dan kata sandi **tidak** dicatat di sini. Semuanya tersimpan di Script Properties.

## Langkah pertama kali (Fase 1)

### 1. Siapkan Google Drive

1. Buat folder `Genio - MenujuJuara Eps1`. Folder ini **jangan** dibagikan.
2. Di dalamnya buat:
   - folder `Gambar Web`, lalu bagikan dengan setelan "Siapa saja yang memiliki link: Pelihat". Hanya folder ini yang dibagikan.
   - Google Sheets kosong bernama `Database Webinar`.
   - Google Sheets kosong bernama `Konten Website`. Boleh dibagikan sebagai editor ke tim Marketing.
3. Masukkan foto ke `Gambar Web` bila sudah ada (misalnya `indro.jpg`). Bisa menyusul.

### 2. Buat proyek Apps Script di Database Webinar

1. Buka `Database Webinar`, pilih menu **Ekstensi > Apps Script**.
2. Ganti nama proyek menjadi `Genio MenujuJuara Eps1`.
3. Klik ikon roda (**Setelan project**), salin **ID Skrip**.

Proyek sengaja diikat ke `Database Webinar`, bukan ke `Konten Website`. Alasannya: menu spreadsheet hanya bisa dibuat oleh skrip yang terikat, dan siapa pun yang bisa mengedit spreadsheet induknya bisa membuka Script Properties (termasuk kata sandi admin). Database hanya untuk tim Ticketing, jadi lebih aman.

Akibatnya menu **Genio** hanya muncul di `Database Webinar`. Perubahan di `Konten Website` tetap tampil sendiri paling lambat 5 menit, dan foto baru di `Gambar Web` terdaftar otomatis begitu namanya dipakai di lembar konten.

### 3. Aktifkan Apps Script API

Buka https://script.google.com/home/usersettings lalu nyalakan **Google Apps Script API**.

### 4. Pasang clasp dan login

```bash
npm i -g @google/clasp
clasp login
```

### 5. Kirim kode

Dari root repo:

```bash
cp .clasp.json.example .clasp.json   # lalu isi scriptId dengan ID Skrip dari langkah 2
clasp push
```

Bila ditanya apakah manifest akan ditimpa, jawab ya.

### 6. Siapkan lembar

1. Muat ulang `Database Webinar`. Menu **Genio** muncul di bilah menu setelah beberapa detik.
2. Pilih **Genio > Siapkan lembar**.
3. Google meminta izin. Karena skrip ini milik Anda sendiri, pilih **Lanjutan > Buka Genio MenujuJuara Eps1 (tidak aman)**, lalu **Izinkan**.
4. Jalankan **Genio > Siapkan lembar** sekali lagi bila menu tadi berhenti setelah pemberian izin.
5. Tempel URL `Konten Website` lalu URL folder `Gambar Web` saat diminta.

Hasilnya: lembar Pendaftar, Pengaturan, Rekap, dan Log_Admin di Database, serta lembar konten di Konten Website. Menu ini aman dijalankan berulang kali karena tidak menghapus data yang sudah ada.

### 7. Isi data contoh

Pilih **Genio > Isi data contoh (Konten Website)**. Lembar yang sudah berisi tidak disentuh.

- Agenda dan narasumber (Indro) diambil dari poster dan ditandai data asli.
- Tutor, profil Genio, cabang, prestasi, testimoni, dan FAQ masih contoh (`data_contoh` = YA).
- `tampilkan_data_contoh` diubah menjadi YA supaya contoh terlihat saat pratinjau. **Wajib** diubah menjadi TIDAK sebelum tayang.

### 8. Perbarui daftar gambar (bila sudah ada foto)

Pilih **Genio > Perbarui daftar gambar**. Lembar `Gambar` di Konten Website terisi nama dan ID tiap foto.

### 9. Deploy web app

1. Di editor Apps Script, klik **Terapkan > Deployment baru**.
2. Pilih jenis **Aplikasi web**.
3. Deskripsi: `Rilis 1`. Jalankan sebagai: **Saya**. Yang memiliki akses: **Siapa saja**.
4. Klik **Terapkan**, lalu salin URL yang berakhiran `/exec` dan ID deployment ke tabel di atas.

### 10. Buat halaman Blogger percobaan

1. Di Blogger, buka **Halaman > Halaman baru** (bukan Postingan).
2. Pindah ke **Tampilan HTML**, tempel isi `docs/embed-blogger.html`.
3. Ganti `ID_DEPLOYMENT` di dua tempat dengan URL `/exec` dari langkah 9. Gambar pratinjau boleh menyusul.
4. Simpan sebagai draf, lalu klik **Pratinjau**.

### 11. Pengecekan "Selesai bila"

- [ ] Halaman uji tampil di URL `/exec`.
- [ ] Halaman uji tampil di halaman Blogger percobaan.
- [ ] Di ponsel, tombol di bawah layar tetap melayang saat halaman digulir sampai bawah (di `/exec` dan di Blogger).
- [ ] Tombol **Uji WhatsApp narahubung** membuka WhatsApp, dan **Uji Instagram** membuka Instagram.
- [ ] **Cek ulang ke server** menampilkan "Berhasil diperbarui".
- [ ] Ubah `form_pendaftaran` di lembar Pengaturan menjadi `TUTUP`, tunggu 20 detik, lalu muat ulang. Tombol berubah menjadi "Pendaftaran Ditutup". Kembalikan ke `OTOMATIS`.
- [ ] Ada atau tidaknya banner Google di atas halaman dicatat di tabel atas. Banner ini dari Google untuk akun Gmail biasa dan tidak bisa dihapus lewat kode.
- [ ] Menu **Genio** muncul di `Database Webinar`. (Di `Konten Website` memang tidak ada menu, lihat langkah 2.)

## Memperbarui web app (setiap ada perubahan kode)

URL `/exec` harus tetap sama, jadi **perbarui deployment yang sama**, jangan membuat deployment baru.

1. `clasp push`
2. Di editor Apps Script: **Terapkan > Kelola deployment**, klik ikon pensil pada deployment `Rilis 1`, pilih **Versi: Versi baru**, lalu **Terapkan**.

Cara lewat terminal (cek dulu versi dengan `clasp --version`):

```bash
clasp deploy --deploymentId ID_DEPLOYMENT --description "pesan singkat"   # clasp 3
clasp deploy -i ID_DEPLOYMENT -d "pesan singkat"                         # clasp 2
```

URL `/dev` hanya untuk pemilik dan tidak dipakai untuk publik.
