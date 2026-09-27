<!--
  Tuile du plateau de lettres (format Direct).
  Les leurres ont exactement le même aspect que les bonnes lettres : seul l'indice
  « Retirer un leurre » fait passer une tuile en `disabled` (grisée).
-->
<script setup lang="ts">
import { fr } from '@/i18n/fr'

export type LetterTileState = 'bank' | 'placed' | 'disabled'

const { letter, state = 'bank' } = defineProps<{
  letter: string
  state?: LetterTileState
}>()

const emit = defineEmits<{ press: [] }>()
</script>

<template>
  <button
    type="button"
    class="letter-tile"
    :class="`letter-tile--${state}`"
    :disabled="state === 'disabled'"
    @click="emit('press')"
  >
    <span>{{ letter }}</span>
    <span v-if="state === 'disabled'" class="visually-hidden">, {{ fr.tile.removed }}</span>
  </button>
</template>

<style scoped>
.letter-tile {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: var(--depth);
  padding: 0;
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-sm);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  font: inherit;
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-display);
  line-height: 1;
  cursor: pointer;
  transition:
    transform var(--duration-fast) ease-out,
    box-shadow var(--duration-fast) ease-out;
  -webkit-tap-highlight-color: transparent;
}

.letter-tile--bank {
  background: var(--text-high);
  color: var(--text-on-color);
}

.letter-tile--placed {
  background: var(--surface-card);
  color: var(--text-high);
}

.letter-tile:active:not(:disabled),
.letter-tile.is-pressed {
  transform: translateY(var(--depth));
  box-shadow: 0 0 0 var(--edge-strong);
}

.letter-tile--disabled {
  border-color: transparent;
  box-shadow: none;
  transform: translateY(var(--depth));
  background: var(--state-locked-bg);
  color: var(--state-locked-text);
  cursor: not-allowed;
}
</style>
