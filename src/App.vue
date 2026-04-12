<script setup>
import { onMounted } from 'vue'
import { useMainStore } from './stores/mainStore'

const store = useMainStore()

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
    <router-view></router-view>
  </div>
</template>
