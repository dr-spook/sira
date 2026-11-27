// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TagPill from '@/components/TagPill.vue'
import { fr } from '@/i18n/fr'
import RunDoneScreen from './RunDoneScreen.vue'

describe('TagPill', () => {
  it('affiche le contenu en variante neutre par défaut sans icône', () => {
    const wrapper = mount(TagPill, {
      slots: { default: 'Format' },
    })
    expect(wrapper.classes()).toContain('tag-pill--neutral')
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toBe('Format')
  })

  it('affiche l’icône Trophy en variante reward', () => {
    const wrapper = mount(TagPill, {
      props: { variant: 'reward' },
      slots: { default: 'Record !' },
    })
    expect(wrapper.classes()).toContain('tag-pill--reward')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('Record !')
  })
})

describe('RunDoneScreen', () => {
  const mountScreen = (props: {
    score: number
    isRecord: boolean
    correct: number
    total: number
    bestStreak: number
  }) =>
    mount(RunDoneScreen, {
      props,
      global: {
        stubs: { RouterLink: true },
      },
    })

  it('affiche le score, les statistiques et le badge de record quand isRecord est vrai', () => {
    const wrapper = mountScreen({
      score: 145,
      isRecord: true,
      correct: 12,
      total: 15,
      bestStreak: 6,
    })

    expect(wrapper.find('.run-done__score-value').text()).toBe(fr.runDone.score(145))
    expect(wrapper.text()).toContain(fr.runDone.title)
    expect(wrapper.text()).toContain(fr.runDone.record)
    expect(wrapper.find('.tag-pill--reward').exists()).toBe(true)
    expect(wrapper.text()).toContain(fr.runDone.correctValue(12, 15))
    expect(wrapper.text()).toContain(fr.runDone.streakValue(6))
    expect(wrapper.text()).toContain(fr.runDone.correct)
    expect(wrapper.text()).toContain(fr.runDone.bestStreak)
  })

  it('formate les nombres avec le séparateur de milliers et préfixe multiplicateur', () => {
    const wrapper = mountScreen({
      score: 1250,
      isRecord: true,
      correct: 10,
      total: 15,
      bestStreak: 8,
    })

    expect(wrapper.find('.run-done__score-value').text()).toBe(fr.runDone.score(1250))
    expect(wrapper.find('.run-done__score-value').text()).toMatch(/1[\s\u202f]250/)
    expect(wrapper.text()).toContain(fr.runDone.correctValue(10, 15))
    expect(wrapper.text()).toContain(fr.runDone.streakValue(8))
    expect(wrapper.text()).toContain('×8')
  })

  it('masque le badge de record quand isRecord est faux', () => {
    const wrapper = mountScreen({
      score: 90,
      isRecord: false,
      correct: 8,
      total: 15,
      bestStreak: 3,
    })

    expect(wrapper.find('.run-done__score-value').text()).toBe('90')
    expect(wrapper.text()).not.toContain(fr.runDone.record)
    expect(wrapper.find('.tag-pill--reward').exists()).toBe(false)
    expect(wrapper.text()).toContain('8/15')
    expect(wrapper.text()).toContain('×3')
  })

  it('émet l’événement replay au clic sur le bouton Rejouer', async () => {
    const wrapper = mountScreen({
      score: 145,
      isRecord: false,
      correct: 12,
      total: 15,
      bestStreak: 6,
    })

    const buttons = wrapper.findAll('button')
    const replayBtn = buttons.find((b) => b.text().includes(fr.runDone.replay))!
    expect(replayBtn).toBeDefined()
    await replayBtn.trigger('click')

    expect(wrapper.emitted('replay')).toHaveLength(1)
  })

  it('émet l’événement back-to-hub au clic sur le bouton Retour au hub', async () => {
    const wrapper = mountScreen({
      score: 145,
      isRecord: false,
      correct: 12,
      total: 15,
      bestStreak: 6,
    })

    const buttons = wrapper.findAll('button')
    const backBtn = buttons.find((b) => b.text().includes(fr.runDone.backToHub))!
    expect(backBtn).toBeDefined()
    await backBtn.trigger('click')

    expect(wrapper.emitted('back-to-hub')).toHaveLength(1)
  })
})
