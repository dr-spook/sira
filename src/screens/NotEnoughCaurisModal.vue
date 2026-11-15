<!--
  Modale « Pas assez de Cauris » : ouverte par la modale Indice (tâche I3) quand le joueur ne peut
  pas payer l'indice. Le coût et le solde viennent de l'écran appelant, jamais écrits ici.
-->
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import GameModal from '@/components/GameModal.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { fr } from '@/i18n/fr'

const { open, cost, balance } = defineProps<{
  open: boolean
  /** Prix de l'indice, en Cauris. */
  cost: number
  /** Cauris que le joueur possède. */
  balance: number
}>()

const emit = defineEmits<{ close: [] }>()

const need = computed(() => fr.notEnoughCauris.need(cost, balance))
</script>

<template>
  <GameModal :open="open" :title="fr.notEnoughCauris.title">
    <template #icon><ResultIcon variant="reward" /></template>
    <p class="not-enough__need">
      {{ need.before }}<strong>{{ need.cost }}</strong
      >{{ need.middle }}<strong>{{ need.balance }}</strong
      >{{ need.after }}
    </p>
    <p class="not-enough__hint">{{ fr.notEnoughCauris.hint }}</p>
    <template #actions>
      <BaseButton block @click="emit('close')">{{ fr.notEnoughCauris.button }}</BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.not-enough__need {
  margin: 0;
}

.not-enough__hint {
  margin: var(--space-8) 0 0;
  color: var(--text-medium);
  font-size: var(--font-size-14);
}
</style>
