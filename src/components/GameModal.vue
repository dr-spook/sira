<!--
  Modale du jeu : voile, carte centrée.
  - Le focus clavier reste piégé dans la carte (Tab et Maj+Tab tournent en boucle).
  - Le reste de l'app devient inerte pendant l'ouverture (ni clic, ni focus).
  - Échap et un toucher sur le voile ne ferment que si `dismissible` est activé.
  - À la fermeture, le focus revient sur l'élément qui avait ouvert la modale.
  On n'utilise pas la balise <dialog> : son voile (::backdrop) ne lit pas les variables CSS
  sur les navigateurs Android plus anciens que Chrome 122.
-->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const open = defineModel<boolean>('open', { default: false })

const { title, dismissible = false } = defineProps<{
  title: string
  dismissible?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const card = ref<HTMLElement>()
const titleId = useId()
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableElements(): HTMLElement[] {
  return Array.from(card.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
}

function setBackgroundInert(inert: boolean) {
  document.getElementById('app')?.toggleAttribute('inert', inert)
  document.body.style.overflow = inert ? 'hidden' : ''
}

async function onOpen() {
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  setBackgroundInert(true)
  await nextTick()
  // preventScroll : si la carte dépasse l'écran, on l'ouvre par le haut (titre visible),
  // même quand le premier bouton est tout en bas.
  ;(focusableElements()[0] ?? card.value)?.focus({ preventScroll: true })
  card.value?.parentElement?.scrollTo({ top: 0 })
}

function onClosed() {
  setBackgroundInert(false)
  previouslyFocused?.focus()
  previouslyFocused = null
}

watch(
  open,
  (isOpen, wasOpen) => {
    if (isOpen) onOpen()
    else if (wasOpen) onClosed()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (open.value) onClosed()
})

function close() {
  open.value = false
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (dismissible) {
      event.stopPropagation()
      close()
    }
    return
  }
  if (event.key !== 'Tab') return

  const items = focusableElements()
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) {
    event.preventDefault()
    card.value?.focus()
    return
  }
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === card.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

function onScrimClick() {
  if (dismissible) close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="onScrimClick">
        <div
          ref="card"
          class="modal__card"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <div v-if="$slots.icon" class="modal__icon"><slot name="icon" /></div>
          <h2 :id="titleId" class="modal__title">{{ title }}</h2>
          <div v-if="$slots.default" class="modal__body"><slot /></div>
          <div v-if="$slots.actions" class="modal__actions"><slot name="actions" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  /* Centrage par marges automatiques : si la carte est plus haute que l'écran, elle défile
     depuis son début (avec place-items: center, le haut serait coupé et inaccessible). */
  display: flex;
  padding: var(--space-24) var(--space-16);
  overflow-y: auto;
  background: var(--surface-scrim);
}

.modal__card {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-16);
  width: 100%;
  max-width: 360px;
  padding: var(--space-32) var(--space-24) var(--space-24);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-xl);
  box-shadow: 0 var(--depth-lg) 0 var(--edge-strong);
  background: var(--surface-card);
  color: var(--text-high);
  text-align: center;
}

.modal__card:focus {
  outline: none;
}

.modal__title {
  margin: 0;
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
}

.modal__body {
  width: 100%;
  color: var(--text-high);
}

.modal__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-base) ease-out;
}

.modal-enter-active .modal__card,
.modal-leave-active .modal__card {
  transition: transform var(--duration-base) ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__card,
.modal-leave-to .modal__card {
  transform: scale(0.94);
}
</style>
