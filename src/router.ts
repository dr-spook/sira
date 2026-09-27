import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PlaceholderScreen from '@/screens/PlaceholderScreen.vue'

const routes: RouteRecordRaw[] = [{ path: '/', name: 'home', component: PlaceholderScreen }]

// Page /kit : en dev uniquement. En production, Vite remplace import.meta.env.DEV par false
// et supprime ce bloc : la page n'est pas du tout dans le build.
if (import.meta.env.DEV) {
  routes.push({ path: '/kit', name: 'kit', component: () => import('@/dev/KitScreen.vue') })
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
