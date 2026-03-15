<script setup>
import { computed } from 'vue'
import { useMainStore } from '../../stores/mainStore'

const store = useMainStore()
const materials = computed(() => store.materials)
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Materi Pembelajaran (Siswa)</h1>
    
    <div class="grid gap-4">
      <div 
        v-for="mat in materials" 
        :key="mat.id"
        class="border p-4 rounded-lg bg-white shadow flex justify-between items-center"
      >
        <span class="text-lg font-medium">{{ mat.title }}</span>
        <router-link :to="`/materi/${mat.id}`" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Lihat Materi
        </router-link>
      </div>
    </div>
  </div>
</template>
