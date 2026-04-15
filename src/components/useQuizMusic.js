// composables/useQuizMusic.js
import { ref, onUnmounted } from 'vue'

export function useQuizMusic() {
  let audioCtx = null
  let gainNode = null
  let currentNodes = []
  let loopTimeout = null
  const isPlaying = ref(false)
  const volume = ref(0.7)

    const tracks = {
    lobby: {
        notes: [261, 293, 329, 392, 440, 392, 329, 293],
        pattern: [0, 1, 2, 3, 4, 3, 2, 1],
        rhythm: 0.38,
        bpm: 80,
        type: 'sine'
    },
    quiz: {
        notes: [262, 294, 330, 349, 392, 440, 392, 349],
        pattern: [0, 2, 4, 2, 3, 5, 3, 1],
        rhythm: 0.32,
        bpm: 88,
        type: 'sine'
    },
    result: {
        notes: [262, 330, 392, 440, 523, 440, 392, 330],
        pattern: [0, 2, 4, 5, 4, 2, 0, 1],
        rhythm: 0.45,
        bpm: 70,
        type: 'sine'
        }
    }

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      gainNode = audioCtx.createGain()
      gainNode.gain.value = volume.value
      gainNode.connect(audioCtx.destination)
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()
  }

  function stopAll() {
    clearTimeout(loopTimeout)
    currentNodes.forEach(n => { try { n.stop() } catch (e) {} })
    currentNodes = []
  }

  function playTrack(trackKey) {
    initAudio()
    stopAll()
    const t = tracks[trackKey]
    const beatLen = 60 / t.bpm
    let startTime = audioCtx.currentTime + 0.05

    function scheduleLoop() {
      t.pattern.forEach((ni, i) => {
        const freq = t.notes[ni % t.notes.length]
        const osc = audioCtx.createOscillator()
        const env = audioCtx.createGain()
        osc.connect(env)
        env.connect(gainNode)
        osc.type = t.type
        osc.frequency.value = freq

        const noteStart = startTime + i * beatLen * t.rhythm
        const dur = beatLen * t.rhythm * 0.7

        env.gain.setValueAtTime(0, noteStart)
        env.gain.linearRampToValueAtTime(0.35, noteStart + 0.02)
        env.gain.exponentialRampToValueAtTime(0.001, noteStart + dur)

        osc.start(noteStart)
        osc.stop(noteStart + dur)
        currentNodes.push(osc)
      })

      const loopDuration = t.pattern.length * beatLen * t.rhythm
      startTime += loopDuration

      if (isPlaying.value) {
        loopTimeout = setTimeout(scheduleLoop, (loopDuration - 0.2) * 1000)
      }
    }
    scheduleLoop()
  }

  function play(trackKey = 'lobby') {
    isPlaying.value = true
    playTrack(trackKey)
  }

  function stop() {
    isPlaying.value = false
    stopAll()
  }

  function setVolume(val) {
    volume.value = val
    if (gainNode) gainNode.gain.value = val
  }

  onUnmounted(() => stop())

  return { isPlaying, volume, play, stop, setVolume }
}