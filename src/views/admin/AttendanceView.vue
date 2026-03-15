<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()

// Ambil data nilai siswa dari store, dibalik urutannya biar yang baru diatas
const students = computed(() => [...store.studentResults].reverse())

const filterMaterial = ref('')
const newStudentName = ref('')
const selectedMaterialForManual = ref('')

const handleManualPresence = () => {
  if(!newStudentName.value || !selectedMaterialForManual.value) {
    return alert('Isi Nama dan Pilih Materi dulu ya!')
  }
  
  store.addStudentResult({
    id: Date.now().toString(),
    name: newStudentName.value,
    materialTitle: selectedMaterialForManual.value,
    score: 0,
    status: 'Manual (Tanpa Kuis)'
  })
  
  newStudentName.value = ''
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
    <!-- Sidebar / Navigasi Admin -->
    <div class="w-full md:w-64 bg-slate-800 text-white rounded-lg p-6 flex-shrink-0 min-h-screen">
      <h2 class="text-xl font-bold mb-8">Admin Guru</h2>
      <ul class="space-y-4">
        <li><router-link to="/admin/dashboard" class="block hover:bg-slate-700 p-2 rounded">Dashboard & Materi</router-link></li>
        <li><router-link to="/admin/materi/tambah" class="block hover:bg-slate-700 p-2 rounded">Buat Materi & Kuis</router-link></li>
        <li><router-link to="/admin/kehadiran" class="block bg-slate-700 p-2 rounded font-bold">Nilai & Kehadiran</router-link></li>
        <li class="mt-8 pt-4 border-t border-slate-600"><router-link to="/" class="block text-gray-300 hover:text-white">&larr; Keluar ke Siswa</router-link></li>
      </ul>
    </div>

    <!-- Konten Utama Absensi & Nilai -->
    <div class="flex-grow bg-white p-6 rounded-lg shadow min-h-[500px]">
      <div class="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 class="text-3xl font-bold">Rekap Nilai Kuis Siswa</h1>
        <div class="flex items-center gap-2">
          <label>Filter Materi: </label>
          <select v-model="filterMaterial" class="border p-2 rounded bg-slate-50">
            <option value="">Semua Materi</option>
            <option value="Belajar Vue 3">Belajar Vue 3</option>
            <option value="Pengenalan Supabase">Pengenalan Supabase</option>
          </select>
        </div>
      </div>
      
      <!-- Tabel Report Nilai -->
      <div class="overflow-x-auto shadow-sm border rounded-lg mb-8">
        <table class="w-full text-left border-collapse">
          <thead class="bg-indigo-600 text-white">
            <tr>
              <th class="p-3 font-semibold">Nama Siswa</th>
              <th class="p-3 font-semibold">Topik / Materi</th>
              <th class="p-3 font-semibold text-center">Status</th>
              <th class="p-3 font-semibold text-center">Nilai Kuis</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-b hover:bg-indigo-50 transition">
              <td class="p-3 font-medium">{{ student.name }}</td>
              <td class="p-3 text-sm text-gray-600">{{ student.materialTitle }}</td>
              <td class="p-3 text-center">
                <span class="px-2 py-1 rounded-full text-xs" 
                      :class="student.score > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ student.status }}
                </span>
              </td>
              <td class="p-3 text-center text-xl font-bold" :class="student.score >= 70 ? 'text-green-600' : 'text-red-500'">
                {{ student.score }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Fitur Input Absensi Manual (Sesuai Readme) -->
      <div class="border-t pt-8 mt-4">
        <h3 class="text-xl font-bold mb-4">Input Kehadiran Manual</h3>
        <p class="text-sm text-gray-600 mb-4">Fitur ini ditambahkan khusus untuk mencatat siswa yang hadir secara manual tanpa harus ikut kuis digital.</p>
        
        <div class="flex flex-col md:flex-row gap-4">
          <input v-model="newStudentName" type="text" placeholder="Nama Siswa..." class="border p-2 rounded flex-grow">
          <select v-model="selectedMaterialForManual" class="border p-2 rounded md:w-1/3">
            <option value="" disabled>-- Pilih Topik --</option>
            <option value="Belajar Vue 3">Belajar Vue 3</option>
            <option value="Pengenalan Supabase">Pengenalan Supabase</option>
          </select>
          <button @click="handleManualPresence" class="bg-slate-800 text-white px-6 py-2 rounded shadow hover:bg-slate-700">Catat Manual</button>
        </div>
      </div>

    </div>
  </div>
</template>
