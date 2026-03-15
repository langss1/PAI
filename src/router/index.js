import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import MaterialDetail from '../views/public/MaterialDetail.vue'

// Admin Views
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import AddMaterial from '../views/admin/AddMaterial.vue'
import AttendanceView from '../views/admin/AttendanceView.vue'

const routes = [
  // --- PUBLIC ROUTES (Siswa) ---
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/materi/:id',
    name: 'MaterialDetail',
    component: MaterialDetail,
    props: true
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
    // (Nanti bisa tambahkan fitur pengecekan apakah sudah login)
  },
  {
    path: '/admin/materi/tambah',
    name: 'AddMaterial',
    component: AddMaterial
  },
  {
    path: '/admin/kehadiran',
    name: 'Attendance',
    component: AttendanceView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
