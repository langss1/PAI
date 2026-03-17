<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const router = useRouter()

const studentName = ref('')
const currentScore = ref(null)
const answers = ref({})
const isSubmitting = ref(false)
const quizStep = ref('intro') // intro, quiz, result

const questions = computed(() => store.globalQuestions)

onMounted(async () => {
  if (store.globalQuestions.length === 0) {
    await store.fetchGlobalQuestions()
  }
})

const startQuiz = () => {
  if (questions.value.length === 0) {
    return alert('Maaf, saat ini belum ada soal ujian yang tersedia. Hubungi Gurumu.')
  }
  if (!studentName.value || studentName.value.length < 3) {
    return alert('Harap isi nama lengkapmu terlebih dahulu (minimal 3 huruf).')
  }
  quizStep.value = 'quiz'
}

const handleSubmit = async () => {
  if (Object.keys(answers.value).length < questions.value.length) {
    if (!confirm('Beberapa soal belum dijawab. Yakin ingin mengirim sekarang?')) return
  }
  
  isSubmitting.value = true
  
  let correctCount = 0
  const total = questions.value.length
  
  questions.value.forEach((q, idx) => {
    if (answers.value[idx] === q.correct_option) correctCount++
  })
  
  currentScore.value = Math.round((correctCount / total) * 100)
  
  // Simpan hasil ke database (materialId NULL berarti Kuis Global)
  await store.addStudentResult({
    name: studentName.value,
    materialId: null, 
    materialTitle: 'Ujian PAI Utama',
    score: currentScore.value,
    status: 'Selesai Kuis Utama'
  })
  
  isSubmitting.value = false
  quizStep.value = 'result'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-hidden">
    
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-emerald-900/95 backdrop-blur-md border-b border-emerald-700/40 shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="text-white flex items-center gap-2 font-bold hover:text-yellow-400">
           <span>&larr;</span> Keluar Kuis
        </router-link>
        <div class="flex items-center gap-2">
            <div class="bg-yellow-400 px-2 py-0.5 rounded font-black text-emerald-900 text-xs text-center">PAI</div>
            <span class="text-white font-black tracking-widest text-xs">HUB</span>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 mt-8 md:mt-12">
      
      <!-- 1. Intro Step -->
      <transition name="fade" mode="out-in">
        <div v-if="quizStep === 'intro'" class="text-center animate-slideUp">
           <div class="text-6xl md:text-8xl mb-6">📖</div>
           <h1 class="text-3xl md:text-5xl font-black text-emerald-950 mb-4 leading-tight">Ujian Akhir PAI Online</h1>
           
           <div v-if="questions.length > 0">
             <p class="text-emerald-800 font-medium mb-10 max-w-md mx-auto opacity-80">Kerjakan {{ questions.length }} soal evaluasi untuk mengukur pemahaman materi Pendidikan Agama Islam yang telah dipelajari.</p>
             
             <div class="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-emerald-100 max-w-sm mx-auto">
               <label class="block text-left text-xs font-black text-emerald-800 uppercase tracking-widest mb-3">Tulis Nama Lengkapmu:</label>
               <input v-model="studentName" type="text" placeholder="Contoh: Faqih" class="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none text-center font-bold text-lg text-emerald-900 mb-6 transition-all shadow-inner">
               <button @click="startQuiz" class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-lg shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">Mulai Ujian Sekarang 🚀</button>
             </div>
           </div>
           
           <div v-else class="bg-white p-10 rounded-3xl shadow-xl border border-emerald-100 max-w-md mx-auto">
             <p class="text-slate-500 font-bold mb-6">Soal ujian belum tersedia untuk saat ini.</p>
             <router-link to="/" class="text-emerald-600 font-black border-b-2 border-emerald-600 pb-1">Kembali ke Beranda</router-link>
           </div>
        </div>

        <!-- 2. Quiz Step -->
        <div v-else-if="quizStep === 'quiz'" class="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10">
           <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black">🎓</div>
                 <div>
                    <h2 class="font-black text-slate-800">Ujian Berlangsung</h2>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ questions.length }} Butir Soal</p>
                 </div>
              </div>
              <div class="text-right">
                 <p class="text-xs font-bold text-slate-400">Nama Siswa</p>
                 <p class="text-sm font-black text-emerald-700 truncate max-w-[120px]">{{ studentName }}</p>
              </div>
           </div>

           <div v-for="(q, idx) in questions" :key="q.id" class="mb-12 last:mb-0">
              <p class="text-lg font-bold text-slate-800 mb-6 flex gap-3 leading-relaxed">
                 <span class="text-emerald-500 flex-shrink-0 font-black">Q{{ idx + 1 }}</span>
                 {{ q.question_text }}
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label 
                   v-for="opt in ['A','B','C','D']" 
                   :key="opt"
                   class="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                   :class="answers[idx] === opt ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-emerald-200'"
                 >
                    <input type="radio" :name="'q'+idx" :value="opt" v-model="answers[idx]" class="hidden">
                    <span class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" :class="answers[idx] === opt ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'">{{ opt }}</span>
                    <span class="font-bold text-slate-700 leading-snug">{{ opt === 'A' ? q.option_a : opt === 'B' ? q.option_b : opt === 'C' ? q.option_c : q.option_d }}</span>
                 </label>
              </div>
           </div>

           <div class="mt-14 pt-8 border-t border-slate-100">
              <button @click="handleSubmit" :disabled="isSubmitting" class="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                 <span v-if="!isSubmitting">Kirim Lembar Jawaban ✓</span>
                 <span v-else class="animate-pulse">Mengirim Jawaban...</span>
              </button>
           </div>
        </div>

        <!-- 3. Result Step -->
        <div v-else-if="quizStep === 'result'" class="text-center animate-slideUp">
           <div class="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-emerald-100 max-w-md mx-auto relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-emerald-500 to-yellow-400"></div>
              
              <div class="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-full border-[10px] flex items-center justify-center relative shadow-inner" :class="currentScore >= 70 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-red-400 text-red-500 bg-red-50'">
                 <span class="text-5xl md:text-6xl font-black">{{ currentScore }}</span>
              </div>

              <h2 class="text-2xl md:text-3xl font-black mb-3" :class="currentScore >= 70 ? 'text-emerald-800' : 'text-slate-800'">
                 {{ currentScore >= 70 ? 'Lulus Ujian! 🎉' : 'Belum Lulus 📖' }}
              </h2>
              
              <p class="text-emerald-700/70 font-medium mb-10 leading-relaxed">Alhamdulillah, ujian selesai. Skor atas nama <strong class="text-emerald-900 border-b-2 border-yellow-300">{{ studentName }}</strong> sudah tercatat di sistem admin Guru.</p>
              
              <router-link to="/" class="block w-full py-4 rounded-xl border-2 border-emerald-600 text-emerald-700 font-black hover:bg-emerald-600 hover:text-white transition-all">Kembali ke Beranda</router-link>
           </div>
        </div>
      </transition>

    </main>

  </div>
</template>

<style scoped>
.animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
