import { createRouter, createWebHistory } from 'vue-router'
import PlaceholderScreen from '@/screens/PlaceholderScreen.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'home', component: PlaceholderScreen }],
})
