import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import MaterialDetail from '../views/public/MaterialDetail.vue'
import BabDetailView from '../views/public/BabDetailView.vue'

// Admin Views
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import AddMaterial from '../views/admin/AddMaterial.vue'
import AttendanceView from '../views/admin/AttendanceView.vue'
import CategoryView from '../views/admin/CategoryView.vue'
import GlobalQuizView from '../views/admin/GlobalQuizView.vue'

// Public Quiz View
import QuizView from '../views/public/QuizView.vue'

const routes = [
  // --- PUBLIC ROUTES (Siswa) ---
  {
    path: '/',
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

  // --- ADMIN ROUTES (Guru) ---
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

// Navigation Guard untuk Security Halaman Admin
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'secure_token_abc123'
  
  // Jika rute butuh login (semua halaman admin kecuali login)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Belum login? Tendang ke halaman login
      next({ name: 'AdminLogin' })
    } else {
      next() // Sudah login, silakan masuk
    }
  } else if (to.name === 'AdminLogin' && isAuthenticated) {
    // Kalau sudah login tapi maksa buka halaman login, tendang ke dashboard
    next({ name: 'AdminLogin' })
  } else {
    next() // Rute publik, biarkan saja
  }
})

export default router
