/**
 * Skema Database Supabase untuk Mini LMS Web
 * 
 * Silakan copy paste SQL ini ke dalam fitur SQL Editor di Supabase.
 */

-- Tabel untuk Materi (Dibuat oleh Guru)
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Soal Kuis (Terkait dengan Materi tertentu)
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Kehadiran / Hasil Nilai Siswa
CREATE TABLE student_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Setel kebijakan Row Level Security (RLS) jika dibutuhkan nanti.
-- Untuk saat MVP (tahap fungsional tanpa rules khusus), Anda bisa matikan RLS 
-- di dashboard tabel Supabase, atau biarkan publik bisa baca/tulis sementara.
