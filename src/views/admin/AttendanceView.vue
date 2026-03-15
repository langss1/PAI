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

const handleManualPresence = async () => {
  if(!newStudentName.value || !selectedMaterialForManualId.value) {
    return alert('Harap masukkan Identitas Siswa dan Topik Kurikulum terlebih dahulu.')
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
  alert(`Alhamdulillah, data kehadiran ${matObj ? matObj.title : ''} berhasil ditambahkan!`)
}

const isSidebarOpen = ref(false)

const logout = () => {
  if(confirm("Apakah Anda yakin ingin menggembok dashboard guru?")) {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }
}

const handleDeleteAttendance = async (id) => {
  if(confirm("Apakah Anda yakin ingin menghapus catatan nilai siswa ini?")) {
    await store.deleteStudentResult(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">
    
    <!-- Mobile Header (Hanya tampil di HP) -->
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

    <!-- Sidebar / Navigasi Admin Beranimasi -->
    <div 
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 animate-gradient animate-fadeInLeft text-white p-8 flex flex-col shadow-2xl overflow-y-auto"
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
    >
      <!-- Ornamen Dekoratif Islami Beranimasi -->
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40 animate-blob1"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30 animate-blob2"></div>
      
      <div class="hidden md:flex items-center gap-3 mb-10 relative z-10 transition-transform">
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
      </ul>

      <div class="mt-12 pt-6 border-t border-emerald-700/50 relative z-10">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 hover:text-white bg-red-900/40 hover:bg-red-600 p-4 rounded-xl transition-all text-left font-bold shadow hover:shadow-lg hover:-translate-y-1 border border-red-800/30">
          <span class="text-xl">🔒</span> Log Keluar
        </button>
      </div>
    </div>
    
    <!-- Mobile Overlay Black -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Konten Utama Absensi & Nilai -->
    <div class="flex-grow p-6 md:p-10 lg:p-14 relative w-full lg:max-w-[1400px] overflow-y-auto">
      
      <!-- Ornamen Dekoratif di Konten -->
      <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-9xl">🌿</div>
      
      <div class="mb-10 text-center xl:text-left flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 animate-fadeInDown">
        <div class="relative z-10 w-full xl:w-auto text-left">
          <h1 class="text-4xl md:text-5xl font-poppins font-bold text-emerald-900 mb-2">Data Kehadiran & Nilai PAI</h1>
          <p class="text-emerald-700 font-medium text-lg max-w-xl">Lacak kehadiran siswa beserta hasil nilai evaluasi pembelajaran secara Real-Time.</p>
        </div>
        
        <div class="relative z-10 w-full xl:w-auto">
          <div class="bg-white px-5 py-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
            <div class="flex-grow">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Berdasar Kurikulum</label>
              <select v-model="filterMaterial" class="w-full bg-transparent border-none focus:ring-0 text-emerald-900 font-bold outline-none p-0 cursor-pointer text-sm">
                <option value="">Semua Materi</option>
                <option v-for="mat in materialsList" :key="mat.id" :value="mat.title">{{ mat.title }}</option>
              </select>
            </div>
            <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-800 text-sm">
              {{ students.filter(s => filterMaterial ? s.materialTitle === filterMaterial : true).length }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabel Report Nilai -->
      <div class="bg-white rounded-2xl border border-slate-200 mb-12 overflow-hidden z-10 relative animate-slideUp">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th class="p-5 font-bold pl-8 text-sm">Identitas Siswa</th>
                <th class="p-5 font-bold text-sm">Kurikulum Terselesaikan</th>
                <th class="p-5 font-bold text-center text-sm">Keterangan</th>
                <th class="p-5 font-bold text-center pr-8 text-sm">Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="(student, idx) in students.filter(s => filterMaterial ? s.materialTitle === filterMaterial : true)" 
                :key="student.id" 
                class="hover:bg-slate-50 transition-colors group"
              >
                <td class="p-5 pl-8">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center uppercase">
                      {{ student.name.charAt(0) || '?' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-base">{{ student.name }}</p>
                      <p class="text-xs font-medium text-slate-500 mt-1">Disinkronisasi</p>
                    </div>
                  </div>
                </td>
                <td class="p-5">
                  <p class="font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block text-sm max-w-[200px] truncate">
                    {{ student.materialTitle }}
                  </p>
                </td>
                <td class="p-5 text-center">
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center" 
                        :class="student.score > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ student.score > 0 ? 'Lulus Kuis' : student.status }}
                  </span>
                </td>
                <td class="p-5 pr-8 text-center">
                  <div class="w-12 h-12 mx-auto rounded-xl flex items-center justify-center border mb-2" :class="student.score >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'">
                    <span class="font-bold text-lg font-mono">{{ student.score }}</span>
                  </div>
                  <button @click="handleDeleteAttendance(student.id)" class="text-xs font-bold text-red-500 hover:text-red-700 hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="students.filter(s => filterMaterial ? s.materialTitle === filterMaterial : true).length === 0">
                <td colspan="4" class="p-16 text-center bg-slate-50">
                  <div class="text-4xl mb-3 opacity-40">📝</div>
                  <p class="text-slate-600 font-bold text-base">Data presensi masih kosong.</p>
                  <p class="text-slate-500 text-sm mt-1">Belum ada siswa yang lulus atau diinput untuk tajuk ini.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fitur Input Absensi Manual Terintegrasi -->
      <div class="bg-white rounded-2xl border border-slate-200 p-8 z-10 relative">
        <div class="flex items-center gap-4 mb-4 border-b border-slate-100 pb-5">
          <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold font-poppins">✍️</div>
          <div>
            <h3 class="text-xl font-bold font-poppins text-emerald-900">Input Kehadiran Manual</h3>
            <p class="text-sm text-slate-500 font-medium">Input kehadiran tatap muka untuk murid yang mengikuti kelas offline.</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 mt-6 items-end">
          <div class="md:col-span-4">
            <label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap Siswa</label>
            <input v-model="newStudentName" type="text" placeholder="Masukkan 1 Nama Siswa..." class="w-full border border-slate-300 focus:border-emerald-500 rounded-lg p-3 bg-slate-50 outline-none font-medium text-slate-800 transition-colors">
          </div>
          
          <div class="md:col-span-5">
            <label class="block text-sm font-bold text-slate-700 mb-2">Asal Kurikulum</label>
            <select v-model="selectedMaterialForManualId" class="w-full border border-slate-300 focus:border-emerald-500 rounded-lg p-3 bg-slate-50 outline-none font-medium text-slate-800 transition-colors cursor-pointer">
              <option value="" disabled>-- Pilih Kurikulum --</option>
              <option v-for="mat in materialsList" :key="mat.id" :value="mat.id">{{ mat.title }}</option>
            </select>
          </div>
          
          <div class="md:col-span-3">
            <button @click="handleManualPresence" class="w-full shadow border border-emerald-600 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-yellow-300 font-poppins font-bold text-base p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:ring-4 focus:ring-emerald-500/20">
              Catat Kehadiran ✓
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
