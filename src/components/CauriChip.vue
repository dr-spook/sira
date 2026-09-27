<!-- Puce jaune des Cauris : compteur en haut d'écran, gain (« +20 »), coût d'un indice. -->
<script setup lang="ts">
import { computed } from 'vue'
import IconCauri from '@/components/icons/IconCauri.vue'
import { fr } from '@/i18n/fr'

const {
  amount,
  size = 'md',
  signed = false,
  label,
} = defineProps<{
  amount: number
  size?: 'sm' | 'md' | 'lg'
  /** Affiche le signe + devant un gain : « +20 ». */
  signed?: boolean
  /** Texte après le nombre, par exemple « Cauris · bonus région ». */
  label?: string
}>()

const text = computed(() => fr.cauri.format(amount, signed))
// Sans label, le lecteur d'écran dit « 245 Cauris » (l'icône seule ne dit rien).
const spoken = computed(() =>
  label ? `${text.value} ${label}` : `${signed && amount > 0 ? '+' : ''}${fr.cauri.count(amount)}`,
)
</script>

<template>
  <span class="cauri-chip" :class="`cauri-chip--${size}`">
    <IconCauri class="cauri-chip__icon" />
    <span aria-hidden="true"
      >{{ text }}<template v-if="label">&nbsp;{{ label }}</template></span
    >
    <span class="visually-hidden">{{ spoken }}</span>
  </span>
</template>

<style scoped>
.cauri-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: 2px;
  padding: var(--space-4) var(--space-12);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 0 var(--edge-strong);
  background: var(--reward);
  color: var(--reward-text);
  font-weight: var(--font-weight-title);
  line-height: var(--line-height-title);
  white-space: nowrap;
}

.cauri-chip--sm {
  padding: 2px var(--space-8);
  font-size: var(--font-size-12);
}

.cauri-chip--md {
  font-size: var(--font-size-14);
}

.cauri-chip--lg {
  padding: var(--space-8) var(--space-20);
  font-size: var(--font-size-20);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  margin-bottom: var(--depth);
}

.cauri-chip__icon {
  flex: none;
}
</style>
