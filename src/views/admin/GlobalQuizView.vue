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
    questions.value = store.globalQuestions.map(q => ({
      text: q.question_text,
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      correctAnswer: q.correct_option
    }))
  }
  
  // Ensure we have at least 25 question slots
  while (questions.value.length < 25) {
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
    showPopup('Kuis Global berhasil diperbarui!')
    setTimeout(() => {
        isSaving.value = false
    }, 500)
  } else {
    isSaving.value = false
  }
}

const addQuestion = () => {
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

const removeQuestion = (index) => {
  if (questions.value.length <= 1) return showPopup('Minimal harus ada 1 soal.', 'error')
  questions.value.splice(index, 1)
}

const isSidebarOpen = ref(false)
const confirmLogout = ref(false)
const logout = () => {
  isSidebarOpen.value = false
  confirmLogout.value = true
}
const doLogout = () => {
  localStorage.removeItem('admin_auth')
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">
    
    <transition name="popup">
      <div v-if="popup.show" class="fixed top-5 left-1/2 -translate-x-1/2 z-[999] w-[90vw] max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border backdrop-blur-md" :class="popup.type === 'success' ? 'bg-emerald-900 border-emerald-600/50 text-white' : 'bg-red-900 border-red-600/50 text-white'">
        <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-opacity-20 bg-white">{{ popup.type === 'success' ? '✅' : '⚠️' }}</div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm">Status</p>
          <p class="text-xs opacity-80">{{ popup.message }}</p>
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
    <div class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 text-white p-8 flex flex-col shadow-2xl overflow-y-auto" :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}">
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30"></div>

      <div class="hidden md:flex items-center gap-3 mb-10 relative z-10">
        <div class="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-emerald-100 shadow-lg flex items-center justify-center flex-shrink-0">
          <img :src="logoDataUrl" alt="PAI HUB Logo" class="w-full h-full object-contain p-1" />
        </div>
        <div>
          <h2 class="text-2xl font-poppins font-bold text-white tracking-wide">Portal Guru</h2>
          <p class="text-xs text-emerald-100 font-medium">PAI HUB</p>
        </div>
      </div>
      <ul class="space-y-4 relative z-10 text-[15px] font-bold tracking-wide flex-grow mt-6 md:mt-0">
        <li><router-link to="/admin/dashboard" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">📖 Dashboard</router-link></li>
        <li><router-link to="/admin/materi/tambah" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">✍️ Tambah Materi</router-link></li>
        <li><router-link to="/admin/kuis" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow border border-emerald-500/30 backdrop-blur-sm transition-all">🎓 Kuis Global</router-link></li>
        <li><router-link to="/admin/kehadiran" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">📊 Nilai Siswa</router-link></li>
        <li><router-link to="/admin/kategori" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white p-4 rounded-xl hover:bg-emerald-700/30 transition-all">🏷️ Kategori</router-link></li>
      </ul>
      <div class="mt-12 pt-6 border-t border-emerald-700/50 relative z-10">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 bg-red-900/40 p-4 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">🔒 Log Keluar</button>
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
            <button @click="removeQuestion(idx)" class="text-red-400 hover:text-red-600 font-bold text-sm flex items-center gap-1 transition-colors">
              <span>🗑️</span> Hapus
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
      <div v-if="isSaving" class="fixed inset-0 z-[10000] bg-emerald-950/80 backdrop-blur-xl flex flex-col items-center justify-center text-white">
        <div class="text-4xl animate-bounce mb-4">📖</div>
        <p class="text-2xl font-black uppercase tracking-widest">Menyimpan Data Kuis...</p>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.popup-enter-active, .popup-leave-active { transition: all 0.3s ease; }
.popup-enter-from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
.popup-leave-to { opacity: 0; transform: translateY(-10px) translateX(-50%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
