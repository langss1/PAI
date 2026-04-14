import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import MaterialDetail from '../views/public/MaterialDetail.vue'

// Admin Views
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import AddMaterial from '../views/admin/AddMaterial.vue'
import AttendanceView from '../views/admin/AttendanceView.vue'
import CategoryView from '../views/admin/CategoryView.vue'
import GlobalQuizView from '../views/admin/GlobalQuizView.vue'

// Public Quiz View
import QuizView from '../views/public/QuizView.vue'

// Flag in-memory: reset setiap kali halaman dibuka/refresh
// Tidak pakai localStorage/sessionStorage, jadi welcome SELALU muncul saat buka app
let welcomeDone = false

export const setWelcomeDone = () => {
  welcomeDone = true
}

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomeScreen
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/bab/:categoryName',
    name: 'BabDetail',
    component: BabDetailView,
    props: true
  },
  {
    path: '/materi/:id',
    name: 'MaterialDetail',
    component: MaterialDetail,
    props: true
  },
  {
    path: '/kuis',
    name: 'GlobalQuiz',
    component: QuizView
  },

  // --- ADMIN ROUTES ---
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: LoginView
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/materi/tambah',
    name: 'AddMaterial',
    component: AddMaterial,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/materi/edit/:id',
    name: 'EditMaterial',
    component: AddMaterial,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/admin/kehadiran',
    name: 'Attendance',
    component: AttendanceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/kategori',
    name: 'ManageCategory',
    component: CategoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/kuis',
    name: 'ManageGlobalQuiz',
    component: GlobalQuizView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'secure_token_abc123'

  // Sudah lewati welcome → kalau paksa balik ke '/' redirect ke home
  if (to.name === 'Welcome' && welcomeDone) {
    return next({ name: 'Home' })
  }

  // Belum lihat welcome → paksa ke welcome dulu
  if (to.name === 'Home' && !welcomeDone) {
    return next({ name: 'Welcome' })
  }

  // Security admin
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: 'AdminLogin' })
    }
    return next()
  }

  if (to.name === 'AdminLogin' && isAuthenticated) {
    return next({ name: 'AdminDashboard' })
  }

  next()
})

export default router