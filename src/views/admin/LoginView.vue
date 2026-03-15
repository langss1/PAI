<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()
const isLoading = ref(false)

// Fungsi hash SHA-256 bawaan JavaScript untuk keamanan (Web Crypto API)
const hashPassword = async (text) => {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  
  // Hash dari password "adm1n"
  const expectedHash = await hashPassword('adm1n')
  const inputHash = await hashPassword(password.value)

  setTimeout(() => {
    // Memverifikasi username "admin" dan password yang telah di hash (Encrypted Match)
    if(username.value === 'admin' && inputHash === expectedHash) {
      // Simpan auth token
      localStorage.setItem('admin_auth', 'secure_token_abc123')
      router.push('/admin/dashboard')
    } else {
      errorMsg.value = "Nama User atau Kata Sandi yang dimasukan salah."
    }
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="fixed inset-0 min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden text-slate-800">
    
    <!-- Latar Belakang Eksklusif EduCivIslam Theme -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
      <!-- Gradient Bulat Hijau Tua & Emas Beranimasi Blur Float -->
      <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-yellow-400 to-emerald-600 rounded-full blur-[100px] animate-blob1"></div>
      <div class="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-emerald-800 to-teal-900 rounded-full blur-[120px] animate-blob2"></div>
      <!-- Pola Bintang Siluet -->
      <div class="absolute top-[15%] left-[10%] text-9xl text-emerald-900 opacity-10 rotate-45">☪️</div>
      <div class="absolute bottom-[10%] right-[10%] text-[15rem] text-yellow-600 opacity-5">🕌</div>
    </div>

    <!-- Kotak Login Utama -->
    <div class="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 md:p-14 animate-slideUp">
      
      <!-- Kepala Form -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-800 rounded-full mb-6">
          <span class="text-yellow-400 text-4xl z-10 font-bold">🕌</span>
        </div>
        <h1 class="text-4xl lg:text-5xl font-poppins font-bold text-emerald-900 tracking-tight leading-tight">EduCivIslam</h1>
        <p class="text-emerald-700 font-medium mt-3 text-lg tracking-wide uppercase">Portal Guru PAI</p>
      </div>

      <!-- Form Entri -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div class="space-y-2">
          <label class="block text-sm font-bold text-emerald-900 tracking-widest uppercase">Nama User</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
              <span class="text-emerald-600 text-lg">👤</span>
            </div>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Masukkan nama user..."
              class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-emerald-100 focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-500/20 rounded-xl outline-none transition-all duration-300 text-emerald-900 font-semibold"
              required
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-emerald-900 tracking-widest uppercase">Kata Sandi</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
              <span class="text-emerald-600 text-lg">🔑</span>
            </div>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Masukkan kata sandi..."
              class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-emerald-100 focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-500/20 rounded-xl outline-none transition-all duration-300 text-emerald-900 font-bold"
              required
            />
          </div>
          <p class="text-sm text-red-500 font-bold mt-2 h-5">{{ errorMsg }}</p>
        </div>

        <!-- Tombol Autentikasi -->
        <button 
          v-if="!isLoading"
          type="submit" 
          class="w-full bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-yellow-400 text-lg md:text-xl font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(4,120,87,0.6)] uppercase tracking-widest font-poppins"
        >
          Masuk Sekarang &rarr;
        </button>
        
        <button v-else disabled class="w-full bg-slate-200 text-slate-500 text-xl font-poppins font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-3">
          Memverifikasi Akses...
        </button>
      </form>
      
      <!-- Navigasi Bawah -->
      <div class="text-center mt-10">
        <router-link to="/" class="text-sm text-emerald-600 hover:text-yellow-600 font-bold flex items-center justify-center gap-2 group tracking-wide">
          <span class="transform transition group-hover:-translate-x-2 text-xl">🏠</span> 
          Kembali ke Dashboard Siswa
        </router-link>
      </div>
    </div>
  </div>
</template>
