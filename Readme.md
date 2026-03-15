# 📚 Mini LMS Web (MVP)
Sebuah aplikasi web Learning Management System (LMS) sederhana, interaktif, dan responsif yang dibangun untuk memudahkan proses belajar mengajar. Sistem ini dirancang khusus agar siswa dapat mengakses materi dan latihan soal secara instan tanpa perlu mendaftar atau login. Pengelolaan materi, kuis, dan pencatatan kehadiran sepenuhnya dikendalikan oleh Guru (Admin).

## ✨ Fitur Utama

### 🧑🎓 Akses Siswa (Publik)
- **Tanpa Login**: Akses instan ke seluruh materi pembelajaran.
- **Materi Interaktif**: Mendukung teks bacaan dan embed video YouTube.
- **Kuis Mandiri**: Evaluasi pemahaman melalui 10 soal pilihan ganda interaktif di akhir materi dengan hasil real-time (animasi evaluasi tanpa menyimpan data ke database).
- **UI/UX Responsif**: Tampilan yang nyaman diakses melalui smartphone maupun desktop dan beranimasi.

### 👨🏫 Akses Guru (Admin)
- **Secure Login**: Autentikasi aman menggunakan Email dan Password.
- **Dashboard**: Ringkasan statistik jumlah materi dan kehadiran siswa.
- **Manajemen Materi & Kuis (CRUD)**: 
  - Membuat materi baru beserta link video (opsional).
  - Membuat 10 soal pilihan ganda sekaligus dalam satu form materi.
  - Mengedit dan menghapus materi beserta kuisnya.
- **Manajemen Kehadiran (Manual)**: Mencatat nama siswa yang hadir atau telah menyelesaikan materi secara manual ke dalam sistem.

## 🛠️ Tech Stack
- **Frontend Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: Vue Router
- **Backend, Auth & Database**: Supabase (PostgreSQL)
- **Hosting / Deployment**: Vercel

## 📂 Struktur Folder Utama
```text
src/
├── assets/             # File statis dan styling global (Tailwind)
├── components/         # Komponen UI yang dapat digunakan ulang (Navbar, Card, QuizEngine)
├── views/              # Halaman utama aplikasi
│   ├── public/         # Tampilan untuk Siswa (Home, MaterialDetail)
│   └── admin/          # Tampilan untuk Guru (Login, Dashboard, AddMaterial, Attendance)
├── router/             # Konfigurasi Vue Router & Navigation Guards
├── lib/                # Konfigurasi Supabase Client
├── App.vue
└── main.js
```
