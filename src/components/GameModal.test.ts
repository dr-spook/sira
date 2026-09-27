// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import GameModal from './GameModal.vue'

// Une page minimale : un bouton qui ouvre la modale, et une modale avec deux boutons.
function mountPage(dismissible: boolean) {
  const open = ref(false)
  const Page = defineComponent({
    setup: () => () => [
      h('button', { id: 'opener', onClick: () => (open.value = true) }, 'Ouvrir'),
      h(
        GameModal,
        {
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
          title: 'Titre',
          dismissible,
        },
        {
          default: () => h('button', { id: 'first' }, 'Premier'),
          actions: () => h('button', { id: 'last' }, 'Dernier'),
        },
      ),
    ],
  })
  const wrapper = mount(Page, { attachTo: document.body })
  return { wrapper, open }
}

const byId = (id: string) => document.getElementById(id) as HTMLElement
const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

function press(key: string, shiftKey = false) {
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
  )
}

async function openFromButton(wrapper: VueWrapper) {
  const opener = byId('opener')
  opener.focus()
  await wrapper.find('#opener').trigger('click')
  await nextTick()
  await nextTick()
}

let current: VueWrapper | undefined

afterEach(() => {
  current?.unmount()
  current = undefined
  document.body.innerHTML = ''
})

describe('GameModal', () => {
  it('donne le focus au premier élément de la modale à l’ouverture', async () => {
    const { wrapper } = mountPage(false)
    current = wrapper
    await openFromButton(wrapper)

    expect(dialog()).not.toBeNull()
    expect(dialog()?.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(byId('first'))
  })

  it('piège le focus : Tab sur le dernier revient au premier, Maj+Tab fait l’inverse', async () => {
    const { wrapper } = mountPage(false)
    current = wrapper
    await openFromButton(wrapper)

    byId('last').focus()
    press('Tab')
    expect(document.activeElement).toBe(byId('first'))

    press('Tab', true)
    expect(document.activeElement).toBe(byId('last'))
  })

  it('ignore Échap quand la modale n’est pas dismissible', async () => {
    const { wrapper, open } = mountPage(false)
    current = wrapper
    await openFromButton(wrapper)

    press('Escape')
    await nextTick()
    expect(open.value).toBe(true)
    expect(dialog()).not.toBeNull()
  })

  it('se ferme avec Échap quand elle est dismissible, et rend le focus au bouton d’origine', async () => {
    const { wrapper, open } = mountPage(true)
    current = wrapper
    await openFromButton(wrapper)
    expect(document.activeElement).toBe(byId('first'))

    press('Escape')
    await nextTick()
    await nextTick()
    expect(open.value).toBe(false)
    expect(document.activeElement).toBe(byId('opener'))
  })

  it('rend aussi le focus quand elle est fermée par le code', async () => {
    const { wrapper, open } = mountPage(false)
    current = wrapper
    await openFromButton(wrapper)

    open.value = false
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(byId('opener'))
  })

  it('rend le reste de l’app inerte pendant l’ouverture', async () => {
    const app = document.createElement('div')
    app.id = 'app'
    document.body.appendChild(app)
    const { wrapper, open } = mountPage(false)
    current = wrapper
    await openFromButton(wrapper)
    expect(app.hasAttribute('inert')).toBe(true)

    open.value = false
    await nextTick()
    expect(app.hasAttribute('inert')).toBe(false)
  })
})
