<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const props = defineProps({
  id: String
})

const store = useMainStore()
const router = useRouter()

const material = computed(() => store.materials.find(m => String(m.id) === String(props.id)))
const materialTitle = computed(() => material.value?.title || 'Memuat Materi...')
const materialContent = computed(() => material.value?.content || '')
const materialImage = computed(() => material.value?.image_url || '')
const materialVideo = computed(() => material.value?.video_url || '')

const youtubeEmbedUrl = computed(() => {
  if (!materialVideo.value) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = materialVideo.value.match(regExp)
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null
})

const isQuizMode = ref(false)
const studentName = ref('')
const currentScore = ref(null)

const quizQuestions = computed(() => {
  return material.value?.quiz_questions || [
    { question_text: "Kuis Khusus belum dikonfigurasi Guru untuk materi ini. Mari uji wawasan umum Anda. Apa kitab suci umat Islam?", option_a: "Zabur", option_b: "Taurat", option_c: "Al-Qur'an", option_d: "Injil", correct_option: "C" }
  ]
})

const answers = ref({})
const isSubmitting = ref(false)

const handleQuizSubmit = async () => {
  if(!studentName.value) {
    return alert("Masing-masing siswa wajib mengisi nama lengkap sebelum melihat skor!")
  }
  
  isSubmitting.value = true
  
  let correctCount = 0
  const total = quizQuestions.value.length
  
  if(total === 1 && !material.value?.quiz_questions) {
    currentScore.value = Math.floor(Math.random() * 40) + 60 
  } else {
    quizQuestions.value.forEach((q, idx) => {
      if(answers.value[idx] === q.correct_option) correctCount++
    })
    currentScore.value = Math.round((correctCount / total) * 100)
  }
  
  await store.addStudentResult({
    name: studentName.value,
    materialId: props.id,
    materialTitle: materialTitle.value,
    score: currentScore.value,
    status: 'Selesai Kuis LMS'
  })
  
  isSubmitting.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-24">
    
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-emerald-900/95 backdrop-blur-md border-b border-emerald-700/40 shadow-lg shadow-emerald-900/20">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        
        <!-- Tombol Kembali -->
        <router-link 
          to="/" 
          class="flex items-center gap-2 text-emerald-100 hover:text-yellow-300 transition-all duration-200 group"
        >
          <div class="w-8 h-8 rounded-full bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center group-hover:bg-yellow-400/20 group-hover:border-yellow-400/40 transition-all duration-200">
            <span class="text-sm transform transition group-hover:-translate-x-0.5">&larr;</span>
          </div>
          <span class="text-sm font-semibold hidden sm:inline">Pustaka Materi</span>
        </router-link>

        <!-- Logo Tengah -->
        <div class="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 px-2 py-0.5 rounded-md shadow-sm shadow-yellow-500/30">
            <span class="text-emerald-900 font-black text-sm leading-none">PAI</span>
          </div>
          <span class="font-black tracking-widest text-white text-sm">HUB</span>
        </div>

        <!-- Judul Materi (kanan) -->
        <div class="flex items-center gap-2 max-w-[140px] sm:max-w-[200px]">
          <span class="text-xs text-emerald-300/80 font-medium truncate hidden sm:block">{{ materialTitle }}</span>
          <div class="w-7 h-7 rounded-full bg-emerald-700/50 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <span class="text-xs">📖</span>
          </div>
        </div>

      </div>

      <!-- Garis aksen bawah degradasi -->
      <div class="h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 mt-6 md:mt-10">
      
      <transition name="fade" mode="out-in">

        <!-- ══════════════════════════════
             HALAMAN MATERI
        ══════════════════════════════ -->
        <div v-if="!isQuizMode" class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          
          <!-- Banner Cover -->
          <div class="relative h-48 sm:h-64 md:h-80 bg-emerald-900">
            <img 
              v-if="materialImage" 
              :src="materialImage" 
              class="w-full h-full object-cover"
            />
            <div 
              v-else 
              class="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-6xl opacity-30"
            >🕌</div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
            
            <!-- Title di atas gambar -->
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <span class="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full font-black text-xs uppercase tracking-wider mb-2 shadow">
                Bahan Ajar Online
              </span>
              <h1 class="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow leading-snug">
                {{ materialTitle }}
              </h1>
            </div>
          </div>

          <!-- Konten Teks -->
          <div class="px-4 sm:px-6 md:px-10 py-6 md:py-10">
            
            <!-- Isi Materi -->
            <div class="prose-content">
              <p 
                v-for="(paragraph, i) in materialContent.split('\n').filter(p => p.trim())" 
                :key="i"
                class="text-slate-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4 last:mb-0"
              >
                {{ paragraph }}
              </p>
              <p v-if="!materialContent" class="text-slate-400 italic text-sm">
                Konten materi belum tersedia.
              </p>
            </div>

            <!-- Video Edukasi -->
            <div v-if="youtubeEmbedUrl" class="mt-8 md:mt-10">
              <h3 class="font-bold text-slate-800 text-lg sm:text-xl mb-3 pb-2 border-b-2 border-emerald-100 flex items-center gap-2">
                <span>🎬</span> Video Penjelasan
              </h3>
              <div class="relative w-full rounded-xl overflow-hidden bg-slate-900 shadow-md" style="padding-bottom: 56.25%;">
                <iframe 
                  :src="youtubeEmbedUrl" 
                  class="absolute top-0 left-0 w-full h-full"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <!-- CTA Kuis -->
            <div class="mt-8 md:mt-12 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-100 p-6 md:p-8 rounded-2xl text-center">
              <div class="text-4xl md:text-5xl mb-3">🎓</div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-emerald-900 mb-2">Selesai Membaca?</h2>
              <p class="text-emerald-700 text-sm sm:text-base mb-6 font-medium leading-relaxed max-w-sm mx-auto">
                Uji pemahamanmu dengan kuis evaluasi singkat. Nilaimu langsung dikirim ke buku absen Guru.
              </p>
              <button 
              @click="isQuizMode = true" 
              class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 text-sm font-extrabold px-6 py-2.5 rounded-full shadow-md shadow-yellow-500/30 transform transition hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Mulai Kuis Sekarang ✨
            </button>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════
             HALAMAN KUIS
        ══════════════════════════════ -->
        <div v-else class="bg-white border border-slate-100 p-4 sm:p-6 md:p-10 rounded-2xl shadow-lg relative overflow-hidden">
          
          <div class="absolute top-0 right-0 w-48 h-48 bg-yellow-400 rounded-full blur-3xl opacity-10 -mr-10 -mt-16 pointer-events-none"></div>

          <div class="text-center mb-8">
            <span class="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
              Ruang Evaluasi
            </span>
            <h2 class="text-xl sm:text-2xl font-black mt-3 text-slate-800 leading-snug">
              Kuis: {{ materialTitle }}
            </h2>
          </div>
          
          <!-- Form Kuis -->
          <div v-if="currentScore === null" class="relative z-10 max-w-2xl mx-auto">
            
            <!-- Input Nama -->
            <div class="mb-8 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Identitas Siswa</label>
              <input 
                v-model="studentName" 
                type="text" 
                class="w-full border-2 border-emerald-200 px-4 py-3 bg-white rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition text-base font-bold text-emerald-900" 
                placeholder="Ketik nama lengkapmu di sini..." 
              />
            </div>

            <!-- Soal -->
            <div 
              v-for="(q, idx) in quizQuestions" 
              :key="idx" 
              class="mb-8 pb-8 border-b border-slate-100 last:border-b-0"
            >
              <p class="text-sm sm:text-base font-bold leading-relaxed text-slate-800 mb-4">
                <span class="text-emerald-500 font-black mr-1">{{ idx + 1 }}.</span> {{ q.question_text }}
              </p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  v-for="opt in ['A','B','C','D']" 
                  :key="opt"
                  class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-emerald-50"
                  :class="answers[idx] === opt ? 'border-emerald-500 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20' : 'border-slate-200'"
                >
                  <input type="radio" :name="'q'+idx" :value="opt" v-model="answers[idx]" class="hidden">
                  <span 
                    class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    :class="answers[idx] === opt ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'"
                  >{{ opt }}</span>
                  <span class="font-medium text-slate-700 text-sm leading-snug">
                    {{ opt === 'A' ? q.option_a : opt === 'B' ? q.option_b : opt === 'C' ? q.option_c : q.option_d }}
                  </span>
                </label>
              </div>
            </div>

            <button 
              @click="handleQuizSubmit" 
              :disabled="isSubmitting" 
              class="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/30 transform transition active:scale-95 disabled:opacity-50 flex justify-center"
            >
              <span v-if="!isSubmitting">Kirim Jawaban & Lihat Nilai ✓</span>
              <span v-else class="animate-pulse">Menghitung Nilai...</span>
            </button>
          </div>

          <!-- Hasil Nilai -->
          <div v-else class="text-center py-10 md:py-20 max-w-sm mx-auto relative z-10">
            <div class="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6">
              <div class="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-25 animate-pulse"></div>
              <div 
                class="w-full h-full rounded-full border-[8px] flex items-center justify-center"
                :class="currentScore >= 70 ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-red-400 bg-red-50 text-red-500'"
              >
                <span class="text-5xl font-black">{{ currentScore }}</span>
              </div>
            </div>
            
            <h3 class="text-2xl font-black mb-2" :class="currentScore >= 70 ? 'text-emerald-700' : 'text-slate-800'">
              {{ currentScore >= 70 ? 'Alhamdulillah, Lulus! 🎉' : 'Harap Belajar Lagi 📖' }}
            </h3>
            
            <p class="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Nilai atas nama <strong class="text-slate-700">{{ studentName }}</strong> telah tersimpan di buku catatan Guru secara real-time.
            </p>
            
            <router-link 
              to="/" 
              class="inline-block border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold px-8 py-3 rounded-full transition duration-300 text-sm"
            >
              Kembali ke Pustaka PAI
            </router-link>
          </div>
          
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>