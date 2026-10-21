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
