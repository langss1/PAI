import { defineStore } from 'pinia'

// Fungsi bawaan untuk load dari localStorage (jika ada)
const loadState = (key, defaultVal) => {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : defaultVal
}

export const useMainStore = defineStore('main', {
  state: () => ({
    materials: loadState('pai-materials', [
      { id: '1', title: 'Belajar Vue 3', content: 'Vue 3 menggunakan Composition API.', videoUrl: '' },
    ]),
    studentResults: loadState('pai-results', [
      { id: '1', name: 'Budi Santoso', materialTitle: 'Belajar Vue 3', score: 90, status: 'Hadir' },
    ])
  }),
  actions: {
    addMaterial(material) {
      this.materials.push(material);
      localStorage.setItem('pai-materials', JSON.stringify(this.materials));
    },
    addStudentResult(result) {
      this.studentResults.push(result);
      localStorage.setItem('pai-results', JSON.stringify(this.studentResults));
    }
  }
})
