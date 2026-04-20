import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useMainStore = defineStore('main', {
  state: () => ({
    materials: [],
    studentResults: [],
    categories: [],
    globalQuestions: [],
    loading: false
  }),
  
  actions: {
    // 1. Fetch Materi dari tabel `materials`
    async fetchMaterials() {
      this.loading = true
      // Jika error, tidak throw app ke white screen
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) {
          this.materials = data
        } else if (error) {
          console.error('Info Tim: Belum nyambung ke Supabase. Pesan:', error.message)
        }
      } catch (e) {
        console.warn('Gagal konek Supabase. Cek .env URL/KEY Asli!', e)
      } finally {
        this.loading = false
      }
    },

    // 1b. Fetch Kategori
    async fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
        if (data) {
          this.categories = data
        }
      } catch (e) {
        console.warn('Gagal load kategori: ', e)
      }
    },

    // 2. Fetch Nilai dari tabel `student_results`
    async fetchStudentResults() {
      try {
        const { data, error } = await supabase
          .from('student_results')
          .select(`
            *,
            materials (title)
          `)
          .order('created_at', { ascending: false })

        if (data) {
          // Flatten result biar sama kayak bentuk dummy MVP
          this.studentResults = data.map(result => ({
            id: result.id,
            name: result.student_name,
            score: result.score,
            materialTitle: result.materials?.title || 'Kuis Utama Global',
            status: result.score > 0 ? 'Selesai Kuis' : 'Hadir Manual'
          }))
        }
      } catch (e) {
        console.warn('Gagal ambil data rekap nilai Supabase', e)
      }
    },

    // 3. Tambah Materi ke Supabase (Oleh Guru)
    async addMaterial(materialPayload) {
      if(!materialPayload.title) return;
      this.loading = true
      
      const { questions, title, content, videoUrl, imageUrl, category } = materialPayload

      try {
        const payloadToInsert = { title, content, video_url: videoUrl, category }
        if(imageUrl) payloadToInsert.image_url = imageUrl

        const { data: newMat, error } = await supabase.from('materials').insert([payloadToInsert]).select()
        if (error) throw error

        await this.fetchMaterials() 
        return true
      } catch (e) {
        alert('Gagal simpan ke Supabase! Pastikan tabel "materials" sudah memiliki kolom "image_url". Error: ' + e.message)
        return false
      } finally {
        this.loading = false
      }
    },

    // 4. Update Materi (Oleh Guru)
    async updateMaterial(id, materialPayload) {
      if(!id || !materialPayload.title) return;
      this.loading = true
      
      const { questions, title, content, videoUrl, imageUrl, category } = materialPayload

      try {
        const payloadToUpdate = { title, content, video_url: videoUrl, category, updated_at: new Date() }
        if(imageUrl && !imageUrl.startsWith('blob:')) payloadToUpdate.image_url = imageUrl
        const { error } = await supabase.from('materials').update(payloadToUpdate).eq('id', id)
        if (error) throw error

        await this.fetchMaterials()
        return true
      } catch (e) {
        alert('Gagal update Materi! ' + e.message)
        return false
      } finally {
        this.loading = false
      }
    },

    // 5. Hapus Materi
    async deleteMaterial(id) {
      try {
        // Hapus data nilai/kehadiran terkait materi ini dulu (Integritas Data)
        await supabase.from('student_results').delete().eq('material_id', id)

        const { error } = await supabase.from('materials').delete().eq('id', id)
        if (error) throw error
        this.materials = this.materials.filter(m => m.id !== id)
      } catch (e) {
        alert('Gagal menghapus materi! ' + e.message)
      }
    },

    // 4. Input Nilai / Absen Manual ke Supabase
    async addStudentResult(payload) {
      // payload struktur: name, score, materialId (opsional), status, materialTitle
      try {
        const { data, error } = await supabase
          .from('student_results')
          .insert([{
            student_name: payload.name,
            score: payload.score,
            material_id: payload.materialId || null
          }])
          .select()

        if (error) throw error
        
        if (data && data.length > 0) {
          const inserted = data[0]
          // Sync balik ke UI 
          this.studentResults.unshift({
            id: inserted.id,
            name: inserted.student_name,
            score: inserted.score,
            materialTitle: payload.materialTitle,
            status: payload.status
          })
        }
      } catch (e) {
        alert('Gagal lapor nilai ke Supabase! ' + e.message)
      }
    },

    // 6. Hapus Data Kehadiran / Nilai
    async deleteStudentResult(id) {
      if(!id) return;
      this.loading = true
      try {
        const { error } = await supabase.from('student_results').delete().eq('id', id)
        if (error) throw error
        this.studentResults = this.studentResults.filter(r => r.id !== id)
      } catch (e) {
        alert('Gagal menghapus data kehadiran: ' + e.message)
      } finally {
        this.loading = false
      }
    },

    // 7. Tambah Kategori
    async addCategory(name, imageUrl = '') {
      if (!name) return false
      try {
        // Step 1: Insert name dulu tanpa image_url
        const { data, error } = await supabase
          .from('categories')
          .insert([{ name }])
          .select('id, name, created_at')

        if (error) throw error

        if (data && data.length > 0) {
          const newCat = { ...data[0], image_url: null }

          // Step 2: Jika ada gambar, update pakai .update() terpisah
          if (imageUrl) {
            const { error: updateError } = await supabase
              .from('categories')
              .update({ image_url: imageUrl })
              .eq('id', newCat.id)

            if (updateError) {
              // Kolom image_url belum ada / cache stale — tetap lanjut tanpa gambar
              console.warn('image_url belum bisa disimpan (schema cache). Coba reload app.', updateError.message)
            } else {
              newCat.image_url = imageUrl
            }
          }

          this.categories.unshift(newCat)
          return true
        }
      } catch (e) {
        alert('Gagal tambah kategori: ' + e.message)
        return false
      }
    },

    // 8. Hapus Kategori
    async deleteCategory(id) {
      try {
        const categoryToDelete = this.categories.find(c => c.id === id)
        if (categoryToDelete) {
          // Clear kategori di tabel materials
          await supabase.from('materials').update({ category: null }).eq('category', categoryToDelete.name)
        }

        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
        this.categories = this.categories.filter(c => c.id !== id)
        await this.fetchMaterials() // Refresh materials to reflect changes
      } catch (e) {
        alert('Gagal hapus kategori: ' + e.message)
      }
    },

    // 9. Update Bulk Kategori Materi
    async updateBulkMaterialCategories(materialIds, categoryName) {
      try {
        // Hapus kategori dari materi yang sebelumnya memilikinya, namun tidak dicentang (Opsional, tergantung logika)
        // Disini logikanya update specific materials
        for (const id of materialIds) {
          await supabase.from('materials').update({ category: categoryName }).eq('id', id)
        }
        await this.fetchMaterials() // reload materi
        return true
      } catch (e) {
        alert('Gagal set kategori ke materi: ' + e.message)
        return false
      }
    },

    // 10. Clear Category for materials missing from list
    async removeCategoryFromMaterials(materialIds) {
      try {
        for (const id of materialIds) {
          await supabase.from('materials').update({ category: null }).eq('id', id)
        }
        await this.fetchMaterials()
      } catch (e) {
        console.error(e)
      }
    },

    // 11. Fetch Kuis Global
    async fetchGlobalQuestions() {
      try {
        const { data, error } = await supabase.from('global_quiz_questions').select('*').order('created_at', { ascending: true })
        if (data) this.globalQuestions = data
      } catch (e) {
        console.error('Gagal fetch kuis global:', e)
      }
    },

    // 12. Update Bulk Kuis Global
    async saveGlobalQuestions(questions) {
      this.loading = true
      try {
        // Hapus semua lalu insert ulang untuk simplisitas bulk update
        await supabase.from('global_quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Trick delete all

        const formatted = questions
          .filter(q => q.text && q.text.trim() !== '')
          .map(q => ({
            question_text: q.text,
            option_a: q.optionA,
            option_b: q.optionB,
            option_c: q.optionC,
            option_d: q.optionD,
            correct_option: q.correctAnswer
          }))
        
        if (formatted.length > 0) {
          const { error } = await supabase.from('global_quiz_questions').insert(formatted)
          if (error) throw error
        }
        await this.fetchGlobalQuestions()
        return true
      } catch (e) {
        alert('Gagal simpan kuis: ' + e.message)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
