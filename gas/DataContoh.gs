/**
 * Isi awal spreadsheet Konten Website untuk menu "Isi data contoh".
 * Agenda dan narasumber diambil dari poster (data asli, data_contoh = TIDAK).
 * Profil berisi teks yang disepakati pemilik. Selebihnya contoh (data_contoh = YA) dan wajib diganti
 * atau disembunyikan sebelum tayang.
 */

var DATA_CONTOH_ = {
  Agenda: [
    { urutan: 1, tampil: 'YA', data_contoh: 'TIDAK', judul: 'Pembahasan Roadmap dan Strategi OSN 2027',
      deskripsi: 'Memahami tahapan seleksi OSN 2027 dan strategi belajar efektif.', sasaran: 'Semua peserta', jam: '' },
    { urutan: 2, tampil: 'YA', data_contoh: 'TIDAK', judul: 'Simulasi Kelas Olimpiade',
      deskripsi: 'Belajar langsung bersama Tutor Genio pembimbing medalis olimpiade sesuai jenjang SD/SMP (Matematika, IPA & IPS).',
      sasaran: 'Siswa', jam: '' },
    { urutan: 3, tampil: 'YA', data_contoh: 'TIDAK', judul: 'Sharing Session',
      deskripsi: 'Diskusi dan tanya jawab seputar OSN serta cara mendampingi siswa.', sasaran: 'Orang Tua & Guru', jam: '' }
  ],

  Narasumber_Tutor: [
    { urutan: 1, tampil: 'YA', data_contoh: 'TIDAK', peran: 'Narasumber', nama_lengkap: 'Indro, S.Pd.',
      jabatan: 'Manajer Genio Institute', room: '', foto: 'indro.png',
      ringkasan: 'Pembimbing siswa peraih Gold Medal & Best Overall SMP OSN Matematika 2026.',
      prestasi_binaan: 'Gold Medal & Best Overall SMP OSN Matematika 2026' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 1', jabatan: 'Tutor Matematika SD',
      room: 'SD Matematika', foto: '', ringkasan: 'Membimbing siswa SD menghadapi soal penalaran matematika.',
      prestasi_binaan: '' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 2', jabatan: 'Tutor IPA SD',
      room: 'SD IPA', foto: '', ringkasan: 'Mengajak siswa SD memahami sains lewat percobaan sederhana.',
      prestasi_binaan: '' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 3', jabatan: 'Tutor IPS SD',
      room: 'SD IPS', foto: '', ringkasan: 'Melatih siswa SD membaca peta, data, dan peristiwa sosial.',
      prestasi_binaan: '' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 4', jabatan: 'Tutor Matematika SMP',
      room: 'SMP Matematika', foto: '', ringkasan: 'Fokus pada teori bilangan dan kombinatorika tingkat SMP.',
      prestasi_binaan: '' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 5', jabatan: 'Tutor IPA SMP',
      room: 'SMP IPA', foto: '', ringkasan: 'Membahas fisika, kimia, dan biologi dasar untuk OSN SMP.',
      prestasi_binaan: '' },
    { urutan: 7, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 6', jabatan: 'Tutor IPS SMP',
      room: 'SMP IPS', foto: '', ringkasan: 'Melatih analisis ekonomi, geografi, dan sejarah untuk OSN SMP.',
      prestasi_binaan: '' }
  ],

  // Satu baris satu prestasi; nama_tutor harus sama dengan nama_lengkap di Narasumber_Tutor.
  Prestasi_Tutor: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 1', jenis: 'Perak', prestasi: 'Medali Perak OSN Matematika SD 2025 (contoh)' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 1', jenis: 'Perunggu', prestasi: 'Medali Perunggu OSN Matematika SD 2024 (contoh)' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 1', jenis: 'Lainnya', prestasi: 'Finalis KSN Matematika SD 2024 (contoh)' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 1', jenis: 'Emas', prestasi: 'Medali Emas OSN Matematika Kabupaten 2023 (contoh)' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 2', jenis: 'Emas', prestasi: 'Medali Emas OSN IPA SD 2025 (contoh)' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 2', jenis: 'Perak', prestasi: 'Medali Perak OSN IPA SD 2024 (contoh)' },
    { urutan: 7, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 3', jenis: 'Perunggu', prestasi: 'Medali Perunggu OSN IPS SD 2025 (contoh)' },
    { urutan: 8, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 4', jenis: 'Emas', prestasi: 'Medali Emas OSN Matematika SMP 2025 (contoh)' },
    { urutan: 9, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 4', jenis: 'Perak', prestasi: 'Medali Perak OSN Matematika SMP 2024 (contoh)' },
    { urutan: 10, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 5', jenis: 'Perak', prestasi: 'Medali Perak OSN IPA SMP 2025 (contoh)' },
    { urutan: 11, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 6', jenis: 'Perunggu', prestasi: 'Medali Perunggu OSN IPS SMP 2025 (contoh)' },
    { urutan: 12, tampil: 'YA', data_contoh: 'YA', nama_tutor: 'Tutor Contoh 6', jenis: 'Lainnya', prestasi: 'Finalis OSN IPS SMP 2024 (contoh)' }
  ],

  Cabang: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', nama: 'Genio Institute Semarang', logo: 'genio-semarang.png',
      alamat: 'Alamat cabang Semarang (contoh, ganti dengan alamat asli)', link_maps: 'https://maps.google.com/',
      wa_admin: '6281200000001', instagram: 'genio_institute' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', nama: 'Genio Institute Yogyakarta', logo: 'genio-jogja.png',
      alamat: 'Alamat cabang Yogyakarta (contoh, ganti dengan alamat asli)', link_maps: 'https://maps.google.com/',
      wa_admin: '6281200000002', instagram: 'genio.diy' }
  ],

  Prestasi: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', tahun: '2026', nama_siswa: 'Siswa Contoh A', sekolah: 'SMP Contoh 1', jenjang: 'SMP',
      bidang: 'Matematika', lomba: 'OSN', tingkat: 'Nasional', medali: 'Emas', prestasi: 'Medali Emas OSN Matematika SMP 2026 (contoh)', sorotan: 'YA' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', tahun: '2026', nama_siswa: 'Siswa Contoh B', sekolah: 'SD Contoh 2', jenjang: 'SD',
      bidang: 'IPA', lomba: 'OSN', tingkat: 'Provinsi', medali: 'Perak', prestasi: 'Medali Perak OSN IPA SD 2026 (contoh)', sorotan: 'TIDAK' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', tahun: '2026', nama_siswa: 'Siswa Contoh C', sekolah: 'SMP Contoh 3', jenjang: 'SMP',
      bidang: 'IPS', lomba: 'OSN', tingkat: 'Kabupaten/Kota', medali: 'Perunggu', prestasi: 'Medali Perunggu OSN IPS SMP 2026 (contoh)', sorotan: 'TIDAK' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh D', sekolah: 'SD Contoh 4', jenjang: 'SD',
      bidang: 'Matematika', lomba: 'OSN', tingkat: 'Nasional', medali: 'Perak', prestasi: 'Medali Perak OSN Matematika SD 2025 (contoh)', sorotan: 'TIDAK' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh E', sekolah: 'SMP Contoh 5', jenjang: 'SMP',
      bidang: 'IPA', lomba: 'OSN', tingkat: 'Provinsi', medali: 'Emas', prestasi: 'Medali Emas OSN IPA SMP 2025 (contoh)', sorotan: 'TIDAK' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh F', sekolah: 'SD Contoh 6', jenjang: 'SD',
      bidang: 'IPS', lomba: 'OSN', tingkat: 'Kabupaten/Kota', medali: 'Lainnya', prestasi: 'Harapan OSN IPS SD 2025 (contoh)', sorotan: 'TIDAK' }
  ],

  Testimoni: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', nama: 'Ibu Contoh Rahma', keterangan: 'Orang tua siswa SMP', jam: '09.12', foto: '',
      kutipan: 'Anak saya jadi lebih percaya diri mengerjakan soal olimpiade. Terima kasih Genio! (contoh)' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', nama: 'Bapak Contoh Hadi', keterangan: 'Orang tua siswa SD', jam: '13.40', foto: '',
      kutipan: 'Tutornya sabar menjelaskan dan rutin memberi kabar perkembangan anak. (contoh)' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', nama: 'Ibu Contoh Sari', keterangan: 'Orang tua siswa SMP', jam: '19.05', foto: '',
      kutipan: 'Latihan soalnya terarah sehingga persiapan OSN lebih tenang. (contoh)' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', nama: 'Bapak Contoh Wibowo', keterangan: 'Orang tua siswa SD', jam: '20.21', foto: '',
      kutipan: 'Kelas online-nya enak diikuti dari rumah, anak tetap semangat belajar. (contoh)' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', nama: 'Ibu Contoh Lestari', keterangan: 'Orang tua siswa SMP', jam: '07.48', foto: '',
      kutipan: 'Pembahasan soalnya runtut, anak jadi paham cara berpikirnya, bukan hanya jawabannya. (contoh)' }
  ],

  FAQ: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Apakah webinar ini gratis?',
      jawaban: 'Ya, webinar ini gratis untuk siswa SD, SMP, orang tua, dan guru pembina.' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Kapan link Zoom dibagikan?',
      jawaban: 'Link Zoom dibagikan lewat grup WhatsApp peserta menjelang acara. Pastikan Anda bergabung ke grup setelah mendaftar.' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Apakah ada sertifikat?',
      jawaban: 'Informasi sertifikat akan diumumkan di grup WhatsApp peserta.' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Bolehkah dua anak memakai satu perangkat?',
      jawaban: 'Boleh untuk sesi utama. Namun satu perangkat hanya bisa berada di satu room kelas simulasi, jadi anak dengan jenjang atau bidang berbeda sebaiknya memakai perangkat sendiri.' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Apa syarat mendapatkan bonus Materi Kelas OSN?',
      jawaban: 'Isi presensi pada hari H. Link materi muncul setelah presensi terkirim.' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', pertanyaan: 'Bagaimana bila siswa tidak punya WhatsApp?',
      jawaban: 'Orang tua atau guru pembina bisa mendaftarkan siswa lewat pilihan Pendamping. Informasi akan dikirim ke nomor pendamping.' }
  ]
};

// Teks profil yang disepakati pemilik (docs/referensi.md), bukan contoh. Tanda **...** dicetak tebal di halaman.
var PROFIL_GENIO_ = [
  ['data_contoh', 'TIDAK', 'YA bila isi profil masih contoh'],
  ['judul', 'Apa itu Genio Institute?', ''],
  ['subjudul', 'Lembaga bimbingan olimpiade', 'Teks kecil di bawah judul; kosongkan untuk menyembunyikan'],
  ['paragraf_1', 'Lembaga pembinaan olimpiade SD, SMP, dan SMA sejak 2010 dengan semangat "Semua siswa bisa menjadi juara".', 'Kalimat inti di kotak judul'],
  ['paragraf_2', 'Dengan metode GENIO Problem Solving, Genio mendampingi ratusan siswa menghadapi OSN/KSN, OMI, dan kompetisi lainnya. Genio hadir di dua cabang, **Semarang** dan **Yogyakarta**, dengan kelas yang bisa diikuti secara **online maupun offline**.', 'Paragraf di bawah angka. **teks** dicetak tebal'],
  ['angka_1', '2010', ''], ['label_1', 'Berdiri', ''],
  ['angka_2', '50+', ''], ['label_2', 'Pembimbing', ''],
  ['angka_3', '10+', ''], ['label_3', 'Sekolah mitra', ''],
  ['angka_4', '2', ''], ['label_4', 'Cabang', '']
];
