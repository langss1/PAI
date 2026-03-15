<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const router = useRouter()
const store = useMainStore()

// Mengelola form materi baru
const materialForm = ref({
  title: '',
  content: '',
  videoUrl: ''
})

// Simulasi 10 soal untuk satu form materi
const questions = ref(
  Array.from({ length: 10 }).map((_, i) => ({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  }))
)

// Menangani klik Simpan Data
const submitData = () => {
  if (!materialForm.value.title) return alert("Judul materi wajib diisi!")
  
  // Masukkan materi ke global store
  store.addMaterial({
    id: Date.now().toString(),
    title: materialForm.value.title,
    content: materialForm.value.content || ' ',
    videoUrl: materialForm.value.videoUrl,
    questions: questions.value // Kuis juga dilempar, nanti diambil jika dimainkan
  })
  
  alert("Sukses! Materi dan ke-10 pertanyaan Kuis telah diterbitkan untuk siswa.")
  // Otomatis arahkan ke dashboard guru setelah dibuat.
  router.push('/admin/dashboard')
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
    <!-- Sidebar / Navigasi Admin -->
    <div class="w-full md:w-64 bg-slate-800 text-white rounded-lg p-6 flex-shrink-0 min-h-screen">
      <h2 class="text-xl font-bold mb-8">Admin Guru</h2>
      <ul class="space-y-4">
        <li><router-link to="/admin/dashboard" class="block hover:bg-slate-700 p-2 rounded">Dashboard & Materi</router-link></li>
        <li><router-link to="/admin/materi/tambah" class="block hover:bg-slate-700 p-2 rounded">Buat Materi & Kuis</router-link></li>
        <li><router-link to="/admin/kehadiran" class="block hover:bg-slate-700 p-2 rounded">Nilai & Kehadiran</router-link></li>
        <li class="mt-8 pt-4 border-t border-slate-600"><router-link to="/" class="block text-gray-300 hover:text-white">&larr; Keluar ke Siswa</router-link></li>
      </ul>
    </div>

    <!-- Form Konten Utama -->
    <div class="flex-grow bg-white p-8 rounded-lg shadow min-h-[500px]">
      <h1 class="text-3xl font-bold mb-6">Buat Materi Pembelajaran Baru</h1>
      
      <!-- Bagian Konten Materi -->
      <section class="mb-8 border p-6 rounded-lg bg-slate-50">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">Topik & Teori</h2>
        <div class="mb-4">
          <label class="block font-medium mb-1">Judul Materi Pembelajaran</label>
          <input v-model="materialForm.title" type="text" placeholder="Contoh: Pengenalan Fotosintesis" class="w-full border p-2 rounded">
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Link Video Edukasi (Opsional Youtube)</label>
          <input v-model="materialForm.videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." class="w-full border p-2 rounded">
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Deksripsi Teori Bacaan</label>
          <textarea v-model="materialForm.content" class="w-full border p-2 rounded h-40" placeholder="Tuliskan di sini penjelasan panjang untuk siswa membaca sebelum kuis..."></textarea>
        </div>
      </section>

      <!-- Bagian 10 Soal -->
      <section class="mb-8 border p-6 rounded-lg bg-blue-50">
        <h2 class="text-xl font-semibold mb-2">Soal Evaluasi / Kuis (10 Soal Wajib)</h2>
        <p class="text-sm text-gray-600 mb-6">Siswa akan mengerjakan soal ini di tab akhir bacaan materi.</p>
        
        <div v-for="(q, index) in questions" :key="index" class="bg-white p-4 rounded mb-6 shadow-sm border border-blue-100">
          <h3 class="font-bold mb-3 text-blue-800">Pertanyaan No. {{ index + 1 }}</h3>
          
          <textarea v-model="q.text" placeholder="Teks soal pertanyaan..." class="w-full border p-2 rounded h-20 mb-3"></textarea>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div class="flex flex-col gap-1"><label class="text-sm">Opsi A</label><input v-model="q.optionA" type="text" class="border p-1 rounded"></div>
            <div class="flex flex-col gap-1"><label class="text-sm">Opsi B</label><input v-model="q.optionB" type="text" class="border p-1 rounded"></div>
            <div class="flex flex-col gap-1"><label class="text-sm">Opsi C</label><input v-model="q.optionC" type="text" class="border p-1 rounded"></div>
            <div class="flex flex-col gap-1"><label class="text-sm">Opsi D</label><input v-model="q.optionD" type="text" class="border p-1 rounded"></div>
          </div>
          
          <div class="flex items-center gap-3 bg-blue-100 p-2 rounded mt-2">
            <label class="font-medium text-blue-900">Kunci Jawaban yang Benar:</label>
            <select v-model="q.correctAnswer" class="border p-1 rounded font-bold font-mono">
              <option value="A">Opsi A</option>
              <option value="B">Opsi B</option>
              <option value="C">Opsi C</option>
              <option value="D">Opsi D</option>
            </select>
          </div>
        </div>
      </section>

      <button @click="submitData" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01]">
        ✓ Simpan Materi dan Terbitkan Kuis ke Siswa
      </button>

    </div>
  </div>
</template>
