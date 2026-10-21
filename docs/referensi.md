# Referensi

| Berkas / tautan | Isi | Dipakai untuk |
|---|---|---|
| `PRD.md` | PRD v1.2, 20 Oktober 2026 | Acuan perilaku sistem dan tampilan |
| `docs/poster-asli.jpg` | Poster resmi webinar | Isi acara, hierarki visual, gaya kartu dan strip info |
| `docs/Genio_Colour_Palette_Guide.jpg` | Palet warna Genio | Token warna (PRD 7.1) |
| `assets-raw/genio.png`, `osn.png`, `genio-jogja.png`, `genio-semarang.png` | Logo PNG transparan, tinggi 126 sampai 144 px | Header dan kartu cabang. Di bawah spesifikasi PRD 4.2 (minimal 200 px): cukup untuk header setinggi sekitar 40 px, bisa kurang tajam bila dibesarkan |
| `assets-raw/badge-terbuka.png` | Badge "Terbuka untuk Siswa SD, SMP, Guru & Orang tua" | Acuan saja. Di header dibuat sebagai teks dan ikon SVG agar tajam dan terbaca pembaca layar |
| `docs/Rancangan_Form_Webinar.pdf` | Rancangan form (8 halaman) | Acuan label, pilihan, dan teks bantuan form |
| https://go.okegas.app/webinar12 | Website webinar sejenis. Tangkapan layar: `docs/referensi-okegas-desktop.jpg`, `docs/referensi-okegas-mobile.png` | Pola halaman webinar satu halaman. PRD 10.1: form **tidak** meniru gaya chat dari referensi ini |

Catatan: situs go.okegas.app tidak bisa dibuka dari lingkungan pengembangan (diblokir jaringan), jadi acuannya hanya tangkapan layar.

## Yang diambil dari referensi okegas

- Satu kolom terpusat, logo di atas, kartu pembuka berisi badge acara, judul besar, kalimat pendukung, lalu gambar.
- Info acara sebagai baris kartu: ikon dalam kotak, label kecil di atas, nilai tebal di bawah.
- Bilah aksi melayang di bawah layar: info singkat di kiri (misalnya "Gratis", sisa waktu pendaftaran) dan tombol daftar di kanan. Ini bentuk tombol floating PRD Bagian 9.

Yang tidak diambil: latar gelap (halaman kita terang seperti poster, PRD 7.1), label huruf kapital semua (CLAUDE.md), harga coret dan "sisa kursi" palsu (kuota diatur panitia, K6).

## Palet warna

| Nama | Hex | Peran |
|---|---|---|
| Cyan Final | #1399D8 | Sorotan utama |
| Indigo Final | #2F377E | Kedalaman merek |
| Coral CTA | #FF8A5B | Tombol aksi (teks Indigo) |
| Gold Accent | #F2C14E | Medali, bonus |
| Teal Accent | #16C7B8 | Aksen pendukung |
| Item Color | #54563B | Teks isi dan judul |

## Keputusan atas perbedaan

| No | Hal | Poster | PRD | Usulan |
|---|---|---|---|---|
| R1 | Nomor narahubung Lily | 0878-3886-2882 | 0821-3313-1916 | **Diputuskan: ikut poster.** PRD sudah diperbarui |
| R2 | Nama sesi orang tua & guru | "Sharing Session" | "Ruang Sinergi" (K1), PDF juga | **Diputuskan: "Sharing Session".** PRD sudah diperbarui; teks PDF yang menyebut Ruang Sinergi diganti saat membuat form |
| R3 | Teks persetujuan | | PDF: "Genio Yogyakarta" | **Diputuskan: "Genio Institute"** (K2) |
| R4 | Gradien | Poster memakai gradien Cyan ke Teal | | **Diputuskan: dipakai di beberapa tempat seperti poster** (PRD 7.1) |
| R5 | Isian "Pertanyaan untuk Mas Indro" di langkah Penutup | | PRD Bagian 8 (`pertanyaan_narsum`) | **Diputuskan pemilik: dihapus dari form.** Kolom tetap ada di database dan terkirim kosong |

## Keputusan desain Fase 5 (disepakati pemilik, belum dipasang ke kode)

### Tutor kelas simulasi
Pratinjau: `docs/pratinjau/tutor-kartu.png`.

- Kartu bergaya poster tinggi, sudut membulat besar. Latar atas warna muda; blok gradien membulat di belakang bagian bawah foto potongan (PNG tanpa latar).
- Warna per bidang: Matematika oranye (coral ke gold), IPA cyan (cyan ke teal), IPS biru (indigo ke cyan). Gradien dipakai di blok foto, teks nama, dan tombol.
- Kiri atas: nama (besar, teks bergradien) dan jabatan, misalnya "Tutor Matematika SD". Kanan atas: hiasan panah "<<<". Label room tidak ditampilkan di kartu.
- Di bawah poster (diberi jarak 12 px kiri-kanan): judul kecil "Prestasi siswa binaan", daftar prestasi dengan ikon bulat sesuai jenis, garis putus-putus, lalu tombol kecil "Lihat selengkapnya" di tengah. Semua kartu sama tinggi.
- Slider: desktop 3 kartu sekaligus, ponsel 1 kartu dengan kartu berikutnya terlihat di tepi; panah bulat putih berbayang di kiri-kanan, memudar di ujung; titik penanda di bawah.
- Popup "Lihat selengkapnya" muncul di tengah layar: foto, nama, jabatan, room, ringkasan, daftar lengkap prestasi siswa binaan.
- Kartu menampilkan **paling banyak 3 prestasi** teratas (urutan di data); sisanya hanya tampil di popup "Lihat selengkapnya".

### Data dan edit tutor
Pratinjau: `docs/pratinjau/tutor-admin.png`.

- Jenis prestasi dan ikonnya: Emas (bulatan emas), Perak (bulatan perak), Perunggu (bulatan perunggu), Lainnya (bulatan hitam palet bergradien halus dengan bintang putih; untuk finalis, best theory, harapan, dan penghargaan lain).
- Lembar baru `Prestasi_Tutor` di Konten Website: urutan, nama_tutor, jenis (dropdown Emas/Perak/Perunggu/Lainnya), prestasi. Satu baris satu prestasi.
- Panel admin tab "Tutor": ubah nama, jabatan, foto (pilih dari file di folder Gambar Web), dan daftar prestasi (pilih jenis, teks, hapus, tambah). Data yang sama dengan spreadsheet. Unggah foto langsung dari web tidak disertakan karena butuh izin tulis Google Drive.

### Apa itu Genio Institute
Pratinjau: `docs/pratinjau/profil.png`.

- Kotak judul bergradien dominan biru (indigo ke biru, sedikit cyan di ujung) berisi judul dan kalimat inti "Lembaga pembinaan olimpiade SD, SMP, dan SMA sejak 2010 dengan semangat 'Semua siswa bisa menjadi juara'."
- Strip empat angka (angka berwarna indigo): 2010 Berdiri, 50+ Pembimbing, 100+ Sekolah mitra, 2 Cabang.
- Paragraf rata kanan-kiri: "Dengan metode GENIO Problem Solving, Genio mendampingi ratusan siswa menghadapi OSN/KSN, OMI, dan kompetisi lainnya. Genio hadir di dua cabang, Semarang dan Yogyakarta, dengan kelas yang bisa diikuti secara online maupun offline."
- Daftar program (TKA, International Curriculum, dan lain-lain) tidak ditampilkan dulu.

### Cabang Genio
Pratinjau: `docs/pratinjau/cabang.png`.

- Judul "Cabang Genio" dan subjudul "Datang langsung atau hubungi admin cabang terdekat."
- Dua kartu sebaris (Semarang dan Yogyakarta): logo cabang, alamat singkat, tiga ikon bulat bergaris satu warna (Google Maps, WhatsApp admin, Instagram). Ikon diberi label untuk pembaca layar.
- Data dari lembar Cabang (alamat, link_maps, wa_admin, instagram); kartu tanpa data disembunyikan.

### Prestasi siswa Genio
Pratinjau: `docs/pratinjau/prestasi.png`.

- Ringkasan jumlah medali (Emas, Perak, Perunggu). Tanpa filter bidang.
- Wadah setinggi sekitar 5 baris berisi paling banyak 10 prestasi (sorotan di atas, lalu tahun terbaru) yang bergulir pelan ke atas tanpa putus (sekitar 40 detik per putaran), berhenti saat disentuh atau disorot kursor, tepi atas-bawah memudar. Bila 5 data atau kurang, atau pengunjung memilih kurangi gerakan, daftar diam.
- Ikon jenis prestasi sama dengan tutor: Emas, Perak, Perunggu, Lainnya (hitam palet bergradien dengan bintang putih).
- Tombol kecil "Lihat selengkapnya" (gradien biru) membuka popup di tengah: pilihan tahun dibuat otomatis dari data (misalnya 2026, 2025, Semua), daftar lengkap tanpa batas, dikelompokkan per tahun bila "Semua".
- Data asli dari `Prestasi_Genio.pdf`, dibatasi 3 tahun terakhir (2024 sampai 2026): 42 baris (PDF tidak memuat prestasi 2024). Nama Moch Reza Azhar Habibie diseragamkan. Subjudul bagian: "Prestasi siswa binaan Genio dalam 3 tahun terakhir." disiapkan sebagai berkas impor untuk lembar Prestasi; berkas tidak disimpan di repo karena berisi nama siswa.
- Kolom lembar Prestasi: urutan, tampil, data_contoh, tahun, nama_siswa, sekolah, jenjang, bidang, lomba, tingkat, medali (Emas/Perak/Perunggu/Lainnya), sorotan, **prestasi** (teks lengkap seperti di sertifikat; kolom baru, ditambahkan ke daftar kolom saat Fase 5 dipasang).
- Urutan (kolom `urutan`): IMSO dulu, lalu OSN (termasuk KSN, nama OSN tahun 2020-2021), lalu lomba internasional lain, lalu lainnya; di dalam tiap kelompok tahun terbaru lalu Emas, Perak, Perunggu, Lainnya. Daftar bergulir mengambil 10 urutan teratas. Juara I/II/III dipetakan ke Emas/Perak/Perunggu; finalis, harapan, peringkat, honorable, dan best theory ke Lainnya.
- Admin dapat mengedit prestasi lewat panel admin (tab "Prestasi": tambah, ubah, hapus, atur urutan, pilih jenis medali, pilih tampil) maupun langsung di lembar Prestasi; keduanya memakai data yang sama dan tercatat di Log_Admin.

### Apa kata orang tua
Pratinjau: `docs/pratinjau/testimoni.png`.

- Tiap testimoni berbentuk jendela obrolan WhatsApp: kepala hijau tua (inisial, nama, keterangan), latar krem bertitik, kutipan dalam gelembung putih dengan jam (kolom opsional). Tanpa gelembung balasan.
- Kartu bergeser pelan ke kiri tanpa putus (sekitar 45 detik per putaran), berhenti saat disentuh atau disorot, tepi memudar; diam bila pengunjung memilih kurangi gerakan.

### Ajakan bergabung
Pratinjau: `docs/pratinjau/ajakan.png`.

- Kartu putih bergaris tipis: ikon chat bergradien oranye, judul `cta_judul` ("Tertarik bergabung dengan Genio?"), keterangan singkat ("Konsultasi gratis via WhatsApp dengan admin cabang.").
- Dua tombol hijau WhatsApp berdampingan, satu per cabang (Semarang, Yogyakarta), langsung membuka WhatsApp admin cabang (`wa_admin` di lembar Cabang) dengan pesan `cta_pesan_wa`. Cabang tanpa nomor tidak ditampilkan tombolnya.
