<!--
  Modale « Réessayer » : après une mauvaise réponse. On ne montre ni la réponse ni l'anecdote
  (elle se gagne en trouvant) : le joueur réessaie tout de suite la même énigme, re-mélangée.
  Pas de rouge : on apprend, on n'est pas puni (couleurs-v1.md §2).
-->
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import GameModal from '@/components/GameModal.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { fr } from '@/i18n/fr'

const { open, loss = 0 } = defineProps<{
  open: boolean
  /** Cauris perdus (0 avec les réglages actuels de game.json). */
  loss?: number
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <GameModal :open="open" :title="fr.retry.title">
    <template #icon><ResultIcon variant="neutral" /></template>
    <p class="retry__text">{{ fr.retry.text }}</p>
    <p class="retry__loss">{{ loss > 0 ? fr.result.loss(loss) : fr.result.noLoss }}</p>
    <template #actions>
      <BaseButton block @click="emit('retry')">{{ fr.retry.button }}</BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.retry__text {
  margin: 0;
}

.retry__loss {
  margin: var(--space-8) 0 0;
  color: var(--text-medium);
  font-size: var(--font-size-14);
}
</style>
