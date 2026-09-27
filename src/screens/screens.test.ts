// @vitest-environment happy-dom
// Écrans du cœur avec TOUS les interrupteurs forcés à false (quelle que soit leur valeur dans
// features.ts) : le cœur doit fonctionner sans aucune des fonctionnalités de l'équipe.
import 'fake-indexeddb/auto'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { gameConfig } from '@/config/game'
import { db } from '@/db/database'
import { routes } from '@/router'
import { useGameStore } from '@/stores/game'
import HubScreen from './HubScreen.vue'
import QuestionScreen from './QuestionScreen.vue'

vi.mock('@/config/features', async (importOriginal) => {
  const { features } = await importOriginal<typeof import('@/config/features')>()
  return { features: Object.fromEntries(Object.keys(features).map((name) => [name, false])) }
})

let pinia: Pinia

function testRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

beforeEach(async () => {
  pinia = createPinia()
  setActivePinia(pinia)
  await db.delete()
  await db.open()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  document.body.innerHTML = '<div id="app"></div>'
})

describe('Hub', () => {
  it('Classique est jouable ; les 4 autres modes affichent « Bientôt » et ne sont pas des boutons', async () => {
    const router = testRouter()
    await router.push('/hub')
    const wrapper = mount(HubScreen, { global: { plugins: [pinia, router] } })
    await flushPromises()

    const cards = wrapper.findAll('.mode-card')
    expect(cards).toHaveLength(5)
    expect(cards[0]!.find('a').attributes('href')).toBe('/tour')
    const locked = cards.slice(1)
    for (const card of locked) {
      expect(card.text()).toContain('Bientôt')
      expect(card.element.tagName).not.toBe('BUTTON')
    }
    expect(wrapper.text()).not.toMatch(/Bibliothèque|Paramètres|Phase 3|En ligne/)
  })
})

describe('écran Question', () => {
  it('s’affiche sans bouton Indice, et affiche un signal texte après une réponse', async () => {
    const router = testRouter()
    const first = gameConfig.classique.regionOrder[0]!
    await router.push(`/jouer/${first}`)
    const wrapper = mount(QuestionScreen, {
      props: { regionId: first },
      global: { plugins: [pinia, router] },
      attachTo: document.getElementById('app')!,
    })
    // La sauvegarde (fake-indexeddb) répond de façon asynchrone : on attend l'écran.
    await vi.waitFor(() => expect(wrapper.find('.question').exists()).toBe(true))
    expect(wrapper.text()).not.toContain('Indice')

    // Première énigme : un Carré. On choisit une mauvaise réponse.
    const game = useGameStore()
    const round = game.round!
    if (round.format === 'direct') throw new Error('la première énigme devrait être un Carré')
    const wrong = round.choices.options.find((o) => o.id !== round.choices.correctId)!
    const button = wrapper.findAll('.answer-option').find((b) => b.text().includes(wrong.label))!
    await button.trigger('click')
    await vi.waitFor(() => expect(wrapper.find('.question__feedback').text()).not.toBe(''))

    const feedback = wrapper.find('.question__feedback')
    expect(feedback.text()).toContain('Faux')
    expect(feedback.find('svg').exists()).toBe(true)
    // La bonne réponse est montrée en vert, avec sa coche.
    expect(wrapper.findAll('.answer-option--correct')).toHaveLength(1)
    wrapper.unmount()
  })
})

describe('router', () => {
  it('toutes les routes du jeu mènent à un écran', () => {
    const named = routes.filter((route) => route.name)
    expect(named.map((route) => route.name)).toEqual(
      expect.arrayContaining(['splash', 'hub', 'tour', 'question', 'region-done']),
    )
    for (const route of named) expect('component' in route && route.component).toBeTruthy()
  })

  it('renvoie une adresse inconnue vers le Hub, et une région verrouillée ou inconnue vers la carte', async () => {
    const router = testRouter()
    await router.push('/n-importe-quoi')
    expect(router.currentRoute.value.name).toBe('hub')

    const locked = gameConfig.classique.regionOrder[1]!
    await router.push(`/jouer/${locked}`)
    expect(router.currentRoute.value.name).toBe('tour')

    await router.push('/hub')
    await router.push('/jouer/inconnue')
    expect(router.currentRoute.value.name).toBe('tour')
  })

  it('refuse « Région terminée » sans région venant d’être terminée', async () => {
    const router = testRouter()
    await router.push('/hub')
    await router.push(`/region/${gameConfig.classique.regionOrder[0]}/terminee`)
    expect(router.currentRoute.value.name).toBe('tour')
  })
})
