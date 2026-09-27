<!--
  En-tête d'écran : bouton retour (optionnel), titre, sous-titre, et une zone à droite
  (emplacement `end`, par exemple pour un CauriChip).
  `back` : une route (le bouton devient un lien) ou `true` (le bouton émet `back`).
-->
<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import { fr } from '@/i18n/fr'

const {
  title,
  subtitle,
  back,
  brand = false,
} = defineProps<{
  title: string
  subtitle?: string
  back?: RouteLocationRaw | true
  /** Grand titre « SIRA » du Hub. */
  brand?: boolean
}>()

const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__row">
      <RouterLink
        v-if="back && back !== true"
        :to="back"
        class="screen-header__back"
        :aria-label="fr.common.back"
      >
        <ChevronLeft :size="24" aria-hidden="true" />
      </RouterLink>
      <button
        v-else-if="back === true"
        type="button"
        class="screen-header__back"
        :aria-label="fr.common.back"
        @click="emit('back')"
      >
        <ChevronLeft :size="24" aria-hidden="true" />
      </button>
      <h1 class="screen-header__title" :class="{ 'screen-header__title--brand': brand }">
        {{ title }}
      </h1>
      <div v-if="$slots.end" class="screen-header__end"><slot name="end" /></div>
    </div>
    <p v-if="subtitle" class="screen-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.screen-header {
  padding: var(--space-16) 0 var(--space-8);
}

.screen-header__row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  min-height: var(--touch-target);
}

.screen-header__back {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--touch-target);
  height: var(--touch-target);
  margin-left: calc(var(--space-12) * -1);
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: none;
  color: var(--text-high);
  cursor: pointer;
}

.screen-header__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-title);
}

.screen-header__title--brand {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
  letter-spacing: 0.08em;
}

.screen-header__end {
  flex: none;
}

.screen-header__subtitle {
  margin: var(--space-4) 0 0;
  color: var(--text-medium);
  font-size: var(--font-size-14);
}
</style>
