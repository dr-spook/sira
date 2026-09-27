<!--
  Chrono des modes Champion et Maître : un anneau qui se vide.
  Sous le seuil d'urgence, anneau et chiffre passent en rouge et pulsent (couleurs-v1.md §5).
  Le chiffre reste toujours affiché : la couleur n'est jamais le seul signal.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { fr } from '@/i18n/fr'

const {
  seconds,
  total,
  urgentAt = 5,
} = defineProps<{
  seconds: number
  total: number
  /** Seuil visuel d'urgence, en secondes (5 d'après couleurs-v1.md §5). */
  urgentAt?: number
}>()

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const urgent = computed(() => seconds <= urgentAt)
const ratio = computed(() => (total > 0 ? Math.min(Math.max(seconds / total, 0), 1) : 0))
// L'arc visible est la part de temps restante ; le reste du cercle est « masqué ».
const dashOffset = computed(() => CIRCUMFERENCE * (1 - ratio.value))
</script>

<template>
  <div
    class="chrono"
    :class="{ 'chrono--urgent': urgent }"
    role="timer"
    :aria-label="fr.chrono.remaining(seconds)"
  >
    <svg class="chrono__ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="chrono__track" cx="50" cy="50" :r="RADIUS" />
      <circle
        class="chrono__arc"
        cx="50"
        cy="50"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <span class="chrono__value" aria-hidden="true">
      <span class="chrono__seconds">{{ seconds }}</span>
      <span class="chrono__unit">{{ fr.chrono.unit }}</span>
    </span>
  </div>
</template>

<style scoped>
.chrono {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 96px;
  height: 96px;
  color: var(--text-high);
}

.chrono__ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.chrono__track,
.chrono__arc {
  fill: var(--surface-card);
  stroke-width: 9;
}

.chrono__track {
  stroke: var(--progress-track);
}

.chrono__arc {
  fill: none;
  stroke: var(--border-strong);
  stroke-linecap: round;
  transition:
    stroke-dashoffset var(--duration-base) linear,
    stroke var(--duration-base);
}

.chrono__value {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.chrono__seconds {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
}

.chrono__unit {
  color: var(--text-medium);
  font-size: var(--font-size-12);
}

.chrono--urgent {
  color: var(--urgency);
  animation: pulse 1s ease-in-out infinite;
}

.chrono--urgent .chrono__arc {
  stroke: var(--urgency);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}
</style>
