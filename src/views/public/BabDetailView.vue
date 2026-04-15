<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const categoryName = computed(() => route.params.categoryName)

const filteredMaterials = computed(() =>
  store.materials.filter(m => m.category === categoryName.value)
)

import { onMounted } from 'vue'
onMounted(() => {
  if (store.materials.length === 0) store.fetchMaterials()
})

const goBack = () => router.push('/')

// ── STATE: materi yang sedang dibuka embednya ──
const openedId = ref(null)
const isLoading = ref(false)
const embedRefs = ref({})

// Fungsi untuk mendapatkan embed URL dari link Canva / video_url
const getEmbedUrl = (url) => {
  if (!url || !url.trim()) return null
  let embedUrl = url.trim()
  if (embedUrl.includes('canva.com') || embedUrl.includes('canva.link')) {
    if (!embedUrl.includes('?embed') && !embedUrl.includes('&embed')) {
      embedUrl = embedUrl + (embedUrl.includes('?') ? '&embed' : '?embed')
    }
  }
  return embedUrl
}

const toggleMaterial = async (mat) => {
  // Jika tidak punya link, navigasi ke halaman detail
  if (!mat.video_url || !mat.video_url.trim()) {
    router.push(`/materi/${mat.id}`)
    return
  }

  // Jika diklik materi yang sama → tutup
  if (openedId.value === String(mat.id)) {
    openedId.value = null
    return
  }

  // Buka materi baru
  isLoading.value = true
  openedId.value = String(mat.id)

  // Scroll ke section embed setelah DOM update
  await nextTick()
  const el = embedRefs.value[mat.id]
  if (el) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }
}

const onIframeLoad = () => {
  isLoading.value = false
}

const closeEmbed = () => {
  openedId.value = null
  isLoading.value = false
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
        <button
          @click="goBack"
          class="text-emerald-100 hover:text-white font-semibold text-sm bg-emerald-700/50 px-4 py-2 rounded-full transition border border-emerald-500/30"
        >
          &larr; Kembali ke Daftar Bab
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 mt-12">

      <!-- Breadcrumb / Header -->
      <div class="mb-10 animate-[fadeInDown_0.6s_ease-out]">
        <div class="flex items-center gap-2 text-emerald-600 font-bold mb-2">
          <span @click="goBack" class="cursor-pointer hover:underline">Beranda</span>
          <span>/</span>
          <span class="text-slate-400">Bab: {{ categoryName }}</span>
        </div>
        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 capitalize">
          {{ categoryName }}
        </h2>
        <p class="text-slate-500 text-lg font-medium">
          Klik <strong class="text-emerald-700">Mulai Belajar</strong> pada materi di bawah untuk langsung membuka materinya.
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredMaterials.length === 0"
        class="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10"
      >
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold text-slate-700">Belum ada materi untuk Bab ini</h3>
        <p class="text-slate-500 mt-2">Materi sedang dalam tahap penyusunan oleh Guru.</p>
        <button @click="goBack" class="mt-6 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
          Lihat Bab Lainnya
        </button>
      </div>

      <!-- Daftar Materi -->
      <div v-else class="space-y-6">
        <div
          v-for="(mat, idx) in filteredMaterials"
          :key="mat.id"
          class="animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.08}s` }"
        >
          <!-- ── Kartu Materi ── -->
          <div
            class="bg-white rounded-2xl overflow-hidden border transition-all duration-300"
            :class="openedId === String(mat.id)
              ? 'border-emerald-400 shadow-xl shadow-emerald-100'
              : 'border-slate-100 shadow-md shadow-emerald-100/40 hover:shadow-lg hover:shadow-emerald-200/50'"
          >
            <!-- Baris info + tombol -->
            <div class="flex flex-col sm:flex-row gap-4 p-5 sm:p-6">

              <!-- Thumbnail -->
              <div class="relative h-40 sm:h-32 sm:w-48 flex-shrink-0 rounded-xl overflow-hidden bg-emerald-50">
                <img
                  v-if="mat.image_url"
                  :src="mat.image_url"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-5xl opacity-30">📖</span>
                </div>

                <!-- Badge interaktif -->
                <div v-if="mat.video_url && mat.video_url.trim()" class="absolute top-2 left-2">
                  <span class="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    Interaktif
                  </span>
                </div>
              </div>

              <!-- Teks -->
              <div class="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-800 mb-1 leading-snug">{{ mat.title }}</h3>
                  <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {{ mat.content ? mat.content.substring(0, 120) + '...' : 'Klik tombol untuk membuka materi pembelajaran ini.' }}
                  </p>
                </div>

                <!-- Tombol -->
                <div class="flex items-center gap-3 mt-4">
                  <button
                    @click="toggleMaterial(mat)"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                    :class="openedId === String(mat.id)
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'"
                  >
                    <!-- Icon buka/tutup -->
                    <svg
                      v-if="openedId === String(mat.id)"
                      class="w-4 h-4"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ openedId === String(mat.id) ? 'Tutup Materi' : 'Mulai Belajar' }}
                  </button>

                  <!-- Tombol detail (jika ada konten teks) -->
                  <router-link
                    :to="`/materi/${mat.id}`"
                    class="text-emerald-600 hover:text-emerald-800 text-sm font-semibold underline underline-offset-2 transition"
                  >
                    Lihat Detail
                  </router-link>
                </div>
              </div>
            </div>

            <!-- ── Section Embed (muncul di bawah kartu) ── -->
            <Transition name="embed-slide">
              <div
                v-if="openedId === String(mat.id)"
                :ref="el => { if (el) embedRefs[mat.id] = el }"
                class="border-t border-emerald-100 bg-slate-50"
              >
                <!-- Header embed -->
                <div class="flex items-center justify-between px-5 py-3 bg-emerald-50 border-b border-emerald-100">
                  <div class="flex items-center gap-2">
                    <span class="text-base">📑</span>
                    <span class="font-bold text-emerald-800 text-sm">{{ mat.title }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <a
                      :href="mat.video_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 transition"
                    >
                      Layar Penuh
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                    <button
                      @click="closeEmbed"
                      class="w-7 h-7 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition text-slate-500"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- iframe area -->
                <div class="relative w-full bg-emerald-950" style="padding-bottom: 62%;">

                  <!-- Loading spinner -->
                  <Transition name="fade">
                    <div
                      v-if="isLoading && openedId === String(mat.id)"
                      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                    >
                      <div class="relative w-12 h-12">
                        <div class="absolute inset-0 border-4 border-emerald-800/40 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p class="text-emerald-400 text-xs font-semibold tracking-wide">Memuat materi...</p>
                    </div>
                  </Transition>

                  <iframe
                    :src="getEmbedUrl(mat.video_url)"
                    :title="mat.title"
                    class="absolute inset-0 w-full h-full border-none"
                    allowfullscreen
                    allow="fullscreen"
                    loading="lazy"
                    @load="onIframeLoad"
                  ></iframe>
                </div>

                <!-- Hint bawah -->
                <div class="px-5 py-2.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
                  <p class="text-xs text-slate-400">
                    Materi tidak tampil?
                    <a :href="mat.video_url" target="_blank" rel="noopener noreferrer"
                       class="text-emerald-600 font-semibold hover:underline ml-1">
                      Buka di tab baru ↗
                    </a>
                  </p>
                  <button
                    @click="closeEmbed"
                    class="text-xs text-slate-400 hover:text-red-500 font-semibold transition"
                  >
                    Tutup ✕
                  </button>
                </div>
              </div>
            </Transition>

          </div>
          <!-- ── End Kartu ── -->

        </div>
      </div>
      <!-- End daftar materi -->

    </main>
  </div>
</template>

<style>
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(28px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-18px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Animasi embed slide down */
.embed-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.embed-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.embed-slide-enter-from {
  opacity: 0;
  max-height: 0;
}
.embed-slide-enter-to {
  opacity: 1;
  max-height: 1200px;
}
.embed-slide-leave-from {
  opacity: 1;
  max-height: 1200px;
}
.embed-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Loading fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>