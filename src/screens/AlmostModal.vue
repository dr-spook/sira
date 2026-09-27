<!--
  Modale Presque (maquette 9) : après une mauvaise réponse. Pas de rouge : on apprend,
  on n'est pas puni (couleurs-v1.md §2). La bonne réponse est montrée en vert.
-->
<script setup lang="ts">
import AnswerReveal from '@/components/AnswerReveal.vue'
import BaseButton from '@/components/BaseButton.vue'
import GameModal from '@/components/GameModal.vue'
import InfoCard from '@/components/InfoCard.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { fr } from '@/i18n/fr'

const {
  open,
  answer,
  anecdote,
  loss = 0,
} = defineProps<{
  open: boolean
  answer: string
  anecdote: string
  /** Cauris perdus (0 avec les réglages actuels de game.json). */
  loss?: number
}>()

const emit = defineEmits<{ next: [] }>()
</script>

<template>
  <GameModal :open="open" :title="fr.result.almost">
    <template #icon><ResultIcon variant="neutral" /></template>
    <div class="almost">
      <AnswerReveal :answer="answer" />
      <p class="almost__loss">{{ loss > 0 ? fr.result.loss(loss) : fr.result.noLoss }}</p>
      <InfoCard :text="anecdote" />
    </div>
    <template #actions>
      <BaseButton block @click="emit('next')">{{ fr.result.next }}</BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.almost {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.almost__loss {
  margin: 0;
  font-weight: var(--font-weight-title);
}
</style>
