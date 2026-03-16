<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const router = useRouter()
const route = useRoute()
const store = useMainStore()

const materialForm = ref({
  title: '',
  content: '',
  videoUrl: '',
  imageUrl: '',
  category: ''
})

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

const isEditMode = ref(false)
const isSaving = ref(false)

// ── State Popup Notifikasi ──
const popup = ref({ show: false, message: '', type: 'success' })
const showPopup = (message, type = 'success') => {
  popup.value = { show: true, message, type }
  setTimeout(() => { popup.value.show = false }, 3000)
}

// ── State Popup Konfirmasi Logout ──
const confirmLogout = ref(false)
const logout = () => {
  isSidebarOpen.value = false
  confirmLogout.value = true
}
const doLogout = () => {
  localStorage.removeItem('admin_auth')
  router.push('/admin/login')
}

// ── Image Upload logic ──
const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const img = new Image()
    const reader = new FileReader()
    
    reader.onload = (event) => {
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const scaleSize = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleSize
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Simpan sebagai string base64 yang dikompres
        materialForm.value.imageUrl = canvas.toDataURL('image/jpeg', 0.7)
      }
    }
    reader.readAsDataURL(file)
  } catch (err) {
    showPopup('Gagal memproses gambar: ' + err.message, 'error')
  }
}

onMounted(async () => {
  // Pastikan data materi sudah ter-load (penting jika page di-refresh langsung di URL edit)
  if (store.materials.length === 0) {
    await store.fetchMaterials()
  }
  
  if(route.params.id) {
    isEditMode.value = true
    const editMat = store.materials.find(m => String(m.id) === String(route.params.id))
    if(editMat) {
      materialForm.value.title = editMat.title
      materialForm.value.content = editMat.content
      materialForm.value.videoUrl = editMat.video_url || ''
      materialForm.value.imageUrl = editMat.image_url || ''
      materialForm.value.category = editMat.category || ''
      
      if(editMat.quiz_questions && editMat.quiz_questions.length > 0) {
        let loadedQ = editMat.quiz_questions.map(q => ({
          id: q.id,
          text: q.question_text,
          optionA: q.option_a,
          optionB: q.option_b,
          optionC: q.option_c,
          optionD: q.option_d,
          correctAnswer: q.correct_option
        }))
        while(loadedQ.length < 10) {
          loadedQ.push({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' })
        }
        questions.value = loadedQ.slice(0, 10)
      }
    }
  }
  
  // Pastikan kategori juga tersedia
  if (store.categories.length === 0) {
    await store.fetchCategories()
  }
})

const submitData = async () => {
  if (!materialForm.value.title) return showPopup('Peringatan: Judul materi pembelajaran wajib diisi!', 'error')
  if (materialForm.value.title.length < 5) return showPopup('Judul minimal harus berisi 5 huruf atau lebih.', 'error')
  
  isSaving.value = true
  try {
    if(isEditMode.value) {
      const success = await store.updateMaterial(route.params.id, {
        title: materialForm.value.title,
        content: materialForm.value.content || ' ',
        videoUrl: materialForm.value.videoUrl,
        imageUrl: materialForm.value.imageUrl, 
        category: materialForm.value.category,
        questions: questions.value 
      })
      if(success) {
        showPopup('Alhamdulillah! Materi PAI berhasil di-update.', 'success')
        setTimeout(() => router.push('/admin/dashboard'), 2000)
      } else {
        isSaving.value = false
      }
    } else {
      const success = await store.addMaterial({
        title: materialForm.value.title,
        content: materialForm.value.content || ' ',
        videoUrl: materialForm.value.videoUrl,
        imageUrl: materialForm.value.imageUrl, 
        category: materialForm.value.category,
        questions: questions.value 
      })
      if(success) {
        showPopup('Alhamdulillah! Materi PAI dan susunan Kuis berhasil diterbitkan.', 'success')
        setTimeout(() => router.push('/admin/dashboard'), 2000)
      } else {
        isSaving.value = false
      }
    }
  } catch (err) {
    showPopup('Terjadi kesalahan saat menyimpan data.', 'error')
    isSaving.value = false
  }
}

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">

<!-- ── POPUP NOTIFIKASI ── -->
<transition name="popup">
  <div
    v-if="popup.show && !isSaving"
    class="fixed top-5 left-1/2 -translate-x-1/2 z-[999] w-[90vw] max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border"
        :class="popup.type === 'success'
          ? 'bg-emerald-900 border-emerald-600/50 text-white shadow-emerald-900/40'
          : 'bg-red-900 border-red-600/50 text-white shadow-red-900/40'"
      >
        <div
          class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
          :class="popup.type === 'success' ? 'bg-emerald-700' : 'bg-red-700'"
        >
          {{ popup.type === 'success' ? '✅' : '⚠️' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm leading-snug">
            {{ popup.type === 'success' ? 'Berhasil' : 'Peringatan' }}
          </p>
          <p class="text-xs mt-0.5 opacity-80 leading-relaxed">{{ popup.message }}</p>
        </div>
        <button @click="popup.show = false" class="text-white/50 hover:text-white text-lg leading-none flex-shrink-0 mt-0.5 transition">✕</button>
      </div>
    </transition>

    <!-- ── POPUP KONFIRMASI LOGOUT ── -->
    <transition name="overlay-fade">
      <div
        v-if="confirmLogout"
        class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        @click.self="confirmLogout = false"
      >
        <transition name="modal-pop">
          <div
            v-if="confirmLogout"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4"
          >
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">🔒</div>
            <div>
              <h3 class="text-lg font-black text-slate-800 mb-1">Keluar dari Portal?</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Sesi guru akan diakhiri. Anda perlu login kembali untuk mengakses dashboard.</p>
            </div>
            <div class="flex gap-3 w-full mt-1">
              <button @click="confirmLogout = false" class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95">Batal</button>
              <button @click="doLogout" class="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95">Ya, Keluar</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Mobile Header -->
    <div class="md:hidden bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🕌</span>
        <h2 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 tracking-wide">Panel Guru</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="text-yellow-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg">
        <svg v-if="!isSidebarOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 animate-gradient animate-fadeInLeft text-white p-8 flex flex-col shadow-2xl overflow-y-auto"
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
    >
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40 animate-blob1"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30 animate-blob2"></div>
      
      <div class="hidden md:flex items-center gap-3 mb-10 relative z-10">
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 p-2 rounded-xl shadow ring-2 ring-emerald-700">
          <span class="text-3xl text-emerald-900">🕌</span>
        </div>
        <div>
          <h2 class="text-2xl font-poppins font-bold text-white tracking-wide">Portal Guru</h2>
          <p class="text-xs text-emerald-100 font-medium">LMS PAI</p>
        </div>
      </div>

      <ul class="space-y-4 relative z-10 text-[15px] font-bold tracking-wide flex-grow mt-6 md:mt-0">
        <li>
          <router-link to="/admin/dashboard" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
            <span class="text-xl">📖</span> Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/materi/tambah" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow-inner border border-emerald-500/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <span class="text-xl">✍️</span> Tambah/Edit Materi
          </router-link>
        </li>
        <li>
          <router-link to="/admin/kehadiran" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
            <span class="text-xl">📊</span> Data Nilai Siswa
          </router-link>
        </li>
        <li>
          <router-link to="/admin/kategori" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
            <span class="text-xl">🏷️</span> Kelola Kategori
          </router-link>
        </li>
      </ul>

      <div class="mt-12 pt-6 border-t border-emerald-700/50 relative z-10">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 hover:text-white bg-red-900/40 hover:bg-red-600 p-4 rounded-xl transition-all font-bold shadow hover:shadow-lg hover:-translate-y-1 border border-red-800/30">
          <span class="text-xl">🔒</span> Log Keluar
        </button>
      </div>
    </div>
    
    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Form Konten Utama -->
    <div class="flex-grow p-6 md:p-10 lg:p-14 relative w-full lg:max-w-6xl mx-auto overflow-y-auto">
      
      <div class="mb-10 text-center md:text-left animate-fadeInDown">
        <h1 class="text-4xl md:text-5xl font-poppins font-bold text-emerald-900 mb-3">{{ isEditMode ? 'Edit Materi PAI 📝' : 'Tambah Materi PAI 📝' }}</h1>
        <p class="text-emerald-700/80 font-medium text-lg max-w-2xl mx-auto md:mx-0">{{ isEditMode ? 'Ubah konten materi PAI berserta pembaharuan evaluasi kuis untuk siswa.' : 'Isi detail materi PAI beserta media pembelajaran dan lembar evaluasinya untuk dikerjakan siswa.' }}</p>
      </div>
      
      <div class="bg-white rounded-2xl border border-emerald-100 p-6 md:p-12 relative z-10 animate-slideUp">
        
        <!-- Bagian 1: Topik -->
        <section class="mb-14 relative z-10">
          <div class="flex items-center gap-4 border-b border-emerald-100 pb-5 mb-8">
            <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold">1</div>
            <div>
              <h2 class="text-2xl font-bold font-poppins text-emerald-900">Topik Pembelajaran</h2>
              <p class="text-emerald-700/60 font-medium text-sm">Masukkan judul utama dan upload gambar cover materi.</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="group">
              <label class="block font-bold text-emerald-800 text-sm mb-2">Judul Materi PAI</label>
              <input v-model="materialForm.title" type="text" placeholder="Contoh: Rukun Iman & Islam" class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 outline-none transition-colors text-slate-800 font-medium">
            </div>
            <div class="group">
              <label class="block font-bold text-emerald-800 text-sm mb-2">Upload Gambar Representasi</label>
              <input type="file" accept="image/*" @change="handleImageUpload" class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition-colors text-slate-800 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer">
              <p class="text-xs text-slate-500 mt-2" v-if="materialForm.imageUrl">Gambar siap dipublish ✓</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="group">
              <label class="block font-bold text-emerald-800 text-sm mb-2">Pilih Kategori / Topik (#)</label>
              <select v-model="materialForm.category" class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 outline-none transition-colors text-slate-800 font-bold">
                <option value="">Tanpa Kategori</option>
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">#{{ cat.name }}</option>
              </select>
            </div>
            <div class="group">
              <label class="block font-bold text-emerald-800 text-sm mb-2">Video Edukasi (Tautan YouTube)</label>
              <input v-model="materialForm.videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 outline-none transition-colors text-slate-800 font-medium">
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block font-bold text-emerald-800 text-sm mb-2">Isi Detail Materi</label>
            <textarea v-model="materialForm.content" placeholder="Masukkan konten materi PAI..." class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 min-h-[250px] outline-none transition-colors text-slate-800 font-medium leading-relaxed resize-y"></textarea>
          </div>
        </section>

        <!-- Bagian 2: Soal -->
        <section class="mb-10 relative z-10 bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl">
          <div class="flex items-center gap-4 border-b border-slate-200 pb-5 mb-8">
            <div class="w-10 h-10 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xl font-bold border border-yellow-200">2</div>
            <div>
              <h2 class="text-2xl font-bold font-poppins text-emerald-900">Lembar Evaluasi Soal</h2>
              <p class="text-slate-500 font-medium text-sm">Buat pertanyaan pilihan ganda untuk materi ini</p>
            </div>
          </div>
          
          <div v-for="(q, index) in questions" :key="index" class="bg-white p-6 rounded-xl mb-6 shadow-sm border border-slate-200">
            <div class="mb-4">
              <h3 class="font-bold text-emerald-800">Soal #{{ index + 1 }}</h3>
            </div>
            <textarea v-model="q.text" placeholder="Tuliskan soal di sini..." class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 min-h-[100px] outline-none transition-colors mb-4 text-slate-800 resize-y"></textarea>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-emerald-500 bg-white">
                <div class="flex items-center justify-center w-12 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">A</div>
                <input v-model="q.optionA" type="text" class="w-full outline-none p-3 font-medium text-slate-800" placeholder="Jawaban A">
              </div>
              <div class="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-emerald-500 bg-white">
                <div class="flex items-center justify-center w-12 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">B</div>
                <input v-model="q.optionB" type="text" class="w-full outline-none p-3 font-medium text-slate-800" placeholder="Jawaban B">
              </div>
              <div class="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-emerald-500 bg-white">
                <div class="flex items-center justify-center w-12 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">C</div>
                <input v-model="q.optionC" type="text" class="w-full outline-none p-3 font-medium text-slate-800" placeholder="Jawaban C">
              </div>
              <div class="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-emerald-500 bg-white">
                <div class="flex items-center justify-center w-12 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">D</div>
                <input v-model="q.optionD" type="text" class="w-full outline-none p-3 font-medium text-slate-800" placeholder="Jawaban D">
              </div>
            </div>
            <div class="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label class="font-bold text-slate-700">Kunci Jawaban:</label>
              <select v-model="q.correctAnswer" class="border border-slate-300 bg-white p-2 rounded-lg font-bold text-emerald-800 outline-none focus:border-emerald-500">
                <option value="A">Jawaban A</option>
                <option value="B">Jawaban B</option>
                <option value="C">Jawaban C</option>
                <option value="D">Jawaban D</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Tombol Simpan -->
        <button 
          @click="submitData" 
          :disabled="isSaving"
          class="w-full flex justify-center py-4 px-4 rounded-xl shadow border border-emerald-600 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-yellow-300 font-poppins font-bold text-lg md:text-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(4,120,87,0.6)] mt-8 tracking-wide disabled:from-slate-400 disabled:to-slate-500 disabled:border-slate-300 disabled:text-slate-100 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          <span v-if="!isSaving">Simpan Materi PAI</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
        </button>

      </div>
    </div>

    <!-- ── OVERLAY LOADING ── -->
    <transition name="overlay-fade">
      <div
        v-if="isSaving"
        class="fixed inset-0 z-[9999] bg-emerald-950/60 backdrop-blur-xl flex flex-col items-center justify-center gap-5 text-white"
      >
        <!-- Pesan sukses di atas spinner -->
        <transition name="popup">
          <div
            v-if="popup.show"
            class="w-[90vw] max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border mb-2"
            :class="popup.type === 'success'
              ? 'bg-emerald-800 border-emerald-600/50 text-white'
              : 'bg-red-900 border-red-600/50 text-white'"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
              :class="popup.type === 'success' ? 'bg-emerald-600' : 'bg-red-700'"
            >
              {{ popup.type === 'success' ? '✅' : '⚠️' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm leading-snug">
                {{ popup.type === 'success' ? 'Berhasil' : 'Peringatan' }}
              </p>
              <p class="text-xs mt-0.5 opacity-80 leading-relaxed">{{ popup.message }}</p>
            </div>
          </div>
        </transition>

        <!-- Spinner -->
        <div class="relative w-24 h-24">
          <div class="absolute inset-0 border-8 border-emerald-200/10 rounded-full"></div>
          <div class="absolute inset-0 border-8 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🕌</div>
        </div>

        <!-- Teks loading -->
        <div class="text-center">
          <p class="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 px-4">Sedang Menyimpan...</p>
          <p class="text-emerald-100/70 text-sm mt-2 font-medium">Mohon tidak menutup halaman ini.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Popup notifikasi */
.popup-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.popup-leave-active {
  transition: all 0.25s ease-in;
}
.popup-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.95);
}

/* Overlay konfirmasi logout */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Modal konfirmasi logout */
.modal-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-pop-leave-active {
  transition: all 0.2s ease-in;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>