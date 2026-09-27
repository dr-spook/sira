<!--
  Une proposition du Carré ou du Duo.
  La bonne réponse passe en vert même quand le joueur s'est trompé (couleurs-v1.md §5).
-->
<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { fr } from '@/i18n/fr'

export type AnswerOptionState = 'idle' | 'correct' | 'wrong' | 'eliminated'

const {
  label,
  letter,
  state = 'idle',
  disabled = false,
} = defineProps<{
  label: string
  /** Lettre affichée devant le texte : « A · Tô ». */
  letter?: string
  state?: AnswerOptionState
  /** Bloque le choix (réponse déjà donnée) sans griser l'option. */
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="answer-option"
    :class="`answer-option--${state}`"
    :disabled="disabled || state === 'eliminated'"
    @click="emit('select')"
  >
    <span>
      <template v-if="letter">{{ letter }} · </template>{{ label }}
    </span>
    <Check v-if="state === 'correct'" class="answer-option__icon" aria-hidden="true" />
    <X v-else-if="state === 'wrong'" class="answer-option__icon" aria-hidden="true" />
    <span v-if="state !== 'idle'" class="visually-hidden">, {{ fr.answer[state] }}</span>
  </button>
</template>

<style scoped>
.answer-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  width: 100%;
  min-height: 52px;
  margin-bottom: var(--depth);
  padding: var(--space-12) var(--space-16);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  background: var(--surface-card);
  color: var(--text-high);
  font: inherit;
  font-weight: var(--font-weight-title);
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--duration-fast) ease-out,
    box-shadow var(--duration-fast) ease-out;
  -webkit-tap-highlight-color: transparent;
}

.answer-option:active:not(:disabled),
.answer-option.is-pressed {
  transform: translateY(var(--depth));
  box-shadow: 0 0 0 var(--edge-strong);
  background: var(--surface-pressed);
}

.answer-option:disabled {
  cursor: default;
}

.answer-option__icon {
  flex: none;
}

.answer-option--correct {
  border-color: var(--action-primary-edge);
  box-shadow: 0 var(--depth) 0 var(--action-primary-edge);
  background: var(--state-success);
  color: var(--text-on-color);
}

.answer-option--wrong {
  border-color: var(--state-error);
  box-shadow: 0 var(--depth) 0 var(--state-error);
  background: var(--state-error-bg);
  color: var(--state-error-text);
  animation: shake var(--duration-base) ease-in-out 2;
}

.answer-option--eliminated {
  border-color: transparent;
  box-shadow: none;
  transform: translateY(var(--depth));
  background: var(--state-locked-bg);
  color: var(--state-locked-text);
  font-weight: var(--font-weight-body);
  text-decoration: line-through;
}
</style>
