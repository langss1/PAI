import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useMainStore = defineStore('main', {
  state: () => ({
    materials: [],
    studentResults: [],
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
          for (let m of this.materials) {
            // Ambil kuis untuk prepopulate edit
            const { data: qData } = await supabase.from('quiz_questions').select('*').eq('material_id', m.id)
            if (qData) m.quiz_questions = qData
          }
        } else if (error) {
          console.error('Info Tim: Belum nyambung ke Supabase. Pesan:', error.message)
        }
      } catch (e) {
        console.warn('Gagal konek Supabase. Cek .env URL/KEY Asli!', e)
      } finally {
        this.loading = false
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
            materialTitle: result.materials?.title || 'Unknown Material',
            status: result.score > 0 ? 'Hadir via Kuis' : 'Hadir Manual'
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
      
      const { questions, title, content, videoUrl, imageUrl } = materialPayload

      try {
        const payloadToInsert = { title, content, video_url: videoUrl }
        if(imageUrl) payloadToInsert.image_url = imageUrl

        const { data: newMat, error } = await supabase.from('materials').insert([payloadToInsert]).select()
        if (error) throw error

        if (newMat && newMat.length > 0) {
          const materialId = newMat[0].id
          if (questions && questions.length > 0) {
            const formattedQuestions = questions
              .filter(q => q.text.trim() !== '')
              .map(q => ({
                material_id: materialId,
                question_text: q.text,
                option_a: q.optionA,
                option_b: q.optionB,
                option_c: q.optionC,
                option_d: q.optionD,
                correct_option: q.correctAnswer
              }))
            
            if(formattedQuestions.length > 0) {
              await supabase.from('quiz_questions').insert(formattedQuestions)
            }
          }
          await this.fetchMaterials() // Refresh State
        }
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
      
      const { questions, title, content, videoUrl, imageUrl } = materialPayload

      try {
        const payloadToUpdate = { title, content, video_url: videoUrl, updated_at: new Date() }
        if(imageUrl && !imageUrl.startsWith('blob:')) payloadToUpdate.image_url = imageUrl

        const { error } = await supabase.from('materials').update(payloadToUpdate).eq('id', id)
        if (error) throw error

        // Hapus soal lama lalu ganti dengan yang baru (metode termudah untuk bulk update kuis)
        await supabase.from('quiz_questions').delete().eq('material_id', id)

        if (questions && questions.length > 0) {
          const formattedQuestions = questions
            .filter(q => q.text.trim() !== '')
            .map(q => ({
              material_id: id,
              question_text: q.text,
              option_a: q.optionA,
              option_b: q.optionB,
              option_c: q.optionC,
              option_d: q.optionD,
              correct_option: q.correctAnswer
            }))
          
          if(formattedQuestions.length > 0) {
            await supabase.from('quiz_questions').insert(formattedQuestions)
          }
        }
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
    }
  }
})
