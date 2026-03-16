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

// Kuis per-materi sekarang dihapus dan dipusatkan di Ujian PAI Utama di Beranda.
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
      
      
      <div class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-20 animate-slideUp">
          
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

            <!-- CTA Akhir -->
            <div class="mt-8 md:mt-12 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-100 p-6 md:p-8 rounded-2xl text-center">
              <div class="text-4xl md:text-5xl mb-3">✅</div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-emerald-900 mb-2">Selesai Mempelajari ini?</h2>
              <p class="text-emerald-700 text-sm sm:text-base mb-6 font-medium leading-relaxed max-w-sm mx-auto">
                Lanjutkan membaca materi lain atau kerjakan <strong>Ujian Akhir</strong> di halaman beranda untuk mendapatkan nilai.
              </p>
              <router-link 
                to="/" 
                class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold px-8 py-3 rounded-full shadow-md transition-all transform hover:-translate-y-1"
              >
                Kembali ke Beranda
              </router-link>
            </div>
          </div>
        </div>

      <!-- Bagian Kuis dihapus dan dipindahkan ke QuizView.vue -->
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