<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const router = useRouter()
const materials = computed(() => store.materials)

const isSidebarOpen = ref(false)

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

// ── State Popup Konfirmasi Hapus ──
const confirmDelete = ref({ show: false, id: null })
const handleDelete = (id) => {
  confirmDelete.value = { show: true, id }
}
const doDelete = async () => {
  await store.deleteMaterial(confirmDelete.value.id)
  confirmDelete.value = { show: false, id: null }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full">

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
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
              🔒
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-800 mb-1">Keluar dari Portal?</h3>
              <p class="text-sm text-slate-500 leading-relaxed">
                Sesi guru akan diakhiri. Anda perlu login kembali untuk mengakses dashboard.
              </p>
            </div>
            <div class="flex gap-3 w-full mt-1">
              <button
                @click="confirmLogout = false"
                class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                @click="doLogout"
                class="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ── POPUP KONFIRMASI HAPUS ── -->
    <transition name="overlay-fade">
      <div
        v-if="confirmDelete.show"
        class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        @click.self="confirmDelete.show = false"
      >
        <transition name="modal-pop">
          <div
            v-if="confirmDelete.show"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4"
          >
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
              🗑️
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-800 mb-1">Hapus Materi?</h3>
              <p class="text-sm text-slate-500 leading-relaxed">
                Materi beserta semua kuis dan hasil siswa akan dihapus secara permanen dan tidak bisa dikembalikan.
              </p>
            </div>
            <div class="flex gap-3 w-full mt-1">
              <button
                @click="confirmDelete.show = false"
                class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                @click="doDelete"
                class="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Mobile Header -->
    <div class="md:hidden bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🕌</span>
        <h2 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 tracking-wide">Portal Guru</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="text-yellow-400 p-2 focus:outline-none">
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
          <router-link to="/admin/dashboard" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow-inner border border-emerald-500/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <span class="text-xl">📖</span> Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/materi/tambah" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
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
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 hover:text-white bg-red-900/40 hover:bg-red-600 p-4 rounded-xl transition-all font-bold shadow hover:shadow-lg hover:-translate-y-1 border border-red-800/30">
          <span class="text-xl">🔒</span> Log Keluar
        </button>
      </div>
    </div>
    
    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden"></div>

    <!-- Konten Utama -->
    <div class="flex-grow p-4 md:p-10 lg:p-14 relative overflow-y-auto w-full">
      
      <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-9xl">🌿</div>
      
      <div class="mb-8 text-center md:text-left animate-fadeInDown">
        <h1 class="text-3xl md:text-5xl font-poppins font-bold text-emerald-900 mb-2">Selamat Datang, Guru PAI!</h1>
        <p class="text-emerald-700 font-medium text-base md:text-lg max-w-xl">Berikut adalah daftar materi PAI yang tersedia untuk siswa berserta pengaturannya.</p>
      </div>
      
      <div class="bg-white rounded-2xl border border-slate-200 mb-8 overflow-hidden z-10 relative animate-slideUp">
        
        <!-- Header Tabel -->
        <div class="bg-slate-50 p-4 md:p-6 flex items-center justify-between border-b border-slate-200">
          <div class="flex items-center gap-3">
            <span class="text-2xl text-emerald-700">📚</span>
            <h3 class="text-emerald-900 font-bold text-lg md:text-xl font-poppins">Daftar Materi PAI</h3>
          </div>
          <router-link 
            to="/admin/materi/tambah" 
            class="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-sm flex items-center gap-1"
          >
            <span>+</span> <span class="hidden sm:inline">Tambah Materi</span>
          </router-link>
        </div>

        <!-- Tabel: md ke atas -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-white text-emerald-800 text-sm uppercase border-b border-slate-200 text-center">
                <th class="p-5 font-bold text-left pl-8">Sampul Visual</th>
                <th class="p-5 font-bold text-left">Topik Kajian / Bab</th>
                <th class="p-5 font-bold w-40 pr-8">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="mat in materials" :key="mat.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 pl-8 w-40">
                  <div class="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <span class="text-2xl opacity-40">📖</span>
                    </div>
                  </div>
                </td>
                <td class="p-5 py-6 align-top">
                  <p class="font-bold text-xl text-emerald-900 mb-2">{{ mat.title }}</p>
                  <p class="text-sm text-slate-500 line-clamp-2 max-w-lg">{{ mat.content || 'Catatan tidak tersedia' }}</p>
                  <div class="mt-3">
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">Dipublish ✓</span>
                  </div>
                </td>
                <td class="p-5 pr-8 align-middle">
                  <div class="flex flex-col gap-2">
                    <button @click="router.push('/admin/materi/edit/' + mat.id)" class="px-4 py-2 w-full bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200 hover:bg-emerald-100 transition-all hover:shadow transform hover:-translate-y-0.5">✏️ Edit</button>
                    <button @click="handleDelete(mat.id)" class="px-4 py-2 w-full bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 transition-all hover:shadow transform hover:-translate-y-0.5">🗑️ Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-if="materials.length === 0">
                <td colspan="3" class="p-16 text-center">
                  <div class="text-6xl mb-4 opacity-30">🕌</div>
                  <p class="text-slate-600 font-bold text-lg">Data materi PAI masih kosong.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card List: mobile -->
        <div class="md:hidden divide-y divide-slate-100">

          <div v-if="materials.length === 0" class="p-12 text-center">
            <div class="text-5xl mb-3 opacity-30">🕌</div>
            <p class="text-slate-600 font-bold">Data materi PAI masih kosong.</p>
          </div>

          <div 
            v-for="mat in materials" 
            :key="mat.id"
            class="p-4 flex gap-4 items-start hover:bg-slate-50 transition-colors"
          >
            <div class="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 relative">
              <img v-if="mat.image_url" :src="mat.image_url" class="absolute inset-0 w-full h-full object-cover" />
              <div v-else class="absolute inset-0 flex items-center justify-center bg-slate-100">
                <span class="text-2xl opacity-40">📖</span>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-bold text-emerald-900 text-base leading-snug line-clamp-2 mb-1">{{ mat.title }}</p>
              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">{{ mat.content || 'Catatan tidak tersedia' }}</p>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-3">Dipublish ✓</span>
              <div class="flex gap-2">
                <button 
                  @click="router.push('/admin/materi/edit/' + mat.id)" 
                  class="flex-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold py-2 border border-emerald-200 hover:bg-emerald-100 transition-all active:scale-95"
                >
                  ✏️ Edit
                </button>
                <button 
                  @click="handleDelete(mat.id)" 
                  class="flex-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold py-2 border border-red-100 hover:bg-red-100 transition-all active:scale-95"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

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