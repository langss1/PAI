<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const leaving = ref(false)

onMounted(() => {
  setTimeout(() => { visible.value = true }, 100)
})

const goHome = () => {
  leaving.value = true
  setTimeout(() => { router.push('/home') }, 600)
}
</script>

<template>
  <div
    class="welcome-screen"
    :class="{ visible, leaving }"
    @click="goHome"
  >
    <!-- Background pattern -->
    <div class="bg-pattern"></div>

    <!-- Decorative circles -->
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>

    <!-- Ornamental motif top -->
    <div class="ornament top-ornament">
      <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 4 L110 20 L100 36 L90 20 Z" fill="rgba(255,255,255,0.15)" />
        <path d="M70 4 L80 20 L70 36 L60 20 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M130 4 L140 20 L130 36 L120 20 Z" fill="rgba(255,255,255,0.08)" />
        <line x1="20" y1="20" x2="80" y2="20" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
        <line x1="120" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
        <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.25)" />
        <circle cx="180" cy="20" r="2" fill="rgba(255,255,255,0.25)" />
      </svg>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Logo badge -->
      <div class="logo-wrap">
        <div class="logo-badge">
          <span class="logo-pai">PAI</span>
        </div>
        <span class="logo-hub">HUB</span>
      </div>

      <!-- Bismillah text -->
      <p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

      <!-- Divider line -->
      <div class="divider">
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
      </div>

      <!-- Main title -->
      <h1 class="main-title">Sejarah Kebudayaan Islam</h1>

      <!-- Subtitle -->
      <p class="subtitle">
        Peran Tokoh Ulama Dalam Penyebaran Islam di Indonesia
      </p>
      <p class="subtitle-secondary">
        Metode Dakwah Islam Oleh Wali Songo di Tanah Jawa
      </p>

      <!-- Divider line -->
      <div class="divider" style="margin-top: 2rem;">
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
      </div>

      <!-- CTA Button -->
      <button class="cta-btn" @click.stop="goHome">
        <span>Mulai Belajar</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <p class="tap-hint">Ketuk di mana saja untuk melanjutkan</p>
    </div>

    <!-- Ornamental motif bottom -->
    <div class="ornament bottom-ornament">
      <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 4 L110 20 L100 36 L90 20 Z" fill="rgba(255,255,255,0.15)" />
        <path d="M70 4 L80 20 L70 36 L60 20 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M130 4 L140 20 L130 36 L120 20 Z" fill="rgba(255,255,255,0.08)" />
        <line x1="20" y1="20" x2="80" y2="20" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
        <line x1="120" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
        <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.25)" />
        <circle cx="180" cy="20" r="2" fill="rgba(255,255,255,0.25)" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* ─── Base ─────────────────────────────────────────── */
.welcome-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%);
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.welcome-screen.visible {
  opacity: 1;
  transform: scale(1);
}
.welcome-screen.leaving {
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* ─── Background pattern ────────────────────────────── */
.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 50%);
  pointer-events: none;
}

/* ─── Decorative circles ────────────────────────────── */
.deco {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.08);
  pointer-events: none;
}
.deco-1 {
  width: 500px; height: 500px;
  top: -200px; right: -200px;
  border-color: rgba(255,255,255,0.06);
}
.deco-2 {
  width: 300px; height: 300px;
  bottom: -100px; left: -100px;
  border-color: rgba(255,255,255,0.06);
}
.deco-3 {
  width: 200px; height: 200px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(255,255,255,0.05);
  animation: pulse-ring 4s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.15; }
}

/* ─── Ornaments ─────────────────────────────────────── */
.ornament { position: absolute; width: 200px; pointer-events: none; }
.top-ornament { top: 2rem; left: 50%; transform: translateX(-50%); }
.bottom-ornament { bottom: 2rem; left: 50%; transform: translateX(-50%); }

/* ─── Content ───────────────────────────────────────── */
.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
}

/* Logo */
.logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2rem;
  animation: fadeDown 0.8s ease 0.2s both;
}
.logo-badge {
  background: #fbbf24;
  border-radius: 10px;
  padding: 6px 10px;
}
.logo-pai {
  color: #064e3b;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.05em;
}
.logo-hub {
  color: white;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

/* Bismillah */
.bismillah {
  font-family: 'Times New Roman', serif;
  font-size: clamp(1.4rem, 5vw, 2rem);
  color: rgba(255,255,255,0.9);
  margin-bottom: 1.2rem;
  letter-spacing: 0.02em;
  animation: fadeDown 0.8s ease 0.35s both;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 280px;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.8s ease 0.45s both;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.25);
}
.divider-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  flex-shrink: 0;
}

/* Main title */
.main-title {
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 1.2rem;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  animation: fadeUp 0.8s ease 0.5s both;
}

/* Subtitle */
.subtitle {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.4rem;
  animation: fadeUp 0.8s ease 0.6s both;
}
.subtitle-secondary {
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  color: rgba(255,255,255,0.55);
  font-weight: 400;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 0;
  animation: fadeUp 0.8s ease 0.65s both;
}

/* CTA Button */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 2rem;
  padding: 14px 32px;
  background: #fbbf24;
  color: #064e3b;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(251,191,36,0.35);
  animation: fadeUp 0.8s ease 0.75s both;
  letter-spacing: 0.02em;
}
.cta-btn:hover {
  background: #fcd34d;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(251,191,36,0.45);
}
.cta-btn:active {
  transform: scale(0.97);
}

/* Hint */
.tap-hint {
  margin-top: 1rem;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
  animation: fadeIn 1s ease 1.2s both;
}

/* ─── Animations ───────────────────────────────────── */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>