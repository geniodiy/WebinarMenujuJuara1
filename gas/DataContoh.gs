/**
 * Isi awal spreadsheet Konten Website untuk menu "Isi data contoh".
 * Agenda dan narasumber diambil dari poster (data asli, data_contoh = TIDAK).
 * Selebihnya contoh (data_contoh = YA) dan wajib diganti atau disembunyikan sebelum tayang.
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
      jabatan: 'Manajer Genio Institute', room: '', foto: 'indro.jpg',
      ringkasan: 'Pembimbing siswa peraih Gold Medal & Best Overall SMP OSN Matematika 2026.',
      prestasi_binaan: 'Gold Medal & Best Overall SMP OSN Matematika 2026' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 1', jabatan: 'Tutor Matematika SD',
      room: 'SD Matematika', foto: 'tutor-01-contoh.jpg', ringkasan: 'Membimbing siswa SD menghadapi soal penalaran matematika.',
      prestasi_binaan: 'Medali Perak OSN Matematika SD 2025 (contoh)\nMedali Perunggu OSN Matematika SD 2024 (contoh)' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 2', jabatan: 'Tutor IPA SD',
      room: 'SD IPA', foto: 'tutor-02-contoh.jpg', ringkasan: 'Mengajak siswa SD memahami sains lewat percobaan sederhana.',
      prestasi_binaan: 'Medali Emas OSN IPA SD 2025 (contoh)\nMedali Perak OSN IPA SD 2024 (contoh)' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 3', jabatan: 'Tutor IPS SD',
      room: 'SD IPS', foto: 'tutor-03-contoh.jpg', ringkasan: 'Melatih siswa SD membaca peta, data, dan peristiwa sosial.',
      prestasi_binaan: 'Medali Perunggu OSN IPS SD 2025 (contoh)' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 4', jabatan: 'Tutor Matematika SMP',
      room: 'SMP Matematika', foto: 'tutor-04-contoh.jpg', ringkasan: 'Fokus pada teori bilangan dan kombinatorika tingkat SMP.',
      prestasi_binaan: 'Medali Emas OSN Matematika SMP 2025 (contoh)\nMedali Perak OSN Matematika SMP 2024 (contoh)' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 5', jabatan: 'Tutor IPA SMP',
      room: 'SMP IPA', foto: 'tutor-05-contoh.jpg', ringkasan: 'Membahas fisika, kimia, dan biologi dasar untuk OSN SMP.',
      prestasi_binaan: 'Medali Perak OSN IPA SMP 2025 (contoh)' },
    { urutan: 7, tampil: 'YA', data_contoh: 'YA', peran: 'Tutor', nama_lengkap: 'Tutor Contoh 6', jabatan: 'Tutor IPS SMP',
      room: 'SMP IPS', foto: 'tutor-06-contoh.jpg', ringkasan: 'Melatih analisis ekonomi, geografi, dan sejarah untuk OSN SMP.',
      prestasi_binaan: 'Medali Perunggu OSN IPS SMP 2025 (contoh)\nFinalis OSN IPS SMP 2024 (contoh)' }
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
      bidang: 'Matematika', lomba: 'OSN', tingkat: 'Nasional', medali: 'Emas', sorotan: 'YA' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', tahun: '2026', nama_siswa: 'Siswa Contoh B', sekolah: 'SD Contoh 2', jenjang: 'SD',
      bidang: 'IPA', lomba: 'OSN', tingkat: 'Provinsi', medali: 'Perak', sorotan: 'TIDAK' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', tahun: '2026', nama_siswa: 'Siswa Contoh C', sekolah: 'SMP Contoh 3', jenjang: 'SMP',
      bidang: 'IPS', lomba: 'OSN', tingkat: 'Kabupaten/Kota', medali: 'Perunggu', sorotan: 'TIDAK' },
    { urutan: 4, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh D', sekolah: 'SD Contoh 4', jenjang: 'SD',
      bidang: 'Matematika', lomba: 'OSN', tingkat: 'Nasional', medali: 'Perak', sorotan: 'TIDAK' },
    { urutan: 5, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh E', sekolah: 'SMP Contoh 5', jenjang: 'SMP',
      bidang: 'IPA', lomba: 'OSN', tingkat: 'Provinsi', medali: 'Emas', sorotan: 'TIDAK' },
    { urutan: 6, tampil: 'YA', data_contoh: 'YA', tahun: '2025', nama_siswa: 'Siswa Contoh F', sekolah: 'SD Contoh 6', jenjang: 'SD',
      bidang: 'IPS', lomba: 'OSN', tingkat: 'Kabupaten/Kota', medali: 'Harapan', sorotan: 'TIDAK' }
  ],

  Testimoni: [
    { urutan: 1, tampil: 'YA', data_contoh: 'YA', nama: 'Orang Tua Contoh 1', keterangan: 'Orang tua siswa SMP',
      kutipan: 'Anak saya jadi lebih percaya diri mengerjakan soal olimpiade. (contoh)', foto: '' },
    { urutan: 2, tampil: 'YA', data_contoh: 'YA', nama: 'Orang Tua Contoh 2', keterangan: 'Orang tua siswa SD',
      kutipan: 'Tutor sabar menjelaskan dan rutin memberi kabar perkembangan. (contoh)', foto: '' },
    { urutan: 3, tampil: 'YA', data_contoh: 'YA', nama: 'Orang Tua Contoh 3', keterangan: 'Orang tua siswa SMP',
      kutipan: 'Latihan soalnya terarah sehingga persiapan OSN lebih tenang. (contoh)', foto: '' }
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

var PROFIL_CONTOH_ = [
  ['data_contoh', 'YA', ''],
  ['judul', 'Apa itu Genio Institute?', ''],
  ['paragraf_1', 'Genio Institute adalah lembaga pendampingan olimpiade sains untuk siswa SD dan SMP. (contoh, ganti dengan profil asli)', ''],
  ['paragraf_2', 'Bersama tutor berpengalaman, Genio membantu siswa menyiapkan OSN secara terarah. (contoh)', ''],
  ['angka_1', '500+', ''], ['label_1', 'Siswa binaan (contoh)', ''],
  ['angka_2', '120+', ''], ['label_2', 'Medali olimpiade (contoh)', ''],
  ['angka_3', '2', ''], ['label_3', 'Cabang: Semarang dan Yogyakarta', ''],
  ['program', 'Kelas OSN Matematika, Kelas OSN IPA, Kelas OSN IPS, Try Out Olimpiade', '']
];
