import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { catalog } from '@/content/catalog'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'
import HubScreen from '@/screens/HubScreen.vue'
import SplashScreen from '@/screens/SplashScreen.vue'

const regionExists = (id: unknown) => catalog.regions.some((region) => region.id === id)

export const routes: RouteRecordRaw[] = [
  // Le Splash charge lui-même la sauvegarde, pour afficher sa barre de progression.
  { path: '/', name: 'splash', component: SplashScreen, meta: { loadsItself: true } },
  { path: '/hub', name: 'hub', component: HubScreen },
  { path: '/tour', name: 'tour', component: () => import('@/screens/TourScreen.vue') },
  {
    path: '/jouer/:regionId',
    name: 'question',
    component: () => import('@/screens/QuestionScreen.vue'),
    props: true,
    // Région inconnue ou verrouillée : retour à la carte, jamais un écran vide.
    beforeEnter: (to) =>
      regionExists(to.params.regionId) && useProgressStore().isUnlocked(String(to.params.regionId))
        ? true
        : { name: 'tour' },
  },
  {
    path: '/region/:regionId/terminee',
    name: 'region-done',
    component: () => import('@/screens/RegionDoneScreen.vue'),
    props: true,
    // Cet écran n'a de sens que juste après avoir terminé la région (pas après un rechargement).
    beforeEnter: (to) => {
      const result = useGameStore().lastResult
      return result?.regionComplete && result.puzzle.regionId === to.params.regionId
        ? true
        : { name: 'tour' }
    },
  },
]

// Pages de dev (/kit…) : en production, Vite remplace import.meta.env.DEV par false
// et supprime ce bloc, elles ne sont pas du tout dans le build.
if (import.meta.env.DEV) {
  routes.push({ path: '/kit', name: 'kit', component: () => import('@/dev/KitScreen.vue') })
}

// Adresse inconnue : on renvoie au Hub plutôt que d'afficher une page vide.
routes.push({ path: '/:pathMatch(.*)*', redirect: '/hub' })

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Avant chaque écran, la sauvegarde est chargée : aucun écran n'affiche 0 Cauri par erreur.
router.beforeEach(async (to) => {
  if (to.meta.loadsItself) return
  await Promise.all([usePlayerStore().ensureLoaded(), useProgressStore().ensureLoaded()])
})
