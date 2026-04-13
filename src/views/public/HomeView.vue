<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const categories = computed(() => store.categories)

onMounted(() => {
  store.fetchCategories()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-20">
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
      <!-- ── CTA KUIS UTAMA (GLOBAL) ── -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 md:p-10 rounded-3xl shadow-2xl shadow-emerald-950/40 relative overflow-hidden group border border-emerald-400/20">
          <!-- Dekorasi -->
          <div class="absolute -top-[50%] -right-[10%] w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[80px] group-hover:bg-yellow-400/20 transition-all duration-700"></div>
          <div class="absolute -bottom-[30%] -left-[10%] w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[60px]"></div>

          <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="text-center md:text-left flex-1">
              <span class="inline-block px-4 py-1.5 bg-yellow-400 text-yellow-950 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-lg shadow-yellow-500/20">Tugas Akhir Guru</span>
              <h2 class="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">Sudah siap ikuti <span class="text-yellow-400 italic">Ujian Akhir?</span></h2>
              <p class="text-emerald-100/70 text-base md:text-lg max-w-xl font-medium leading-relaxed">Ukur tingkat pemahamanmu melalui sistem ujian online terintegrasi. Hasilnya akan langsung masuk ke rekap nilai guru.</p>
            </div>
            
            <router-link to="/kuis" class="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-yellow-950 font-black text-xl py-5 px-10 rounded-2xl shadow-xl shadow-yellow-400/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group/btn">
              <span>Mulai Ujian PAI</span>
              <span class="text-2xl transition-transform group-hover/btn:translate-x-2">🚀</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Section Title -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="text-center mb-10 animate-[fadeInDown_0.6s_ease-out]">
          <h2 class="text-3xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4">Daftar Bab Pembelajaran</h2>
          <p class="text-slate-500 text-base md:text-xl font-medium max-w-2xl mx-auto">Pilih bab yang ingin kamu pelajari hari ini untuk mengakses materi lengkap.</p>
        </div>
      </div>

      <!-- ── GRID DAFTAR BAB (CATEGORIES) ── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Loop untuk setiap Kategori / Bab -->
        <div
          v-for="(cat, idx) in categories"
          :key="cat.id"
          class="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-200/60 transition-all duration-500 border border-slate-100 flex flex-col animate-[slideUp_0.5s_ease-out]"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Bab Header / Icon -->
          <div class="h-40 bg-gradient-to-br from-emerald-500 to-emerald-700 relative flex items-center justify-center overflow-hidden">
             <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <span class="text-7xl group-hover:scale-110 transition duration-500">📖</span>
            
            <!-- Bab Badge -->
            <div class="absolute top-4 left-4">
              <span class="bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                BAB {{ idx + 1 }}
              </span>
            </div>
          </div>

          <!-- Bab Content -->
          <div class="p-6 flex flex-col items-center text-center">
            <h3 class="text-2xl font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition">{{ cat.name }}</h3>
            <p class="text-slate-500 text-sm mb-6 font-medium">Klik tombol di bawah untuk melihat daftar materi lengkap pada bab ini.</p>

            <router-link
              :to="`/bab/${cat.name}`"
              class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              Pelajari Bab Ini
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Empty State Categories -->
        <div v-if="categories.length === 0" class="col-span-full text-center bg-white p-20 rounded-3xl shadow-sm border border-slate-100">
           <div class="text-8xl mb-6">🏜️</div>
           <h3 class="text-2xl font-black text-slate-800">Daftar Bab Belum Tersedia</h3>
           <p class="text-slate-500 mt-4 text-lg">Halaman ini akan diperbarui setelah Guru menambahkan bab pembelajaran.</p>
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