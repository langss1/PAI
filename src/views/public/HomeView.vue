<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const materials = computed(() => store.materials)
const categories = computed(() => store.categories)

const activeFilter = ref('Semua')

const filteredMaterials = computed(() => {
  if (activeFilter.value === 'Semua') return materials.value
  return materials.value.filter(m => m.category === activeFilter.value)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-20">
    <!-- Navbar / Header Siswa -->
    <header class="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-400 p-2 rounded-lg"><span class="text-emerald-900 font-black text-xl leading-none">PAI</span></div>
          <h1 class="text-2xl font-black tracking-wide">HUB</h1>
        </div>
        <router-link to="/admin/login" class="text-emerald-100 hover:text-white font-semibold text-sm bg-emerald-700/50 px-4 py-2 rounded-full transition border border-emerald-500/30">
          Login Guru &rarr;
        </router-link>
      </div>
    </header>

    <!-- Konten Utama (Gallery Materi) -->
    <main class="max-w-6xl mx-auto px-6 mt-12">
      <div class="text-center mb-10 animate-[fadeInDown_0.6s_ease-out]">
        <h2 class="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4">Mari Mulai Belajar!</h2>
        <p class="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">Jelajahi materi kurikulum interaktif dan uji kemampuanmu lewat evaluasi kuis.</p>
      </div>

      <!-- Filter Bar Category -->
      <div class="flex flex-wrap justify-center gap-3 mb-12 animate-[fadeIn_0.8s_ease-out]">
        <button 
          @click="activeFilter = 'Semua'"
          class="px-6 py-2.5 rounded-full font-bold transition-all border-2"
          :class="activeFilter === 'Semua' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'"
        >
          Semua Materi
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeFilter = cat.name"
          class="px-6 py-2.5 rounded-full font-bold transition-all border-2"
          :class="activeFilter === cat.name ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'"
        >
          #{{ cat.name }}
        </button>
      </div>
      
      <div v-if="filteredMaterials.length === 0" class="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10 animate-[slideUp_0.5s_ease-out]">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold text-slate-700">Belum ada materi untuk kategori ini</h3>
        <p class="text-slate-500 mt-2">Coba pilih kategori lain atau tunggu rilis terbaru.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Kartu Materi -->
        <div 
          v-for="(mat, idx) in filteredMaterials" 
          :key="mat.id"
          class="bg-white rounded-3xl overflow-hidden shadow-lg shadow-emerald-200/40 hover:shadow-2xl hover:shadow-emerald-300/40 transition duration-500 transform hover:-translate-y-2 border border-emerald-50/50 flex flex-col animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <div class="h-48 bg-emerald-50 relative overflow-hidden flex-shrink-0">
            <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover transition duration-700 hover:scale-110" />
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <span class="text-6xl opacity-50">📖</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 flex flex-col gap-2">
              <span class="w-fit bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">Buku Materi</span>
              <span v-if="mat.category" class="w-fit bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm ring-2 ring-emerald-400/50">#{{ mat.category }}</span>
            </div>
          </div>
          
          <div class="p-6 flex flex-col flex-grow">
            <div class="mb-2">
               <h3 class="text-xl font-bold text-slate-800 line-clamp-2 leading-snug">{{ mat.title }}</h3>
            </div>
            <p class="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{{ mat.content || '...' }}</p>
            
            <router-link :to="`/materi/${mat.id}`" class="block w-full text-center bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold py-3 rounded-xl transition duration-300 shadow-sm border border-emerald-100">
              Mulai Belajar
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@keyframes slideUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
</style>

