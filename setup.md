# Proyek PAI - Vue 3 + Vite & Supabase

Proyek ini dibangun menggunakan Vite, Vue 3, TailwindCSS, dan Supabase. Panduan ini akan membantu Anda dalam melakukan inisialisasi dan pengaturan proyek di komputer lokal Anda.

## Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Instalasi Proyek](#instalasi-proyek)
3. [Setup Environment Variables (Koneksi Database)](#setup-environment-variables)
4. [Menjalankan Development Server](#menjalankan-development-server)

---

## 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (disarankan versi LTS terbaru)
- Package manager (npm bawaan Node.js, atau pnpm/yarn)

## 2. Instalasi Proyek
Masuk ke dalam folder proyek dan instal seluruh dependency (termasuk Vue, TailwindCSS, dan `@supabase/supabase-js`.

```bash
cd pai
npm install
```

## 3. Setup Environment Variables (Koneksi Database)
Proyek ini membutuhkan koneksi ke database Supabase.

1. Buat file baru bernama `.env` di root folder proyek (sejajar dengan `package.json`).
2. Minta kredensial Supabase (URL dan Anon Key) dari Lead Developer (atau buat project Supabase baru Anda sendiri di [supabase.com](https://supabase.com)).
3. Isi file `.env` dengan format berikut:

```env
VITE_SUPABASE_URL=isi_dengan_url_supabase_disini
VITE_SUPABASE_ANON_KEY=isi_dengan_anon_key_supabase_disini
```

> **Catatan**: File `.env` sudah dimasukkan ke dalam `.gitignore` sehingga aman dan tidak akan ter-commit ke repositori. Kami juga telah menyediakan file `.env.example` sebagai referensi variabel yang dibutuhkan.

## 4. Menjalankan Development Server
Setelah instalasi selesai dan environment variable telah di-set, Anda dapat menjalankan server lokal Vite.

```bash
npm run dev
```

Buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`) pada browser Anda untuk melihat aplikasi PAI.
