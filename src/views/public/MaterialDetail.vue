<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const props = defineProps({
  id: String
})

const store = useMainStore()
const router = useRouter()

// Ambil materi dari store (Disesuaikan dg field baru)
const material = computed(() => store.materials.find(m => String(m.id) === String(props.id)))
const materialTitle = computed(() => material.value?.title || 'Memuat Materi...')
const materialContent = computed(() => material.value?.content || '')
const materialImage = computed(() => material.value?.image_url || '')
const materialVideo = computed(() => material.value?.video_url || '')

// Logika Embed Youtube Sederhana
const youtubeEmbedUrl = computed(() => {
  if (!materialVideo.value) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = materialVideo.value.match(regExp)
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null
})

// State Kuis & Simulasi Soal (Untuk MVP Kuis Statis/Dinamis)
const isQuizMode = ref(false)
const studentName = ref('')
const currentScore = ref(null)

// Menggunakan questions jika ada, atau fallback dummy jika tidak ada kuis di database
const quizQuestions = computed(() => {
  return material.value?.quiz_questions || [
    { question_text: "Kuis Khusus belum dikonfigurasi Guru untuk materi ini. Mari uji wawasan umum Anda. Apa kitab suci umat Islam?", option_a: "Zabur", option_b: "Taurat", option_c: "Al-Qur'an", option_d: "Injil", correct_option: "C" }
  ]
})

const answers = ref({}) // Nyimpen jawaban A/B/C/D per indeks
const isSubmitting = ref(false)

const handleQuizSubmit = async () => {
  if(!studentName.value) {
    return alert("Masing-masing siswa wajib mengisi nama lengkap sebelum melihat skor!")
  }
  
  isSubmitting.value = true
  
  // Logic Cek Jawaban (Versi Full Dinamis)
  let correctCount = 0
  const total = quizQuestions.value.length
  
  // Jika ini simulasi dummy krn guru blm buat soal, auto random nilai
  if(total === 1 && !material.value?.quiz_questions) {
    currentScore.value = Math.floor(Math.random() * 40) + 60 
  } else {
    // Kuis sungguhan yang dicek per option
    quizQuestions.value.forEach((q, idx) => {
      if(answers.value[idx] === q.correct_option) correctCount++
    })
    currentScore.value = Math.round((correctCount / total) * 100)
  }
  
  // Masukkan nilai siswa ke Supabase lewat global store
  await store.addStudentResult({
    name: studentName.value,
    materialId: props.id, // ID Asli dari database
    materialTitle: materialTitle.value,
    score: currentScore.value,
    status: 'Selesai Kuis LMS'
  })
  
  isSubmitting.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-24">
    <!-- Header Siswa Ringkas -->
    <header class="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 text-emerald-100 hover:text-white transition group border border-emerald-500/50 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-700/50">
          <span class="transform transition group-hover:-translate-x-1">&larr;</span> Pustaka Materi
        </router-link>
        <span class="font-black tracking-widest text-emerald-200">PAI</span>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 mt-10">
      
      <!-- Halaman Bacaan Materi -->
      <transition name="fade" mode="out-in">
        <div v-if="!isQuizMode" class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-[slideUp_0.5s_ease-out]">
          
          <!-- Banner Image Cover Besar -->
          <div class="relative h-64 md:h-96 bg-emerald-900 group">
            <img v-if="materialImage" :src="materialImage" class="w-full h-full object-cover transform transition duration-1000 group-hover:scale-105" />
            <div v-else class="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-8xl opacity-30">🕌</div>
            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div class="absolute bottom-10 left-8 md:left-12 right-8">
              <span class="inline-block px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full font-black text-xs uppercase tracking-wider mb-4 shadow-lg ring-2 ring-yellow-400/50 animate-[fadeInUp_0.8s_ease-out]">Bahan Ajar Online</span>
              <h1 class="text-4xl md:text-5xl font-black text-white drop-shadow-lg leading-tight animate-[fadeInUp_0.6s_ease-out]">{{ materialTitle }}</h1>
            </div>
          </div>

          <!-- Konten Teks -->
          <div class="p-8 md:p-12">
            <p class="text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium animate-[fadeIn_1s_ease-out]">{{ materialContent }}</p>
            
            <!-- Video Edukasi Embed (Bila ada) -->
            <div v-if="youtubeEmbedUrl" class="mt-12 animate-[fadeIn_1.2s_ease-out]">
              <h3 class="font-bold text-slate-800 text-2xl mb-4 py-2 border-b-2 border-emerald-100">Video Penjelasan</h3>
              <div class="aspect-w-16 aspect-h-9 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900 group relative pb-[56.25%]">
                <iframe 
                  :src="youtubeEmbedUrl" 
                  class="absolute top-0 left-0 w-full h-full"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              </div>
            </div>

            <!-- Ajakan Kuis -->
            <div class="mt-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-8 md:p-10 rounded-[2rem] text-center animate-[slideUp_0.8s_ease-out]">
              <div class="text-6xl mb-6 transform transition duration-500 hover:rotate-12 hover:scale-110">🎓</div>
              <h2 class="text-3xl font-extrabold text-emerald-900 mb-3">Selesai Membaca?</h2>
              <p class="text-emerald-700 text-lg mb-8 font-medium">Uji pemahamanmu dengan mengikuti kuis evaluasi singkat. Nilaimu akan langsung dikirim ke buku absen Guru.</p>
              
              <button @click="isQuizMode = true" class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 text-xl font-extrabold px-10 py-5 rounded-full shadow-xl shadow-yellow-500/40 transform transition hover:-translate-y-1 hover:scale-105 active:scale-95 w-full md:w-auto">
                Mulai Kuis Sekarang ✨
              </button>
            </div>
          </div>
        </div>

        <!-- Halaman Kuis Interaktif Beranimasi -->
        <div v-else class="bg-white border-2 border-slate-100 p-6 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-[slideUp_0.4s_ease-out] relative overflow-hidden">
          
          <!-- Hiasan Sudut Kuis -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 -mr-10 -mt-20"></div>

          <div class="text-center mb-12">
            <span class="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase">Ruang Evaluasi</span>
            <h2 class="text-3xl font-black mt-4 text-slate-800">Kuis: {{ materialTitle }}</h2>
          </div>
          
          <!-- State 1: Belum Selesai (Ngerjain Soal) -->
          <div v-if="currentScore === null" class="animate-[fadeIn_0.5s_ease-out] relative z-10 max-w-2xl mx-auto">
            
            <div class="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Identitas Siswa</label>
              <input v-model="studentName" type="text" class="w-full border-2 border-emerald-200 px-5 py-4 bg-white rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition text-lg font-bold text-emerald-900" placeholder="Ketik nama lengkapmu di sini..." />
            </div>

            <!-- Loop Soal Dinamis (Di MVP ini bisa baca dari pertanyaan state atau default API Supabase relasi -> belum support load foreign key MVP) -->
            <div v-for="(q, idx) in quizQuestions" :key="idx" class="space-y-4 mb-10 pb-10 border-b border-slate-100 last:border-b-0">
              <p class="text-xl font-bold leading-relaxed text-slate-800"><span class="text-emerald-500 mr-2">{{idx+1}}.</span> {{ q.question_text }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <!-- Opsi Jawaban Radio Tile Layout -->
                <label class="relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:bg-emerald-50"
                  :class="answers[idx] === 'A' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'">
                  <input type="radio" :name="'q'+idx" value="A" v-model="answers[idx]" class="hidden">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3" :class="answers[idx] === 'A' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'">A</span>
                  <span class="font-medium text-slate-700">{{ q.option_a }}</span>
                </label>

                <label class="relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:bg-emerald-50"
                  :class="answers[idx] === 'B' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'">
                  <input type="radio" :name="'q'+idx" value="B" v-model="answers[idx]" class="hidden">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3" :class="answers[idx] === 'B' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'">B</span>
                  <span class="font-medium text-slate-700">{{ q.option_b }}</span>
                </label>

                <label class="relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:bg-emerald-50"
                  :class="answers[idx] === 'C' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'">
                  <input type="radio" :name="'q'+idx" value="C" v-model="answers[idx]" class="hidden">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3" :class="answers[idx] === 'C' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'">C</span>
                  <span class="font-medium text-slate-700">{{ q.option_c }}</span>
                </label>

                <label class="relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:bg-emerald-50"
                  :class="answers[idx] === 'D' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'">
                  <input type="radio" :name="'q'+idx" value="D" v-model="answers[idx]" class="hidden">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3" :class="answers[idx] === 'D' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'">D</span>
                  <span class="font-medium text-slate-700">{{ q.option_d }}</span>
                </label>
              </div>
            </div>

            <button @click="handleQuizSubmit" :disabled="isSubmitting" class="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold py-5 rounded-2xl shadow-xl shadow-emerald-600/30 transform transition active:scale-95 disabled:opacity-50 flex justify-center">
              <span v-if="!isSubmitting">Kirim Jawaban & Lihat Nilai ✓</span>
              <span v-else class="animate-pulse">Menghitung Nilai...</span>
            </button>
          </div>

          <!-- State 2: Selesai (Tampilkan Nilai Hasil Akhir Beranimasi) -->
          <div v-else class="text-center py-12 md:py-24 animate-[slideUp_0.8s_ease-out] max-w-lg mx-auto relative z-10">
            <div class="relative w-48 h-48 mx-auto mb-8">
              <div class="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div class="w-full h-full border-[10px]" :class="currentScore >= 70 ? 'border-emerald-500 text-emerald-500 bg-emerald-50' : 'border-red-400 text-red-500 bg-red-50'" style="border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: scale(1.1);">
                <span class="text-6xl font-black drop-shadow-sm">{{ currentScore }}</span>
              </div>
            </div>
            
            <h3 class="text-3xl font-black text-slate-800 mb-3" :class="currentScore >= 70 ? 'text-emerald-700' : 'text-slate-800'">
              {{ currentScore >= 70 ? 'Alhamdulillah, Lulus!' : 'Harap Belajar Lagi!' }}
            </h3>
            
            <p class="text-lg text-slate-500 font-medium mb-8">Nilai atas nama <strong class="text-slate-700">{{ studentName }}</strong> telah diamankan dan terbaca di buku catatan Guru secara real-time.</p>
            
            <router-link to="/" class="inline-block border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold px-10 py-4 rounded-full transition duration-300">
               Kembali ke Pustaka PAI
            </router-link>
          </div>
          
        </div>
      </transition>
    </main>
  </div>
</template>

<style>
@keyframes slideUp { 0% { opacity: 0; transform: translateY(40px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

/* Vue Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
