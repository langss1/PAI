<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const router = useRouter()
const store = useMainStore()

const materialForm = ref({
  title: '',
  content: '',
  videoUrl: '',
  imageUrl: ''
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

const route = useRoute()
const isEditMode = ref(false)

onMounted(() => {
  if(route.params.id) {
    isEditMode.value = true
    const editMat = store.materials.find(m => String(m.id) === String(route.params.id))
    if(editMat) {
      materialForm.value.title = editMat.title
      materialForm.value.content = editMat.content
      materialForm.value.videoUrl = editMat.video_url || ''
      materialForm.value.imageUrl = editMat.image_url || ''
      
      // Load Pertanyaan yang sudah ada, lalu pad length ke 10 agar format view gak berubah
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
})

const submitData = async () => {
  if (!materialForm.value.title) return alert("Peringatan: Judul materi pembelajaran wajib diisi!")
  if (materialForm.value.title.length < 5) return alert("Judul minimal harus berisi 5 huruf atau lebih.")
  
  if(isEditMode.value) {
    const success = await store.updateMaterial(route.params.id, {
      title: materialForm.value.title,
      content: materialForm.value.content || ' ',
      videoUrl: materialForm.value.videoUrl,
      imageUrl: materialForm.value.imageUrl, 
      questions: questions.value 
    })
    
    if(success) {
      alert("Alhamdulillah! Materi PAI berhasil di-update.")
      router.push('/admin/dashboard')
    }
  } else {
    const success = await store.addMaterial({
      title: materialForm.value.title,
      content: materialForm.value.content || ' ',
      videoUrl: materialForm.value.videoUrl,
      imageUrl: materialForm.value.imageUrl, 
      questions: questions.value 
    })
    
    if(success) {
      alert("Alhamdulillah! Materi Pendidikan Agama Islam dan susunan Kuis berhasil diterbitkan.")
      router.push('/admin/dashboard')
    }
  }
}

const isSidebarOpen = ref(false)

const logout = () => {
  if(confirm("Apakah Anda yakin ingin menggembok dashboard guru?")) {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">
    
    <!-- Mobile Header (Hanya tampil di HP) -->
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

    <!-- Sidebar / Navigasi Admin Beranimasi -->
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
      </ul>

      <div class="mt-12 pt-6 border-t border-emerald-700/50 relative z-10">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 hover:text-white bg-red-900/40 hover:bg-red-600 p-4 rounded-xl transition-all text-left font-bold shadow hover:shadow-lg hover:-translate-y-1 border border-red-800/30">
          <span class="text-xl">🔒</span> Log Keluar
        </button>
      </div>
    </div>
    
    <!-- Mobile Overlay Black -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Form Konten Utama -->
    <div class="flex-grow p-6 md:p-10 lg:p-14 relative w-full lg:max-w-6xl mx-auto overflow-y-auto">
      
      <div class="mb-10 text-center md:text-left animate-fadeInDown">
        <h1 class="text-4xl md:text-5xl font-poppins font-bold text-emerald-900 mb-3">{{ isEditMode ? 'Edit Materi PAI 📝' : 'Tambah Materi PAI 📝' }}</h1>
        <p class="text-emerald-700/80 font-medium text-lg max-w-2xl mx-auto md:mx-0">{{ isEditMode ? 'Ubah konten materi PAI berserta pembaharuan evaluasi kuis untuk siswa.' : 'Isi detail materi PAI beserta media pembelajaran dan lembar evaluasinya untuk dikerjakan siswa.' }}</p>
      </div>
      
      <!-- Box Raksasa Pengisian -->
      <div class="bg-white rounded-2xl border border-emerald-100 p-6 md:p-12 relative z-10 animate-slideUp">
        
        <!-- Bagian Konten Materi -->
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
              <input type="file" accept="image/*" @change="async (e) => { 
                const file = e.target.files[0]; 
                if(!file) return;
                
                // Compress image down to canvas to prevent Supabase POST size limit error
                const img = new Image();
                img.src = URL.createObjectURL(file);
                await new Promise(r => img.onload = r);
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Resize agar ringan
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                materialForm.imageUrl = canvas.toDataURL('image/jpeg', 0.6); // 60% quality jpeg
              }" class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition-colors text-slate-800 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer">
              <p class="text-xs text-slate-500 mt-2" v-if="materialForm.imageUrl">Gambar siap dipublish ✓</p>
            </div>
          </div>

          <div class="mb-8">
            <label class="block font-bold text-emerald-800 text-sm mb-2">Video Edukasi (Tautan YouTube)</label>
            <input v-model="materialForm.videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 outline-none transition-colors text-slate-800 font-medium">
          </div>
          
          <div class="mb-6">
            <label class="block font-bold text-emerald-800 text-sm mb-2">Isi Detail Materi</label>
            <textarea v-model="materialForm.content" placeholder="Masukkan konten materi PAI..." class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-4 min-h-[250px] outline-none transition-colors text-slate-800 font-medium leading-relaxed resize-y"></textarea>
          </div>
        </section>

        <!-- Bagian 10 Soal -->
        <section class="mb-10 relative z-10 bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl">
          <div class="flex items-center gap-4 border-b border-slate-200 pb-5 mb-8">
            <div class="w-10 h-10 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xl font-bold border border-yellow-200">2</div>
            <div>
              <h2 class="text-2xl font-bold font-poppins text-emerald-900">Lembar Evaluasi Soal</h2>
              <p class="text-slate-500 font-medium text-sm">Buat pertanyaan pilihan ganda untuk materi ini</p>
            </div>
          </div>
          
          <!-- Kartu-kartu soal individu (1-10) -->
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

        <!-- Tombol Lempar Publikasi Raksasa -->
        <button @click="submitData" class="w-full flex justify-center py-4 px-4 rounded-xl shadow border border-emerald-600 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-yellow-300 font-poppins font-bold text-lg md:text-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(4,120,87,0.6)] mt-8 tracking-wide">
          <span>{{ isEditMode ? 'Simpan Update Materi' : 'Simpan Materi PAI' }}</span>
        </button>

      </div>
    </div>
  </div>
</template>
