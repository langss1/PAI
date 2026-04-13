<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const router = useRouter()

const logoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAYAAAB1ovlvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5+SURBVHgB7V0NbBRVFm0WREBByy7BshREfkgUiwKCWv4Uo6AIUfEHREFEhKASRYTIG0SUEAVBRYSiIooiKCoKAhUFhSgIqIgoCAgKCPxRWNrSll93p4X+ztzdSdqZ6exO5r05SfvS7rSzd+7t3HfOnXvv1FqO4ziO4ziO4ziO4ztqEw6XpQvG61o9A+vK4C268vS+3XWdpnU7EAg8DIPYAb0B6F07v+d0W7fS8vKy6I46gOEA1BvAQQB2A1AC4I49O3f6XvM26vX67XAsgDshPAdXAcgLh8MeHe9jXb7fXIny8vIu0V0x4I0AsAnA5gCsT8UvAH7f6/12unO8Xj9K/y06n8S6V620tHSIn993yAL0BrASwEclYfK73qfXu8dbWlr6t/V9v8N5I8B9MIn3S8I2mZ9t/Z9S70vLzMwsqqD+v3Xf9wYMg1YtA6vG+r2h85S6Z9q5UbeZzYp4A3AnAOun4vC+Xus9X9Z/i6urq6MAt8MkP8vD7X/E9X9BvS8tLS0S3REf8N7e8EAA9vHq0L/Rtc7x8vLy8NclYcMAsIn3rA826D4P6/8x9b6krKzsM90RH/DOngB7ADAEW28GtkL36/vIunO8pKSkuNIBvD9Xf8Z73UfWvYf1T7p/rF6/yK8f6f6/5B2eGzAFGAnA7yXhAtWv96t6n1Pn69X6V3X9K7p/vF4f9Y9fUv899m1+o/+O1/vS0tKyUf6f977p6Xp7vD6o8zZ993S9fI+086puv9h6v9q8SndzK7p+rX68X9U6P6f7G7WOnzP1e73XfXW9P6jXt0qdf9Z6ntZ/S92/3Lp/3PwfP1+sPl8zf1r//fW623qd0vWlreN9rP+N6+1v9N6u3id1/m7rfUqdT9W6pY7fU68/pPO56n1Pvd7u17vHe673C9Wf1f/B9f4F9bpS65Zax4/X+vG6X6ZfH9X7D9XP5X79L6/791vX9zZ6X67H/2r9pZ7/QY/rD6S6v7z7fFqf1u9W9WfUu9f6P0u9v6fc7/f/Z78tK3VvX76/9n3idrvNUr7L7pZ3Z9HqBfp6v1/X7A/+Z1n/M67UubvNUP78iX6v1X/H7v9bv3fT70bov9D7Vz6H1+17u9V49P6vXXfR4R90v9efrfX6f9jFf6L2p1hX98u8I67/fX1XfV5m99Pz7vD5TfR/89Pr7Nf9un/L6D/2/299vV95f7uT+j32v90v9m9/I/+t1e8D/+Lq94/uPr+v38n+8/j3f+X76/Z4P6+V/Zz+v8f89oP/zX+H/U67/M8/zf6HXZVrf2f8Nf9n7X7eXjP8d79Bf3mB9P7D+d6m7V/+66K9f6V8N9e7K/mZfrf89PZf96fV7pM/+3X8u++6f+W+v69fpPvvX92X9T3683f/37uv/U+59af3z36XuvW/02v3vV99e89unPq839T16v2rf6r9/Vp/7+32v+9vVr+fN5fV3V79+7fVf9L/28Y6zfvY6vWdfzFfpdVv1v0nX56z+/5m79X0v93q8rrv9O79S9D797vA+veNf/Xh5+0/pP/Pve+i5uL/V/8S65fH3G79X/f77Xv/+uP6/rv9v7P9WfG7D+P7f/Z8Yre9D9HrfX5/3K3qf+O8eP9Pv9On9v6fH/AfFfVfSjA9oMAAAAAElFTkSuQmCC'

const questions = ref([])
const isSaving = ref(false)
const popup = ref({ show: false, message: '', type: 'success' })

const showPopup = (message, type = 'success') => {
  popup.value = { show: true, message, type }
  setTimeout(() => { popup.value.show = false }, 3000)
}

onMounted(async () => {
  await store.fetchGlobalQuestions()
  if (store.globalQuestions.length > 0) {
    // Filter questions that have actual text to avoid showing empty slots unless explicitly added
    const existingQuestions = store.globalQuestions
      .filter(q => q.question_text && q.question_text.trim() !== '')
      .map(q => ({
        text: q.question_text,
        optionA: q.option_a,
        optionB: q.option_b,
        optionC: q.option_c,
        optionD: q.option_d,
        correctAnswer: q.correct_option
      }))
    
    if (existingQuestions.length > 0) {
      questions.value = existingQuestions
    }
  }
  
  // Ensure we have at least 1 question slot if none exist or all were empty
  if (questions.value.length === 0) {
    questions.value.push({
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    })
  }
})

const handleSave = async () => {
  const filledCount = questions.value.filter(q => q.text.trim() !== '').length
  if (filledCount === 0) return showPopup('Minimal isi 1 soal untuk disimpan.', 'error')
  
  isSaving.value = true
  const success = await store.saveGlobalQuestions(questions.value)
  if (success) {
    showPopup('Kuis Global berhasil diperbarui! Mengalihkan...')
    setTimeout(() => {
        isSaving.value = false
        router.push('/admin/dashboard')
    }, 1500)
  } else {
    isSaving.value = false
  }
}

const addQuestion = () => {
  if (questions.value.length >= 25) {
    showPopup('Maksimal 25 soal.', 'error')
    return
  }
  questions.value.push({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  })
  // Scroll to bottom
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, 100)
}

const isSidebarOpen = ref(false)
const confirmLogout = ref(false)
const confirmDeleteQuestion = ref({ show: false, index: null })

const logout = () => {
  isSidebarOpen.value = false
  confirmLogout.value = true
}

const doLogout = () => {
  localStorage.removeItem('admin_auth')
  router.push('/admin/login')
}

const triggerDeleteQuestion = (index) => {
  confirmDeleteQuestion.value = { show: true, index }
}

const doDeleteQuestion = () => {
  if (confirmDeleteQuestion.value.index !== null) {
    questions.value.splice(confirmDeleteQuestion.value.index, 1)
  }
  confirmDeleteQuestion.value.show = false
  if (questions.value.length === 0) {
    questions.value.push({
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">
    
    <transition name="popup">
      <div v-if="popup.show" class="fixed top-5 left-1/2 -translate-x-1/2 z-[1001] w-[90vw] max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border backdrop-blur-md" :class="popup.type === 'success' ? 'bg-emerald-900 border-emerald-600/50 text-white' : 'bg-red-900 border-red-600/50 text-white'">
        <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-opacity-20 bg-white">{{ popup.type === 'success' ? '✅' : '⚠️' }}</div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm">Status</p>
          <p class="text-xs opacity-80">{{ popup.message }}</p>
        </div>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <transition name="fade">
      <div v-if="confirmLogout" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-5 animate-scaleUp">
          <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl mb-2">🔒</div>
          <div>
            <h3 class="text-2xl font-black text-slate-800 mb-1">Log Out?</h3>
            <p class="text-slate-500 font-medium leading-relaxed">Sesi guru akan diakhiri. Anda perlu login kembali untuk mengakses dashboard.</p>
          </div>
          <div class="flex gap-3 w-full mt-2">
            <button @click="confirmLogout = false" class="flex-1 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95">Batal</button>
            <button @click="doLogout" class="flex-1 py-4 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95">Ya, Keluar</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Question Delete Confirmation Modal -->
    <transition name="fade">
      <div v-if="confirmDeleteQuestion.show" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-5 animate-scaleUp">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mb-2">🗑️</div>
          <div>
            <h3 class="text-xl font-black text-slate-800 mb-1">Hapus Soal?</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Soal ini akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div class="flex gap-3 w-full mt-1">
            <button @click="confirmDeleteQuestion.show = false" class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95">Batal</button>
            <button @click="doDeleteQuestion" class="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Header -->
    <div class="md:hidden bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-full overflow-hidden bg-white border-2 border-emerald-100 shadow flex items-center justify-center">
          <img :src="logoDataUrl" alt="PAI HUB Logo" class="w-full h-full object-contain p-0.5" />
        </div>
        <h2 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 tracking-wide">Portal Guru</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="text-yellow-400 p-2 focus:outline-none">
        <svg v-if="!isSidebarOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 text-white flex flex-col shadow-2xl overflow-hidden" :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}">
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30"></div>

      <!-- Sidebar Header -->
      <div class="px-8 pt-8 pb-4 hidden md:flex items-center gap-3 relative z-10 flex-shrink-0">
        <div class="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-emerald-100 shadow-lg flex items-center justify-center flex-shrink-0">
          <img :src="logoDataUrl" alt="PAI HUB Logo" class="w-full h-full object-contain p-1" />
        </div>
        <div>
          <h2 class="text-2xl font-poppins font-bold text-white tracking-wide">Portal Guru</h2>
          <p class="text-xs text-emerald-100 font-medium">PAI HUB</p>
        </div>
      </div>

      <!-- Navigation Links - Scrollable Area -->
      <div class="flex-grow overflow-y-auto px-8 py-6 relative z-10">
        <ul class="space-y-4 text-[15px] font-bold tracking-wide">
          <li><router-link to="/admin/dashboard" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">📖 Dashboard</router-link></li>
          <li><router-link to="/admin/materi/tambah" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">✍️ Tambah Materi</router-link></li>
          <li><router-link to="/admin/kuis" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow border border-emerald-500/30 backdrop-blur-sm transition-all">🎓 Kuis Global</router-link></li>
          <li><router-link to="/admin/kehadiran" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">📊 Nilai Siswa</router-link></li>
          <li><router-link to="/admin/kategori" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">🏷️ Kelola Bab</router-link></li>
        </ul>
      </div>

      <!-- Logout Button - Fixed at Bottom -->
      <div class="px-8 py-6 border-t border-emerald-700/50 relative z-10 flex-shrink-0">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 bg-red-900/40 p-4 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-lg border border-red-800/30">
          <span class="text-xl">🔒</span> Log Out
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow p-6 md:p-14 relative w-full lg:max-w-6xl mx-auto overflow-y-auto">
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-4xl font-bold text-emerald-900 mb-3">Kelola Kuis Utama 🎓</h1>
        <p class="text-emerald-700/80 font-medium text-lg">Buatlah minimal 25 soal untuk kuis global (Ujian Akhir) yang akan dikerjakan oleh seluruh siswa.</p>
      </div>

      <div class="bg-white rounded-3xl border border-emerald-100 p-6 md:p-10 shadow-sm relative z-10">
        
        <div v-for="(q, idx) in questions" :key="idx" class="mb-12 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div class="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black group-hover:opacity-10 transition-opacity">#{{ idx + 1 }}</div>
          
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-sm">{{ idx + 1 }}</div>
              <h3 class="font-bold text-emerald-900">Pertanyaan Ke-{{ idx + 1 }}</h3>
            </div>
            <button @click="triggerDeleteQuestion(idx)" class="w-12 h-12 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-all hover:scale-110 shadow-sm border border-red-100" title="Hapus Soal">
              <span class="text-2xl">🗑️</span>
            </button>
          </div>

          <textarea v-model="q.text" placeholder="Tuliskan soal pilihan ganda di sini..." class="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl p-4 min-h-[100px] outline-none transition-all mb-6 text-slate-800 font-medium"></textarea>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div v-for="opt in ['A','B','C','D']" :key="opt" class="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 bg-white">
              <div class="flex items-center justify-center w-12 bg-slate-100 text-slate-500 font-bold border-r border-slate-200 uppercase">{{ opt }}</div>
              <input v-model="q['option' + opt]" type="text" :placeholder="'Jawaban ' + opt" class="w-full outline-none p-3 font-medium text-slate-800">
            </div>
          </div>

          <div class="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <label class="font-bold text-emerald-800 text-sm">Kunci Jawaban Benar:</label>
            <div class="flex gap-2">
              <button v-for="ans in ['A','B','C','D']" :key="ans" @click="q.correctAnswer = ans" class="w-10 h-10 rounded-lg font-black transition-all" :class="q.correctAnswer === ans ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:bg-emerald-100'">{{ ans }}</button>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-4">
          <button @click="addQuestion" class="flex-1 py-5 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-700 font-bold text-xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-3">
            <span>➕</span> Tambah Butir Soal
          </button>
          
          <button @click="handleSave" :disabled="isSaving" class="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-yellow-300 font-bold text-xl shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
            <span v-if="!isSaving">Simpan Seluruh Soal Kuis</span>
            <span v-else class="flex items-center gap-3">
               <svg class="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Sedang Memproses...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="isSaving" class="fixed inset-0 z-[10000] bg-emerald-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-white p-6 text-center">
        <div class="relative w-24 h-24 mb-8">
          <div class="absolute inset-0 border-8 border-emerald-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-8 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">📖</div>
        </div>
        <h2 class="text-3xl font-black uppercase tracking-[0.2em] mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">Menyimpan Kuis</h2>
        <p class="text-emerald-100/70 font-medium max-w-xs">Mohon tunggu sebentar, data kuis global sedang diperbarui dan Anda akan dialihkan...</p>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.popup-enter-active, .popup-leave-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popup-enter-from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
.popup-leave-to { opacity: 0; transform: translateY(-10px) translateX(-50%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scaleUp {
  animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Custom transitions for a premium feel */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from { opacity: 0; transform: translateX(30px); }
.list-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
