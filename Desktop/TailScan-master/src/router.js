import { createRouter, createWebHistory } from 'vue-router'

// Importa tus componentes
import LogIn from '@/components/LogIn.vue'
import SignIn from '@/components/SignIn.vue'
import Home from '@/components/Home.vue'
import GeneradorQR from '@/components/GeneradorQR.vue'
import MapaReportes from '@/components/MapaReportes.vue'
import Consejos from '@/components/Consejos.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LogIn
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/generador-qr',
    name: 'GeneradorQR',
    component: GeneradorQR
  },
  {                                               
    path: '/mapa',
    name: 'MapaReportes',
    component: MapaReportes
  },
  {
    path: '/consejos',
    name: 'Consejos',
    component: Consejos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router