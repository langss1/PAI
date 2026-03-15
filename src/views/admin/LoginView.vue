<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  // Simulasi Login (Nanti ganti dengan Supabase Auth)
  if(email.value === 'admin@sekolah.com' && password.value === 'admin123') {
    alert("Login Sukses!")
    router.push('/admin/dashboard')
  } else {
    alert("Email atau password salah. Coba gunakan (admin@sekolah.com / admin123)")
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Login Guru</h1>
        <p class="text-slate-500 mt-2">Akses ke Dashboard Manajemen LMS</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="guru@sekolah.com"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Password Akses</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transform transition hover:scale-[1.02] shadow-lg mt-8"
        >
          Masuk ke Dashboard
        </button>
      </form>
      
      <!-- Kemabli link -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-sm text-slate-500 hover:text-blue-600 underline">Batal, kembali ke Halaman Siswa</router-link>
      </div>
    </div>
  </div>
</template>
