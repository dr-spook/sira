<!--
  Barre de progression. Avec `segments`, elle est découpée en cases (Hub : 17 régions).
-->
<script setup lang="ts">
import { computed } from 'vue'
import { fr } from '@/i18n/fr'

const {
  value,
  max = 1,
  label,
  segments,
} = defineProps<{
  value: number
  max?: number
  /** Texte affiché sous la barre, et lu par les lecteurs d'écran. */
  label?: string
  /** Nombre de cases. Sans cette prop, la barre est continue. */
  segments?: number
}>()

const ratio = computed(() => (max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0))
const filledSegments = computed(() => Math.round(ratio.value * (segments ?? 0)))
</script>

<template>
  <div class="progress">
    <div
      class="progress__track"
      :class="{ 'progress__track--segmented': segments }"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label ?? fr.progress.label"
    >
      <template v-if="segments">
        <span
          v-for="index in segments"
          :key="index"
          class="progress__segment"
          :class="{ 'progress__segment--filled': index <= filledSegments }"
        />
      </template>
      <span v-else class="progress__fill" :style="{ width: `${ratio * 100}%` }" />
    </div>
    <p v-if="label" class="progress__label" aria-hidden="true">{{ label }}</p>
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
}

.progress__track {
  display: flex;
  height: 14px;
  overflow: hidden;
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--progress-track);
}

.progress__fill {
  height: 100%;
  background: var(--progress-fill);
  transition: width var(--duration-base) ease-out;
}

.progress__track--segmented {
  gap: var(--space-4);
  height: 12px;
  overflow: visible;
  border: 0;
  background: none;
}

.progress__segment {
  flex: 1;
  border: 1px solid var(--border-soft);
  border-radius: 3px;
  background: var(--progress-track);
}

.progress__segment--filled {
  border-color: var(--action-primary-edge);
  background: var(--progress-fill);
}

.progress__label {
  margin: var(--space-4) 0 0;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  text-align: right;
}
</style>
