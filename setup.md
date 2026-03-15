# Setup Mini LMS Web (PAI)

Dokumen ini berisi langkah-langkah setup awal agar project bisa dijalankan dengan lancar tanpa error terkait versi package atau library. Project ini dibangun menggunakan **Vue 3 (Composition API)**, **Vite**, **Tailwind CSS v4**, **Vue Router**, **Pinia** (State Management), dan **Supabase**.

---

## 1. Persiapan Awal
Pastikan di komputer sudah terinstal:
- **Node.js** (Disarankan versi LTS terbaru, minimal Node 20.x).
- Package manager seperti `npm` (sudah bawaan Node.js).

## 2. Kloning Repository
Buka terminal, lalu clone dan masuk ke direktori utama project:
```bash
git clone <URL_REPO>
cd pai
```

## 3. Instalasi Dependencies Wajib
Jalankan perintah berikut untuk menginstal seluruh dependency yang dibutuhkan:

```bash
npm install
```

> **Catatan:**
> Proses instalasi di atas sangat krusial karena akan menginstal library penting berikut:
> - `vue-router`: Untuk navigasi halaman (Siswa dan Admin).
> - `pinia`: Untuk manajemen state (menyimpan sementara data nilai kuis secara reaktif dan real-time menggunakan localStorage).
> - `@tailwindcss/vite`: Plugin wajib untuk mengintegrasikan Tailwind CSS v4 dengan Vite.
> - `@supabase/supabase-js`: Client untuk koneksi ke database.

## 4. Setup Environment Variables (Koneksi Supabase)
Project ini membutuhkan kredensial untuk terkoneksi ke database Supabase.
1. Di root folder (sejajar dengan `package.json`), **buat file baru** bernama `.env`.
2. Buka file `.env.example` sebagai referensi.
3. Salin isi format dari `.env.example` ke dalam `.env`.
4. Isi nilainya dengan kredensial Supabase URL dan Anon Key yang sesungguhnya (bisa diminta ke Lead/Penanggung jawab DB):
   ```env
   VITE_SUPABASE_URL=kunci_url_asli_disini
   VITE_SUPABASE_ANON_KEY=kunci_anon_key_asli_disini
   ```

*(File `.env` sudah masuk ke `.gitignore` sehingga dipastikan aman dan tidak akan ter-push ke GitHub).*

## 5. Sync Skema Database Supabase
Bagi yang bertugas mengatur database, silakan buka file `database_schema.sql` di root project. Salin seluruh teks SQL di dalamnya, lalu paste dan *Run* di **SQL Editor** pada menu dashboard [Supabase](https://supabase.com).

## 6. Menjalankan Development Server
Setelah instalasi dependency (langkah 3) dan environment variables (langkah 4) selesai, jalankan server lokal:

```bash
npm run dev
```

Buka URL yang muncul di terminal (contoh: `http://localhost:5173/`) pada browser. Aplikasi Mini LMS Web MVP Anda sudah berjalan.

> **Status MVP Saat Ini**
> Fungsionalitas pembuatan materi oleh Guru dan rekap nilai kuis dari Siswa saat ini disimulasikan menggunakan integrasi `Pinia + LocalStorage`. Data akan tersimpan di dalam cache memori browser secara otomatis. Pengunaan tabel asli Supabase via Fetch akan dilakukan pada tahap selanjutnya setelah UI & Flow MVP selesai dites.
