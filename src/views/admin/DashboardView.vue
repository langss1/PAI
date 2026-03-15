<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const materials = computed(() => store.materials)

const showAddModal = ref(false)
const newMaterial = ref({ title: '', content: '' })

const saveMaterial = () => {
  if (!newMaterial.value.title) return alert('Isi judul!')
  
  // Tambah materi ke global store
  store.addMaterial({ 
    id: Date.now().toString(), 
    title: newMaterial.value.title,
    content: newMaterial.value.content || 'Isi tidak tersedia.'
  })
  
  showAddModal.value = false
  newMaterial.value = { title: '', content: '' }
  alert('Materi berhasil ditambahkan ke dashboard siswa.')
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
    
    <!-- Sidebar / Navigasi Admin -->
    <div class="w-full md:w-64 bg-slate-800 text-white rounded-lg p-6 flex-shrink-0">
      <h2 class="text-xl font-bold mb-8">Admin Guru</h2>
      <ul class="space-y-4">
        <li><router-link to="/admin/dashboard" class="block hover:bg-slate-700 p-2 rounded">Dashboard & Materi</router-link></li>
        <li><router-link to="/admin/materi/tambah" class="block hover:bg-slate-700 p-2 rounded">Buat Materi & Kuis</router-link></li>
        <li><router-link to="/admin/kehadiran" class="block hover:bg-slate-700 p-2 rounded">Nilai & Kehadiran</router-link></li>
        <li class="mt-8 pt-4 border-t border-slate-600"><router-link to="/" class="block text-gray-300 hover:text-white">&larr; Keluar ke Siswa</router-link></li>
      </ul>
    </div>

    <!-- Konten Utama Dashboard -->
    <div class="flex-grow bg-white p-6 rounded-lg shadow min-h-[500px]">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Daftar Materi Aktif</h1>
        <button @click="showAddModal = true" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">+ Tambah Cepat</button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 border-b">
              <th class="p-3 font-semibold">Judul Materi</th>
              <th class="p-3 font-semibold text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mat in materials" :key="mat.id" class="border-b hover:bg-slate-50">
              <td class="p-3">{{ mat.title }}</td>
              <td class="p-3 text-center flex gap-2 justify-center">
                <button class="text-blue-500 hover:text-blue-700">Edit</button>
                <button class="text-red-500 hover:text-red-700">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal "Tambah Cepat" -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-4">Materi Baru</h3>
        <input v-model="newMaterial.title" type="text" class="w-full border p-2 mb-4 rounded" placeholder="Judul Materi...">
        <textarea v-model="newMaterial.content" class="w-full border p-2 mb-4 rounded h-32" placeholder="Isi materi..."></textarea>
        <div class="flex gap-2 justify-end">
          <button @click="showAddModal = false" class="bg-gray-200 px-4 py-2 rounded">Batal</button>
          <button @click="saveMaterial" class="bg-green-600 text-white px-4 py-2 rounded">Simpan Info</button>
        </div>
      </div>
    </div>
  </div>
</template>
