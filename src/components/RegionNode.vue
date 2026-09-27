<!--
  Nœud d'une région sur la carte du Tour du Faso (couleurs-v1.md §5).
  terminée : disque vert et coche · en cours : disque blanc, anneau de progression et « 3/5 »
  · verrouillée : disque gris et cadenas. L'étiquette porte aussi le statut (icône ou chiffres).
-->
<script setup lang="ts">
import { Check, Lock } from 'lucide-vue-next'
import { computed } from 'vue'
import type { RegionStatus } from '@/engine/classic'
import { fr } from '@/i18n/fr'

const {
  name,
  status,
  successes = 0,
  target = 0,
  selected = false,
  labelSide = 'right',
} = defineProps<{
  name: string
  status: RegionStatus
  successes?: number
  target?: number
  selected?: boolean
  /** Côté où s'affiche l'étiquette du nom. */
  labelSide?: 'left' | 'right'
}>()

const emit = defineEmits<{ select: [] }>()

const RADIUS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ratio = computed(() => (target > 0 ? Math.min(successes / target, 1) : 0))
const spoken = computed(() => `${name}, ${fr.tour.statusLabel(status, successes, target)}`)
</script>

<template>
  <button
    type="button"
    class="region-node"
    :class="[
      `region-node--${status}`,
      `region-node--label-${labelSide}`,
      { 'is-selected': selected },
    ]"
    :aria-label="spoken"
    :aria-pressed="selected"
    @click="emit('select')"
  >
    <span class="region-node__disc" aria-hidden="true">
      <Check v-if="status === 'done'" :size="28" :stroke-width="3" />
      <Lock v-else-if="status === 'locked'" :size="22" />
      <template v-else>
        <svg class="region-node__ring" viewBox="0 0 64 64">
          <circle class="region-node__track" cx="32" cy="32" :r="RADIUS" />
          <circle
            class="region-node__arc"
            cx="32"
            cy="32"
            :r="RADIUS"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="CIRCUMFERENCE * (1 - ratio)"
          />
        </svg>
        <span class="region-node__count">
          {{ successes }}<small>/{{ target }}</small>
        </span>
      </template>
    </span>
    <span class="region-node__label" aria-hidden="true">
      {{ name }}
      <template v-if="status === 'in-progress'"> · {{ successes }}/{{ target }}</template>
      <Check v-else-if="status === 'done'" :size="14" :stroke-width="3" />
      <Lock v-else :size="12" />
    </span>
  </button>
</template>

<style scoped>
.region-node {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-high);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.region-node--label-left {
  flex-direction: row-reverse;
}

.region-node__disc {
  position: relative;
  display: grid;
  flex: none;
  place-items: center;
  width: 64px;
  height: 64px;
  border: var(--border-width-strong) solid var(--border-strong);
  border-radius: 50%;
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  background: var(--surface-card);
}

.region-node--done .region-node__disc {
  border-color: var(--action-primary-edge);
  box-shadow: 0 var(--depth) 0 var(--action-primary-edge);
  background: var(--state-success);
  color: var(--text-on-color);
}

.region-node--locked .region-node__disc {
  border-color: var(--border-soft);
  box-shadow: none;
  background: var(--state-locked-bg);
  color: var(--state-locked-icon);
}

.region-node__ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.region-node__track,
.region-node__arc {
  fill: none;
  stroke-width: 5;
}

.region-node__track {
  stroke: var(--progress-track);
}

.region-node__arc {
  stroke: var(--progress-fill);
  stroke-linecap: round;
}

.region-node__count {
  position: relative;
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-display);
  line-height: 1;
}

.region-node__count small {
  color: var(--text-medium);
  font-size: var(--font-size-12);
}

.region-node__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-12);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-title);
  white-space: nowrap;
}

.region-node--done .region-node__label {
  color: var(--state-success-text);
}

.region-node--locked .region-node__label {
  border-color: var(--border-soft);
  background: var(--state-locked-bg);
  color: var(--state-locked-text);
}

/* Région choisie : étiquette pleine, comme « Bankui · 3/5 » sur la maquette. */
.is-selected .region-node__label {
  border-color: var(--border-strong);
  background: var(--text-high);
  color: var(--text-on-color);
}
</style>
