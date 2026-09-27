<!--
  Case de la zone de réponse (format Direct). Toucher une case remplie rend la lettre au plateau.

  Accessibilité : ici, « juste » et « faux » ne sont signalés que par la couleur (et la
  secousse pour « faux », qui disparaît si le joueur a réduit les animations).
  L'écran Question doit donc TOUJOURS afficher en plus un signal texte ou icône
  (coche, croix, message), pour « juste » comme pour « faux ».
-->
<script setup lang="ts">
import { computed } from 'vue'
import { fr } from '@/i18n/fr'

export type LetterSlotState = 'idle' | 'correct' | 'wrong'

const { letter, state = 'idle' } = defineProps<{
  /** Lettre placée. Case vide si absente. */
  letter?: string
  state?: LetterSlotState
}>()

const emit = defineEmits<{ clear: [] }>()

const spoken = computed(() => {
  if (!letter) return fr.slot.empty
  return state === 'idle' ? letter : `${letter}, ${fr.slot[state]}`
})
</script>

<template>
  <button
    type="button"
    class="letter-slot"
    :class="[`letter-slot--${state}`, { 'letter-slot--empty': !letter }]"
    :disabled="!letter"
    :aria-label="spoken"
    @click="emit('clear')"
  >
    {{ letter }}
  </button>
</template>

<style scoped>
.letter-slot {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-card);
  color: var(--text-high);
  font: inherit;
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-display);
  line-height: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.letter-slot--empty {
  border-style: dashed;
  border-color: var(--slot-empty-border);
  background: transparent;
  cursor: default;
}

.letter-slot--correct {
  border-color: var(--action-primary-edge);
  background: var(--state-success);
  color: var(--text-on-color);
}

.letter-slot--wrong {
  border-width: var(--border-width-strong);
  border-color: var(--state-error);
  animation: shake var(--duration-base) ease-in-out 2;
}
</style>
