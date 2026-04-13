<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from './stores/mainStore'
import WelcomeScreen from './views/public/WelcomeScreen.vue'

const store = useMainStore()
const showWelcome = ref(true)

onMounted(() => {
  store.fetchMaterials()
  store.fetchStudentResults()
  store.fetchCategories()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 relative">
    <div v-if="store.loading" class="absolute top-0 left-0 w-full bg-blue-500 text-white text-center py-1 text-xs z-50">
      Menyinkronisasi data ke Supabase...
    </div>

    <!-- Welcome Screen muncul di atas segalanya setiap buka app -->
    <WelcomeScreen v-if="showWelcome" @done="showWelcome = false" />

    <router-view v-else />
  </div>
</template>