// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { gameConfig } from '@/config/game'
import type { HintId } from '@/engine/config'
import { fr } from '@/i18n/fr'
import HintModal from './HintModal.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

function show(props: { format: 'carre' | 'direct'; balance: number; exhausted?: HintId[] }) {
  wrapper = mount(HintModal, {
    props: { open: true, ...props },
    attachTo: document.body,
    // BaseButton sait afficher un lien du routeur : ici, un faux suffit pour faire taire l'avertissement.
    global: { stubs: { RouterLink: true } },
  })
}

const rows = () => Array.from(document.querySelectorAll<HTMLButtonElement>('.hint-row'))

describe('HintModal', () => {
  it('ne propose au Carré que « Éliminer 2 mauvaises réponses »', () => {
    show({ format: 'carre', balance: 100 })
    expect(rows()).toHaveLength(1)
    expect(rows()[0]!.textContent).toContain(fr.hint.labels.eliminer_2)
  })

  it('ne propose au Direct que « Retirer un leurre » et « Placer une lettre »', () => {
    show({ format: 'direct', balance: 100 })
    expect(rows()).toHaveLength(2)
    expect(rows()[0]!.textContent).toContain(fr.hint.labels.retirer_leurre)
    expect(rows()[1]!.textContent).toContain(fr.hint.labels.placer_lettre)
  })

  it('n’affiche aucun « il te manque » quand le joueur a assez de Cauris', () => {
    show({ format: 'direct', balance: 1000 })
    expect(document.querySelector('.hint-row__note')).toBeNull()
  })

  it('affiche « il te manque X » sur une ligne trop chère, qui reste touchable', () => {
    const cost = gameConfig.hints.retirer_leurre.cost
    show({ format: 'direct', balance: cost - 3 })
    expect(rows()[0]!.textContent).toContain(fr.hint.missing(3))
    expect(rows()[0]!.disabled).toBe(false)

    rows()[0]!.click()
    expect(wrapper!.emitted('select')).toEqual([['retirer_leurre']])
  })

  it('grise un indice devenu inutile et n’émet rien au toucher', () => {
    show({ format: 'direct', balance: 1000, exhausted: ['placer_lettre'] })
    expect(rows()[1]!.disabled).toBe(true)
    expect(rows()[1]!.textContent).toContain(fr.hint.nothingLeft)

    rows()[1]!.click()
    expect(wrapper!.emitted('select')).toBeUndefined()
  })

  it('émet close avec le bouton Fermer', () => {
    show({ format: 'carre', balance: 100 })
    document.querySelector<HTMLButtonElement>('.modal__actions button')!.click()
    expect(wrapper!.emitted('close')).toHaveLength(1)
  })
})
