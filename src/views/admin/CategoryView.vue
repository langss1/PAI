<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../stores/mainStore'

const router = useRouter()
const store = useMainStore()

const logoDataUrl = 'data:image/png;base64,...' // tetap sama seperti sebelumnya

const isSidebarOpen = ref(false)
const newCategoryName = ref('')
const newCategoryImage = ref('')
const selectedCategoryId = ref('')
const selectedMaterialIds = ref([])

const confirmLogout = ref(false)

const popup = ref({ show: false, message: '', type: 'success' })
const showPopup = (message, type = 'success') => {
  popup.value = { show: true, message, type }
  setTimeout(() => { popup.value.show = false }, 3000)
}

const confirmDelete = ref({ show: false, id: null })
const askDeleteCategory = (id) => {
  confirmDelete.value = { show: true, id }
}

const categories = computed(() => store.categories)
const materials = computed(() => store.materials)

const selectedCategory = computed(() => {
  return categories.value.find(c => c.id === selectedCategoryId.value)
})

const handleCategoryImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const img = new Image()
  const reader = new FileReader()

  reader.onload = (event) => {
    img.src = event.target.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 800
      const scaleSize = MAX_WIDTH / img.width
      canvas.width = MAX_WIDTH
      canvas.height = img.height * scaleSize

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      newCategoryImage.value = canvas.toDataURL('image/jpeg', 0.7)
    }
  }
  reader.readAsDataURL(file)
}

const handleCategorySelect = () => {
  if (!selectedCategory.value) {
    selectedMaterialIds.value = []
    return
  }
  selectedMaterialIds.value = materials.value
    .filter(m => m.category === selectedCategory.value.name)
    .map(m => m.id)
}

const handleAddCategory = async () => {
  if (!newCategoryName.value) return
  const cleanName = newCategoryName.value.replace('#', '').trim()
  const success = await store.addCategory(cleanName, newCategoryImage.value)
  if (success) {
    newCategoryName.value = ''
    newCategoryImage.value = ''
    showPopup('Bab berhasil ditambahkan!', 'success')
  }
}

const doDeleteCategory = async () => {
  const id = confirmDelete.value.id
  if (!id) return
  
  await store.deleteCategory(id)
  if (selectedCategoryId.value === id) {
    selectedCategoryId.value = ''
    selectedMaterialIds.value = []
  }
  confirmDelete.value.show = false
  showPopup('Bab telah dihapus.', 'success')
}

const handleSaveAssignment = async () => {
  if (!selectedCategory.value) {
    showPopup('Pilih bab terlebih dahulu!', 'warning')
    return
  }

  const materialsToUpdate = selectedMaterialIds.value
  const materialsToClear = materials.value
    .filter(m => m.category === selectedCategory.value.name && !selectedMaterialIds.value.includes(m.id))
    .map(m => m.id)

  const success = await store.updateBulkMaterialCategories(materialsToUpdate, selectedCategory.value.name)
  if (success) {
    if (materialsToClear.length > 0) {
      await store.removeCategoryFromMaterials(materialsToClear)
    }
    showPopup('Pembaruan bab berhasil disimpan!', 'success')
  }
}

const logout = () => {
  confirmLogout.value = true
}

const doLogout = () => {
  localStorage.removeItem('admin_auth')
  router.push('/admin/login')
}

onMounted(async () => {
  await store.fetchCategories()
  await store.fetchMaterials()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner text-slate-800 w-full relative">

    <!-- Popup Notifikasi Global -->
    <transition name="fade">
      <div v-if="popup.show" class="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-4">
        <div
          class="px-8 py-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center gap-3 border-2 backdrop-blur-xl animate-scaleUp pointer-events-auto max-w-sm w-full"
          :class="popup.type === 'success' ? 'bg-emerald-900/90 border-emerald-400 text-white' : (popup.type === 'warning' ? 'bg-yellow-600/90 border-yellow-400 text-white' : 'bg-red-900/90 border-red-500 text-white')"
        >
          <span class="text-4xl">{{ popup.type === 'success' ? '✨' : '⚠️' }}</span>
          <div>
            <p class="font-black text-lg tracking-wide mb-1">{{ popup.type === 'success' ? 'Berhasil' : 'Peringatan' }}</p>
            <p class="font-medium text-sm opacity-90">{{ popup.message }}</p>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Konfirmasi Hapus Kategori -->
    <transition name="fade">
      <div v-if="confirmDelete.show" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-sm:w-full max-w-sm p-8 flex flex-col items-center text-center gap-5 animate-scaleUp">
          <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl">🗑️</div>
          <div>
            <h3 class="text-2xl font-black text-slate-800 mb-2">Hapus Bab?</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Bab ini akan dihapus dari semua materi yang menggunakannya. Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div class="flex gap-3 w-full mt-2">
            <button @click="confirmDelete.show = false" class="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 transition-all">Batal</button>
            <button @click="doDeleteCategory" class="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Logout Overlay -->
    <transition name="fade">
      <div v-if="confirmLogout" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4 animate-scaleUp">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">🔒</div>
          <h3 class="text-xl font-black text-slate-800">Keluar dari Portal?</h3>
          <p class="text-slate-500 text-sm">Sesi guru akan diakhiri. Anda perlu login kembali untuk mengakses dashboard.</p>
          <div class="flex gap-3 w-full mt-2">
            <button @click="confirmLogout = false" class="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Batal</button>
            <button @click="doLogout" class="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all">Ya, Keluar</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Header -->
    <div class="md:hidden bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-full overflow-hidden bg-white border-2 border-emerald-100 shadow flex items-center justify-center">
          <img :src="logoDataUrl" alt="PAI HUB Logo" class="w-full h-full object-contain p-0.5" />
        </div>
        <h2 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 tracking-wide">Portal Guru</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="text-yellow-400 p-2 focus:outline-none">
        <svg v-if="!isSidebarOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Mobile Sidebar Backdrop -->
    <transition name="fade">
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"></div>
    </transition>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-gradient-to-br from-emerald-800 via-emerald-900 to-yellow-600 animate-gradient animate-fadeInLeft text-white flex flex-col shadow-2xl overflow-hidden"
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
    >
      <div class="absolute -top-[20%] -right-[10%] w-[350px] h-[350px] bg-emerald-600 rounded-full blur-[80px] opacity-40 animate-blob1"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-30 animate-blob2"></div>

      <!-- Sidebar Header -->
      <div class="px-8 pt-8 pb-4 hidden md:flex items-center gap-3 relative z-10 flex-shrink-0">
        <div class="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-emerald-100 shadow-lg flex items-center justify-center flex-shrink-0">
          <img :src="logoDataUrl" alt="PAI HUB Logo" class="w-full h-full object-contain p-1" />
        </div>
        <div>
          <h2 class="text-2xl font-poppins font-bold text-white tracking-wide">Portal Guru</h2>
          <p class="text-xs text-emerald-100 font-medium">PAI HUB</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-grow overflow-y-auto px-8 py-6 relative z-10">
        <ul class="space-y-4 text-[15px] font-bold tracking-wide">
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
            <router-link to="/admin/kuis" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
              <span class="text-xl">🎓</span> Kelola Kuis Global
            </router-link>
          </li>
          <li>
            <router-link to="/admin/kehadiran" @click="isSidebarOpen = false" class="flex items-center gap-4 text-emerald-100 hover:text-white hover:bg-emerald-700/30 p-4 rounded-xl transition-all hover:-translate-y-1">
              <span class="text-xl">📊</span> Data Nilai Siswa
            </router-link>
          </li>
          <li>
            <router-link to="/admin/kategori" @click="isSidebarOpen = false" class="flex items-center gap-4 text-white bg-emerald-700/60 p-4 rounded-xl shadow-inner border border-emerald-500/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <span class="text-xl">🏷️</span> Kelola Bab
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Logout Button -->
      <div class="px-8 py-6 border-t border-emerald-700/50 relative z-10 flex-shrink-0">
        <button @click="logout" class="w-full flex items-center justify-center gap-3 text-red-100 hover:text-white bg-red-900/40 hover:bg-red-600 p-4 rounded-xl transition-all font-bold shadow hover:shadow-lg hover:-translate-y-1 border border-red-800/30">
          <span class="text-xl">🔒</span> Log Out
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow p-4 md:p-10 lg:p-14 relative w-full lg:max-w-[1400px] overflow-x-hidden">

      <div class="mb-10 animate-fadeInDown">
        <h1 class="text-3xl md:text-5xl font-poppins font-bold text-emerald-900 mb-2 leading-tight">Kelola Bab Pembelajaran</h1>
        <p class="text-emerald-700 font-medium text-base md:text-lg leading-relaxed">Buat bab baru dengan gambar cover dan tentukan materi mana saja yang masuk ke topik tersebut.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-10">

        <!-- Section 1: Manage Categories List -->
        <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-8 animate-slideUp">
          <div class="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold">🏷️</div>
            <h2 class="text-2xl font-bold text-emerald-900 font-poppins">Daftar Bab (Chapter)</h2>
          </div>

          <!-- Form Tambah Bab -->
          <div class="flex flex-col gap-3">
            <!-- Nama Bab + Tombol -->
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="Contoh: dakwah, sunan, fiqih"
                class="flex-grow bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-4 outline-none transition-all font-medium text-sm md:text-base"
                @keyup.enter="handleAddCategory"
              >
              <button
                @click="handleAddCategory"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 sm:py-0 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
              >
                Tambah Bab
              </button>
            </div>

            <!-- Upload Gambar Cover Bab -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Gambar Cover Bab <span class="text-slate-400 font-normal normal-case">(opsional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleCategoryImageUpload"
                class="w-full text-slate-700 font-medium text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              >
              <!-- Preview gambar -->
              <div v-if="newCategoryImage" class="mt-3 flex items-center gap-3">
                <img :src="newCategoryImage" class="w-16 h-16 object-cover rounded-lg border border-emerald-200 shadow-sm" />
                <div>
                  <p class="text-xs font-bold text-emerald-600">✓ Gambar siap diupload</p>
                  <button
                    @click="newCategoryImage = ''"
                    class="text-xs text-red-400 hover:text-red-600 font-semibold mt-1 transition-colors"
                  >
                    Hapus gambar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Daftar Bab -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[400px] p-1">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              <!-- Thumbnail gambar bab -->
              <div v-if="cat.image_url" class="h-24 w-full overflow-hidden">
                <img :src="cat.image_url" class="w-full h-full object-cover" />
              </div>
              <!-- Placeholder jika tidak ada gambar -->
              <div v-else class="h-16 w-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-2xl opacity-50">
                🕌
              </div>

              <div class="p-3 flex justify-between items-center font-bold text-slate-700">
                <span class="truncate pr-2 text-sm">#{{ cat.name }}</span>
                <button
                  @click="askDeleteCategory(cat.id)"
                  class="text-slate-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all p-1 flex-shrink-0"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="categories.length === 0" class="col-span-full py-10 text-center text-slate-400 font-medium italic">
              Belum ada bab ditambahkan.
            </div>
          </div>
        </div>

        <!-- Section 2: Assign Materials to Category -->
        <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6 animate-slideUp [animation-delay:0.2s]">
          <div class="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div class="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xl font-bold">📌</div>
            <h2 class="text-2xl font-bold text-emerald-900 font-poppins">Penetapan Bab Massal</h2>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">1. Pilih Bab Target</label>
            <select
              v-model="selectedCategoryId"
              @change="handleCategorySelect"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-4 outline-none transition-all font-bold text-emerald-900 appearance-none"
            >
              <option value="">-- Pilih Bab --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">#{{ cat.name }}</option>
            </select>
          </div>

          <div v-if="selectedCategoryId">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-3">2. Centang Materi yang Ingin Dimasukkan</label>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
              <div class="max-h-[400px] overflow-y-auto divide-y divide-slate-200">
                <label
                  v-for="mat in materials"
                  :key="mat.id"
                  class="flex items-center gap-4 p-4 hover:bg-emerald-50 cursor-pointer transition-all group"
                >
                  <div class="relative flex items-center">
                    <input
                      type="checkbox"
                      :value="mat.id"
                      v-model="selectedMaterialIds"
                      class="w-6 h-6 rounded border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                    >
                  </div>
                  <div class="flex-grow">
                    <p class="font-bold text-slate-800 group-hover:text-emerald-900 transition-all">{{ mat.title }}</p>
                    <p class="text-xs font-medium" :class="mat.category === selectedCategory?.name ? 'text-emerald-600' : 'text-slate-400'">
                      {{ mat.category ? '#' + mat.category : 'Tanpa Bab' }}
                    </p>
                  </div>
                </label>
                <div v-if="materials.length === 0" class="p-10 text-center text-slate-400 italic">
                  Belum ada materi untuk dimasukkan ke bab.
                </div>
              </div>
            </div>

            <button
              @click="handleSaveAssignment"
              class="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Simpan Perubahan Bab</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-20 text-center text-slate-300 gap-4 grayscale opacity-50">
            <div class="text-6xl">🖱️</div>
            <p class="font-bold">Pilih salah satu bab di atas untuk mulai<br>mengelompokkan materi PAI.</p>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<style scoped>
.animate-gradient {
  background-size: 200% 200%;
  animation: bg-shift 10s infinite alternate;
}
@keyframes bg-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.animate-scaleUp {
  animation: scaleUp 0.3s ease-out forwards;
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeInDown {
  animation: fadeInDown 0.5s ease-out;
}
</style>