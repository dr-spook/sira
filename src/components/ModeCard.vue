<!--
  Carte d'un mode de jeu sur le Hub.
  Débloquée : bouton d'action. Verrouillée : grisée, avec un cadenas et la condition de
  déblocage. Une carte verrouillée n'est cliquable qu'avec `lockedClickable` (elle émet alors
  `locked-click`, par exemple pour ouvrir la modale « Champion verrouillé ») : sinon, on ne
  présente pas au joueur un bouton qui ne fait rien.
-->
<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { fr } from '@/i18n/fr'

const {
  title,
  subtitle,
  locked = false,
  lockLabel,
  actionLabel = fr.common.play,
  to,
  lockedClickable = false,
} = defineProps<{
  title: string
  subtitle?: string
  locked?: boolean
  /** Condition de déblocage, par exemple « 100 pts en Classique ». */
  lockLabel?: string
  actionLabel?: string
  to?: RouteLocationRaw
  lockedClickable?: boolean
}>()

const emit = defineEmits<{ play: []; 'locked-click': [] }>()
</script>

<template>
  <component
    :is="lockedClickable ? 'button' : 'div'"
    v-if="locked"
    :type="lockedClickable ? 'button' : undefined"
    class="mode-card mode-card--locked"
    :class="{ 'mode-card--clickable': lockedClickable }"
    @click="lockedClickable && emit('locked-click')"
  >
    <span class="mode-card__text">
      <span class="mode-card__title">{{ title }}</span>
      <span v-if="subtitle" class="mode-card__subtitle">{{ subtitle }}</span>
    </span>
    <span class="mode-card__lock">
      <Lock :size="14" aria-hidden="true" />
      <span class="visually-hidden">{{ fr.mode.locked }} :</span>
      {{ lockLabel }}
    </span>
  </component>

  <div v-else class="mode-card">
    <span class="mode-card__text">
      <span class="mode-card__title">{{ title }}</span>
      <span v-if="subtitle" class="mode-card__subtitle">{{ subtitle }}</span>
    </span>
    <BaseButton size="sm" :to="to" @click="emit('play')">{{ actionLabel }}</BaseButton>
  </div>
</template>

<style scoped>
.mode-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  width: 100%;
  min-height: 88px;
  margin-bottom: var(--depth);
  padding: var(--space-16) var(--space-20);
  border: var(--border-width-strong) solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  background: var(--surface-card);
  color: var(--text-high);
  font: inherit;
  text-align: left;
  /* Sur un écran étroit, la puce ou le bouton passe sous le titre au lieu de le chevaucher. */
  flex-wrap: wrap;
}

.mode-card--locked {
  border: var(--border-width) solid var(--border-soft);
  box-shadow: none;
  background: var(--surface-locked);
  color: var(--state-locked-text);
}

.mode-card--clickable {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mode-card__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.mode-card__title {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-display);
  line-height: var(--line-height-title);
  text-transform: uppercase;
}

.mode-card__subtitle {
  color: var(--text-medium);
  font-size: var(--font-size-14);
}

.mode-card--locked .mode-card__subtitle {
  color: var(--state-locked-text);
}

.mode-card__lock {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-12);
  border: var(--border-width) solid var(--border-soft);
  border-radius: var(--radius-pill);
  background: var(--surface-card);
  color: var(--state-locked-text);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
}

.mode-card__lock :deep(svg) {
  color: var(--state-locked-icon);
}
</style>
