<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const props = defineProps({
  id: String
})

const store = useMainStore()
const router = useRouter()

// Ambil materi dari store
const material = computed(() => store.materials.find(m => m.id === props.id))
const materialTitle = computed(() => material.value?.title || 'Materi Tidak Ditemukan')
const materialContent = computed(() => material.value?.content || '')

// State untuk Kuis Mandiri
const isQuizMode = ref(false)
const studentName = ref('')
const currentScore = ref(null)

const handleQuizSubmit = () => {
  if(!studentName.value) {
    alert("Masukkan namamu dulu sebelum submit!")
    return
  }
  
  // Simulasi nilai
  currentScore.value = Math.floor(Math.random() * 50) + 50 // Nilai 50-100
  
  // Masukkan nilai siswa ke global store agar Guru bisa melihat
  store.addStudentResult({
    id: Date.now().toString(),
    name: studentName.value,
    materialTitle: materialTitle.value,
    score: currentScore.value,
    status: 'Selesai Kuis'
  })
  
  alert(`Kuis Selesai! Nilai ${studentName.value} adalah ${currentScore.value}. Data tersimpan ke guru.`)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <router-link to="/" class="text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali ke Daftar Materi</router-link>
    
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h1 class="text-3xl font-bold mb-4">{{ materialTitle }}</h1>
      <p class="text-gray-700 whitespace-pre-wrap">{{ materialContent }}</p>
    </div>

    <!-- Mode Kuis -->
    <div v-if="!isQuizMode" class="text-center">
      <button @click="isQuizMode = true" class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
        Mulai Kuis Mandiri
      </button>
    </div>

    <div v-else class="bg-blue-50 border border-blue-200 p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-blue-800">Kuis Mandiri - {{ materialTitle }}</h2>
      
      <div v-if="currentScore === null">
        <!-- Input Nama wajib -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Nama Lengkap Siswa</label>
          <input v-model="studentName" type="text" class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama kamu disini..." />
        </div>

        <div class="space-y-4 mb-6">
          <p>1. Apa fungsi dari script setup di Vue?</p>
          <div class="flex gap-2"><input type="radio" name="q1" value="A"> A. Mengatur routing</div>
          <div class="flex gap-2"><input type="radio" name="q1" value="B"> B. Composition API syntactic sugar</div>
        </div>

        <button @click="handleQuizSubmit" class="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Submit Jawaban</button>
      </div>

      <div v-else class="text-center py-6">
        <h3 class="text-2xl font-bold text-green-600 mb-2">Evaluasi Selesai!</h3>
        <p class="text-lg">Selamat <strong>{{ studentName }}</strong>,</p>
        <p class="text-xl mt-2">Nilai Kuis Kamu: <span class="text-3xl font-bold text-blue-600">{{ currentScore }} / 100</span></p>
        <p class="text-sm mt-4 text-gray-500">Nilai telah dikirim dan tercatat dalam sistem Guru.</p>
      </div>
    </div>
  </div>
</template>
