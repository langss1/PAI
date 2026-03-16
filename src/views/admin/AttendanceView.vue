<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const router = useRouter()

const materialsList = computed(() => store.materials)
const students = computed(() => store.studentResults)

const filterMaterial = ref('')
const newStudentName = ref('')
const selectedMaterialForManualId = ref('')

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

// ── State Popup Konfirmasi Hapus Nilai ──
const confirmDelete = ref({ show: false, id: null })
const handleDeleteAttendance = (id) => {
  confirmDelete.value = { show: true, id }
}
const doDeleteAttendance = async () => {
  await store.deleteStudentResult(confirmDelete.value.id)
  confirmDelete.value = { show: false, id: null }
}

const handleManualPresence = async () => {
  if(!newStudentName.value || !selectedMaterialForManualId.value) {
    return showPopup('Harap masukkan Identitas Siswa dan Topik Kurikulum terlebih dahulu.', 'error')
  }
  const matObj = materialsList.value.find(m => String(m.id) === String(selectedMaterialForManualId.value))
  await store.addStudentResult({
    name: newStudentName.value,
    materialId: selectedMaterialForManualId.value,
    materialTitle: matObj ? matObj.title : 'Kehadiran Manual',
    score: 0,
    status: '✨ Hadir Manual'
  })
  newStudentName.value = ''
  selectedMaterialForManualId.value = ''
  showPopup(`Alhamdulillah, data kehadiran ${matObj ? matObj.title : ''} berhasil ditambahkan!`, 'success')
}

const isSidebarOpen = ref(false)

const filteredStudents = computed(() =>
  students.value.filter(s => filterMaterial.value ? s.materialTitle === filterMaterial.value : true)
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">

    <!-- ── POPUP NOTIFIKASI ── -->
    <transition name="popup">
      <div
        v-if="popup.show"
        class="fixed top-5 left-1/2 -translate-x-1/2 z-[999] w-[90vw] max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border"
        :class="popup.type === 'success'
          ? 'bg-emerald-900 border-emerald-600/50 text-white shadow-emerald-900/40'
          : 'bg-red-900 border-red-600/50 text-white shadow-red-900/40'"
      >
        <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
          :class="popup.type === 'success' ? 'bg-emerald-700' : 'bg-red-700'">
          {{ popup.type === 'success' ? '✅' : '⚠️' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm leading-snug">{{ popup.type === 'success' ? 'Berhasil' : 'Peringatan' }}</p>
          <p class="text-xs mt-0.5 opacity-80 leading-relaxed">{{ popup.message }}</p>
        </div>
        <button @click="popup.show = false" class="text-white/50 hover:text-white text-lg leading-none flex-shrink-0 mt-0.5 transition">✕</button>
      </div>
    </transition>

    <!-- ── POPUP KONFIRMASI LOGOUT ── -->
    <transition name="overlay-fade">
      <div v-if="confirmLogout" class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" @click.self="confirmLogout = false">
        <transition name="modal-pop">
          <div v-if="confirmLogout" class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4">
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

    <!-- ── POPUP KONFIRMASI HAPUS NILAI ── -->
    <transition name="overlay-fade">
      <div v-if="confirmDelete.show" class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" @click.self="confirmDelete.show = false">
        <transition name="modal-pop">
          <div v-if="confirmDelete.show" class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4">
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">🗑️</div>
            <div>
              <h3 class="text-lg font-black text-slate-800 mb-1">Hapus Catatan Nilai?</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Data nilai siswa ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
            </div>
            <div class="flex gap-3 w-full mt-1">
              <button @click="confirmDelete.show = false" class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95">Batal</button>
              <button @click="doDeleteAttendance" class="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95">Ya, Hapus</button>
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
      <button @click="isSidebarOpen = !isSidebarOpen" class="text-yellow-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg">
        <svg v-if="!isSidebarOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 text-white p-8 flex flex-col shadow-2xl overflow-y-auto"
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
    >
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30"></div>

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
          <router-link to="/admin/materi/tambah" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
            <span class="text-xl">✍️</span> Tambah/Edit Materi
          </router-link>
        </li>
        <li>
          <router-link to="/admin/kehadiran" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow-inner border border-emerald-500/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"></div>

    <!-- Konten Utama -->
    <div class="flex-grow p-4 md:p-10 lg:p-14 relative w-full lg:max-w-[1400px] overflow-y-auto">

      <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-9xl">🌿</div>

      <!-- Header -->
      <div class="mb-8 animate-fadeInDown">
        <h1 class="text-3xl md:text-5xl font-poppins font-bold text-emerald-900 mb-2">Data Kehadiran & Nilai PAI</h1>
        <p class="text-emerald-700 font-medium text-base md:text-lg max-w-xl">Lacak kehadiran siswa beserta hasil nilai evaluasi pembelajaran secara Real-Time.</p>
      </div>

      <!-- Filter -->
      <div class="mb-6">
        <div class="bg-white px-4 py-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
          <div class="flex-grow">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Berdasar Kurikulum</label>
            <select v-model="filterMaterial" class="w-full bg-transparent border-none focus:ring-0 text-emerald-900 font-bold outline-none p-0 cursor-pointer text-sm">
              <option value="">Semua Materi</option>
              <option v-for="mat in materialsList" :key="mat.id" :value="mat.title">{{ mat.title }}</option>
            </select>
          </div>
          <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-800 text-sm flex-shrink-0">
            {{ filteredStudents.length }}
          </div>
        </div>
      </div>

      <!-- ── TABEL: md ke atas ── -->
      <div class="hidden md:block bg-white rounded-2xl border border-slate-200 mb-10 overflow-hidden animate-slideUp">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th class="p-5 font-bold pl-8 text-sm">Identitas Siswa</th>
                <th class="p-5 font-bold text-sm">Kurikulum Terselesaikan</th>
                <th class="p-5 font-bold text-center text-sm">Keterangan</th>
                <th class="p-5 font-bold text-center pr-8 text-sm">Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-5 pl-8">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center uppercase flex-shrink-0">
                      {{ student.name.charAt(0) || '?' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm">{{ student.name }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">Disinkronisasi</p>
                    </div>
                  </div>
                </td>
                <td class="p-5">
                  <p class="font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block text-sm max-w-[200px] truncate">
                    {{ student.materialTitle }}
                  </p>
                </td>
                <td class="p-5 text-center">
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold"
                    :class="student.score > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
                    {{ student.score > 0 ? 'Lulus Kuis' : student.status }}
                  </span>
                </td>
                <td class="p-5 pr-8 text-center">
                  <div class="w-12 h-12 mx-auto rounded-xl flex items-center justify-center border mb-2"
                    :class="student.score >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'">
                    <span class="font-bold text-lg font-mono">{{ student.score }}</span>
                  </div>
                  <button @click="handleDeleteAttendance(student.id)" class="text-xs font-bold text-red-400 hover:text-red-600 transition">Hapus</button>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="p-16 text-center bg-slate-50">
                  <div class="text-4xl mb-3 opacity-40">📝</div>
                  <p class="text-slate-600 font-bold">Data presensi masih kosong.</p>
                  <p class="text-slate-500 text-sm mt-1">Belum ada siswa yang lulus atau diinput untuk tajuk ini.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── CARD LIST: mobile ── -->
      <div class="md:hidden bg-white rounded-2xl border border-slate-200 mb-8 overflow-hidden animate-slideUp">

        <div v-if="filteredStudents.length === 0" class="p-12 text-center">
          <div class="text-4xl mb-3 opacity-40">📝</div>
          <p class="text-slate-600 font-bold text-sm">Data presensi masih kosong.</p>
          <p class="text-slate-500 text-xs mt-1">Belum ada siswa yang lulus atau diinput.</p>
        </div>

        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
        >
          <!-- Baris atas: Avatar + Nama + Nilai -->
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center uppercase flex-shrink-0 text-sm">
                {{ student.name.charAt(0) || '?' }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-800 text-sm leading-snug truncate">{{ student.name }}</p>
                <p class="text-xs text-slate-400 mt-0.5">Disinkronisasi</p>
              </div>
            </div>
            <!-- Nilai Badge -->
            <div class="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
              :class="student.score >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'">
              <span class="font-black text-base font-mono">{{ student.score }}</span>
            </div>
          </div>

          <!-- Baris bawah: Kurikulum + Keterangan + Hapus -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <p class="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg truncate max-w-[55%]">
              {{ student.materialTitle }}
            </p>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                :class="student.score > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ student.score > 0 ? 'Lulus Kuis' : student.status }}
              </span>
              <button @click="handleDeleteAttendance(student.id)"
                class="text-xs font-bold text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50 active:scale-95">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

        <!-- Input Kehadiran Manual -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-8 z-10 relative">
          <div class="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
            <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold">✍️</div>
            <div>
              <h3 class="text-lg font-bold font-poppins text-emerald-900">Input Kehadiran Manual</h3>
              <p class="text-xs text-slate-500 font-medium">Input kehadiran tatap muka untuk murid kelas offline.</p>
            </div>
          </div>

          <div class="flex flex-col gap-4">

            <!-- Nama Siswa -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap Siswa</label>
              <input
                v-model="newStudentName"
                type="text"
                placeholder="Masukkan 1 Nama Siswa..."
                class="w-full border border-slate-300 focus:border-emerald-500 rounded-xl p-3 bg-slate-50 outline-none font-medium text-slate-800 transition-colors text-sm"
              >
            </div>

            <!-- Asal Kurikulum -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Asal Kurikulum</label>
              <select
                v-model="selectedMaterialForManualId"
                class="w-full border border-slate-300 focus:border-emerald-500 rounded-xl p-3 bg-slate-50 outline-none font-medium text-slate-800 transition-colors cursor-pointer text-sm"
              >
                <option value="" disabled>-- Pilih Kurikulum --</option>
                <option v-for="mat in materialsList" :key="mat.id" :value="mat.id">{{ mat.title }}</option>
              </select>
            </div>

            <!-- Tombol -->
            <button
              @click="handleManualPresence"
              class="w-full shadow border border-emerald-600 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-yellow-300 font-poppins font-bold text-sm p-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 mt-1"
            >
              Catat Kehadiran ✓
            </button>

          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.popup-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popup-leave-active { transition: all 0.25s ease-in; }
.popup-enter-from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
.popup-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.95); }

.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.25s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

.modal-pop-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-leave-active { transition: all 0.2s ease-in; }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }
</style>