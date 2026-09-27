<!--
  Disque central des écrans de résultat. Décoratif : c'est le titre de l'écran qui porte le sens.
  - success : disque vert, coche blanche, rayons jaunes (Bravo, Région terminée)
  - neutral : disque encre, « ! » (Presque) — jamais de rouge : on apprend, on n'est pas puni
  - reward  : disque jaune, cauri (Pas assez de Cauris)
  - locked  : disque gris, cadenas (Champion verrouillé)
-->
<script setup lang="ts">
import { Check, Lock } from 'lucide-vue-next'
import IconCauri from '@/components/icons/IconCauri.vue'

export type ResultIconVariant = 'success' | 'neutral' | 'reward' | 'locked'

const { variant } = defineProps<{ variant: ResultIconVariant }>()

// 12 rayons, un long puis un court, autour d'un disque de rayon 40 (repère 160 × 160).
const rays = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6
  const inner = 52
  const outer = i % 2 === 0 ? 72 : 64
  return {
    x1: 80 + inner * Math.cos(angle),
    y1: 80 + inner * Math.sin(angle),
    x2: 80 + outer * Math.cos(angle),
    y2: 80 + outer * Math.sin(angle),
  }
})
</script>

<template>
  <div class="result-icon" :class="`result-icon--${variant}`" aria-hidden="true">
    <svg v-if="variant === 'success'" class="result-icon__rays" viewBox="0 0 160 160">
      <line
        v-for="(ray, index) in rays"
        :key="index"
        :x1="ray.x1"
        :y1="ray.y1"
        :x2="ray.x2"
        :y2="ray.y2"
      />
    </svg>
    <span class="result-icon__disc">
      <Check v-if="variant === 'success'" :size="48" :stroke-width="3" />
      <span v-else-if="variant === 'neutral'" class="result-icon__mark">!</span>
      <IconCauri v-else-if="variant === 'reward'" size="44" />
      <Lock v-else :size="36" />
    </span>
  </div>
</template>

<style scoped>
.result-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
}

.result-icon__rays {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  stroke: var(--reward);
  stroke-width: 5;
  stroke-linecap: round;
  animation: rays-in var(--duration-base) ease-out both;
}

.result-icon__disc {
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.result-icon--success .result-icon__disc {
  border: var(--border-width-strong) solid var(--action-primary-edge);
  background: var(--state-success);
  color: var(--text-on-color);
}

.result-icon--neutral .result-icon__disc {
  background: var(--text-high);
  color: var(--text-on-color);
}

.result-icon--reward .result-icon__disc {
  border: var(--border-width-strong) solid var(--border-strong);
  background: var(--reward);
  color: var(--reward-text);
}

.result-icon--locked .result-icon__disc {
  border: var(--border-width-strong) solid var(--border-soft);
  background: var(--state-locked-bg);
  color: var(--state-locked-icon);
}

.result-icon__mark {
  font-size: var(--font-size-48);
  font-weight: var(--font-weight-display);
  line-height: 1;
}

/* Les rayons apparaissent en grandissant (coupé si le joueur a réduit les animations). */
@keyframes rays-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
