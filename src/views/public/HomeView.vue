<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const materials = computed(() => store.materials)
const categories = computed(() => store.categories)

const activeFilter = ref('Semua')
const sortOrder = ref('terbaru')
const isFilterOpen = ref(false)

// Tutup popover saat klik di luar
const closeFilter = () => { isFilterOpen.value = false }

const filteredMaterials = computed(() => {
  let list = [...materials.value]

  if (activeFilter.value !== 'Semua') {
    list = list.filter(m => m.category === activeFilter.value)
  }

  if (sortOrder.value === 'terbaru') list.sort((a, b) => b.id - a.id)
  else if (sortOrder.value === 'terlama') list.sort((a, b) => a.id - b.id)
  else if (sortOrder.value === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
  else if (sortOrder.value === 'za') list.sort((a, b) => b.title.localeCompare(a.title))

  return list
})

const selectCategory = (name) => {
  activeFilter.value = name
  isFilterOpen.value = false
}

const isActiveFilter = computed(() =>
  activeFilter.value !== 'Semua' || sortOrder.value !== 'terbaru'
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-20" @click="closeFilter">
    <!-- Navbar -->
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

    <main class="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
      <!-- Judul -->
      <div class="text-center mb-10 animate-[fadeInDown_0.6s_ease-out]">
        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4">Mari Mulai Belajar!</h2>
        <p class="text-slate-500 text-base md:text-xl font-medium max-w-2xl mx-auto">Jelajahi materi kurikulum interaktif dan uji kemampuanmu lewat evaluasi kuis.</p>
      </div>

      <!-- ── FILTER & SORT BAR ── -->
      <div class="flex items-center justify-between gap-3 mb-8 animate-[fadeIn_0.8s_ease-out]">

        <!-- Info hasil filter -->
        <p class="text-sm font-medium text-slate-500">
          <span class="font-bold text-emerald-700">{{ filteredMaterials.length }}</span> materi
          <span v-if="activeFilter !== 'Semua'"> · <span class="text-emerald-600 font-bold">#{{ activeFilter }}</span></span>
        </p>

        <div class="flex items-center gap-2">
          <!-- Sort Dropdown -->
          <select
            v-model="sortOrder"
            @click.stop
            class="bg-white border-2 border-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-xl outline-none focus:border-emerald-400 cursor-pointer transition"
          >
            <option value="terbaru">⬇ Terbaru</option>
            <option value="terlama">⬆ Terlama</option>
            <option value="az">🔤 A → Z</option>
            <option value="za">🔤 Z → A</option>
          </select>

          <!-- Tombol Filter (Popover) -->
          <div class="relative" @click.stop>
            <button
              @click="isFilterOpen = !isFilterOpen"
              class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all"
              :class="isActiveFilter
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M7 12h10M11 20h2"/>
              </svg>
              Filter
              <span
                v-if="activeFilter !== 'Semua'"
                class="w-2 h-2 rounded-full"
                :class="isActiveFilter ? 'bg-yellow-300' : 'bg-emerald-500'"
              ></span>
            </button>

            <!-- Popover Panel -->
            <transition name="popover">
              <div
                v-if="isFilterOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Kategori</span>
                  <button
                    v-if="activeFilter !== 'Semua'"
                    @click="activeFilter = 'Semua'"
                    class="text-xs font-bold text-red-400 hover:text-red-600 transition"
                  >Reset</button>
                </div>

                <div class="py-2 max-h-72 overflow-y-auto">
                  <button
                    @click="selectCategory('Semua')"
                    class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors text-left"
                    :class="activeFilter === 'Semua' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'"
                  >
                    <span>Semua Materi</span>
                    <span v-if="activeFilter === 'Semua'" class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </button>

                  <button
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="selectCategory(cat.name)"
                    class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors text-left"
                    :class="activeFilter === cat.name ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-slate-400 font-normal">#</span>{{ cat.name }}
                    </span>
                    <span v-if="activeFilter === cat.name" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  </button>

                  <div v-if="categories.length === 0" class="px-4 py-4 text-center text-slate-400 text-xs font-medium">
                    Belum ada kategori tersedia.
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Kosong -->
      <div v-if="filteredMaterials.length === 0" class="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold text-slate-700">Belum ada materi untuk kategori ini</h3>
        <p class="text-slate-500 mt-2">Coba pilih kategori lain atau tunggu rilis terbaru.</p>
      </div>

      <!-- ── GRID KARTU MATERI ── -->
      <!-- cols-2 di mobile, cols-2 di tablet, cols-3 di desktop -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
        <div
          v-for="(mat, idx) in filteredMaterials"
          :key="mat.id"
          class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-emerald-200/40 hover:shadow-xl hover:shadow-emerald-300/40 transition duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-emerald-50/50 flex flex-col animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Thumbnail -->
          <div class="h-32 sm:h-48 bg-emerald-50 relative overflow-hidden flex-shrink-0">
            <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover transition duration-700 hover:scale-110" />
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <span class="text-4xl sm:text-6xl opacity-50">📖</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <!-- Badge Kategori -->
            <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
              <span class="bg-yellow-400 text-yellow-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                {{ mat.category || 'Umum' }}
              </span>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-3 sm:p-5 sm:pt-3 flex flex-col flex-grow">
            <h3 class="text-sm sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 line-clamp-2 leading-snug">{{ mat.title }}</h3>
            <!-- Deskripsi disembunyikan di mobile agar kartu tetap compact -->
            <p class="hidden sm:block text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{{ mat.content || '...' }}</p>

            <router-link
              :to="`/materi/${mat.id}`"
              class="block w-full text-center bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl transition duration-300 shadow-sm border border-emerald-100 text-xs sm:text-sm mt-auto"
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
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

.popover-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popover-leave-active { transition: all 0.15s ease-in; }
.popover-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.popover-leave-to { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>