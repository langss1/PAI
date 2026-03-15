<script setup>
import { computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const materials = computed(() => store.materials)
</script>

<template>
  <div class="min-h-screen bg-slate-100 font-sans pb-20">
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
      <div class="text-center mb-16 animate-[fadeInDown_0.6s_ease-out]">
        <h2 class="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4">Mari Mulai Belajar!</h2>
        <p class="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">Jelajahi berbagai materi kurikulum interaktif di bawah ini dan uji kemampuanmu langsung lewat evaluasi kuis.</p>
      </div>
      
      <div v-if="materials.length === 0" class="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold text-slate-700">Belum ada materi aktif</h3>
        <p class="text-slate-500 mt-2">Menunggu guru mempublikasikan materi baru.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Kartu Materi -->
        <div 
          v-for="(mat, idx) in materials" 
          :key="mat.id"
          class="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-slate-100 flex flex-col animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.15}s` }"
        >
          <div class="h-48 bg-emerald-50 relative overflow-hidden flex-shrink-0">
            <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover transition duration-700 hover:scale-110" />
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <span class="text-6xl opacity-50">📖</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4">
              <span class="bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">Buku Materi</span>
            </div>
          </div>
          
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">{{ mat.title }}</h3>
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
</style>
