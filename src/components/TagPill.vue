<!--
  Petite puce de texte : format de l'énigme (« Carré »), série (« Série ×4 »), statut.
  Variantes :
    - `neutral` : fond carte, texte foncé.
    - `reward` : fond jaune or, texte foncé, icône Trophy (tâche D6).
-->
<script setup lang="ts">
import { Trophy } from 'lucide-vue-next'

const { variant = 'neutral' } = defineProps<{
  variant?: 'neutral' | 'reward'
}>()
</script>

<template>
  <span class="tag-pill" :class="`tag-pill--${variant}`">
    <Trophy v-if="variant === 'reward'" :size="14" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: 2px;
  padding: var(--space-4) var(--space-12);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 0 var(--edge-strong);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  line-height: var(--line-height-title);
  white-space: nowrap;
}

.tag-pill--neutral {
  background: var(--surface-card);
  color: var(--text-high);
}

.tag-pill--reward {
  background: var(--reward);
  color: var(--reward-text);
}
</style>
