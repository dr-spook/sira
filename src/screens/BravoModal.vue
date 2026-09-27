<!-- Modale Bravo (maquette 8) : après une bonne réponse. -->
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import GameModal from '@/components/GameModal.vue'
import InfoCard from '@/components/InfoCard.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { fr } from '@/i18n/fr'

const {
  open,
  cauris,
  points,
  streak = 0,
  streakBonus = 0,
  anecdote,
  regionComplete = false,
} = defineProps<{
  open: boolean
  /** Cauris gagnés, bonus de série compris. */
  cauris: number
  points: number
  streak?: number
  streakBonus?: number
  anecdote: string
  /** La réponse termine la région : le bouton mène à « Région terminée ». */
  regionComplete?: boolean
}>()

const emit = defineEmits<{ next: [] }>()
</script>

<template>
  <GameModal :open="open" :title="fr.result.bravo">
    <template #icon><ResultIcon variant="success" /></template>
    <div class="bravo">
      <CauriChip :amount="cauris" size="lg" signed :label="fr.cauri.unit(cauris)" />
      <p class="bravo__points">{{ fr.result.points(points) }}</p>
      <p v-if="streakBonus > 0" class="bravo__streak">
        {{ fr.result.streakBonus(streak, streakBonus) }}
      </p>
      <InfoCard :text="anecdote" />
    </div>
    <template #actions>
      <BaseButton block @click="emit('next')">
        {{ regionComplete ? fr.result.continue : fr.result.next }}
      </BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.bravo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
}

.bravo__points {
  margin: 0;
  color: var(--text-medium);
  font-size: var(--font-size-14);
}

.bravo__streak {
  margin: 0;
  color: var(--text-high);
  font-weight: var(--font-weight-title);
}

.bravo :deep(.info-card) {
  margin-top: var(--space-8);
}
</style>
