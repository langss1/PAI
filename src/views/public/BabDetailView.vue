<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const categoryName = computed(() => route.params.categoryName)
const materials = computed(() => store.materials)

const filteredMaterials = computed(() => {
  return materials.value.filter(m => m.category === categoryName.value)
})

onMounted(() => {
  if (store.materials.length === 0) store.fetchMaterials()
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-20">
    <!-- Navbar -->
    <header class="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-400 p-2 rounded-lg cursor-pointer" @click="goBack">
            <span class="text-emerald-900 font-black text-xl leading-none">PAI</span>
          </div>
          <h1 class="text-2xl font-black tracking-wide">HUB</h1>
        </div>
        <button @click="goBack" class="text-emerald-100 hover:text-white font-semibold text-sm bg-emerald-700/50 px-4 py-2 rounded-full transition border border-emerald-500/30">
          &larr; Kembali ke Daftar Bab
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
      <!-- Breadcrumb / Header Section -->
      <div class="mb-10 animate-[fadeInDown_0.6s_ease-out]">
        <div class="flex items-center gap-2 text-emerald-600 font-bold mb-2">
          <span @click="goBack" class="cursor-pointer hover:underline">Beranda</span>
          <span>/</span>
          <span class="text-slate-400">Bab: {{ categoryName }}</span>
        </div>
        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 capitalize">
          {{ categoryName }}
        </h2>
        <p class="text-slate-500 text-lg font-medium">Jelajahi materi-materi pembelajaran pada Bab ini.</p>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMaterials.length === 0" class="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold text-slate-700">Belum ada materi untuk Bab ini</h3>
        <p class="text-slate-500 mt-2">Materi untuk bab ini sedang dalam tahap penyusunan oleh Guru.</p>
        <button @click="goBack" class="mt-6 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
          Lihat Bab Lainnya
        </button>
      </div>

      <!-- Materials Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(mat, idx) in filteredMaterials"
          :key="mat.id"
          class="bg-white rounded-2xl overflow-hidden shadow-md shadow-emerald-200/40 hover:shadow-xl hover:shadow-emerald-300/40 transition duration-500 transform hover:-translate-y-1 border border-emerald-50/50 flex flex-col animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Thumbnail -->
          <div class="h-48 bg-emerald-50 relative overflow-hidden flex-shrink-0">
            <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover transition duration-700 hover:scale-110" />
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <span class="text-6xl opacity-50">📖</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">{{ mat.title }}</h3>
            <p class="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{{ mat.content ? mat.content.substring(0, 100) + '...' : '...' }}</p>

            <router-link
              :to="`/materi/${mat.id}`"
              class="block w-full text-center bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold py-3 rounded-xl transition duration-300 shadow-sm border border-emerald-100 text-sm mt-auto"
            >
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
