<!-- Région terminée (maquette 11) : bonus de région, progression, région suivante. -->
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { gameConfig } from '@/config/game'
import { catalog } from '@/content/catalog'
import { nextRegionId } from '@/engine/classic'
import { fr } from '@/i18n/fr'
import { useGameStore } from '@/stores/game'
import { useProgressStore } from '@/stores/progress'

const { regionId } = defineProps<{ regionId: string }>()

const game = useGameStore()
const progress = useProgressStore()

const region = computed(() => catalog.regions.find((r) => r.id === regionId))
const bonus = computed(() => game.lastResult?.regionBonus ?? 0)
const total = gameConfig.classique.regionOrder.length
const done = computed(
  () => Object.values(progress.regions).filter((r) => r.status === 'done').length,
)
const nextId = computed(() => {
  const id = nextRegionId(regionId, gameConfig)
  return id && progress.isUnlocked(id) ? id : undefined
})
</script>

<template>
  <main v-if="region" class="region-done">
    <p class="region-done__eyebrow">{{ region.name }}</p>
    <ResultIcon variant="success" />
    <h1 class="region-done__title">{{ fr.regionDone.title }}</h1>
    <CauriChip :amount="bonus" signed :label="fr.regionDone.bonusLabel" />
    <div class="region-done__progress">
      <ProgressBar :value="done" :max="total" :label="fr.hub.griot(done, total)" />
    </div>

    <div class="region-done__actions">
      <template v-if="nextId">
        <BaseButton block :to="{ name: 'question', params: { regionId: nextId } }">
          {{ fr.regionDone.next }}
        </BaseButton>
        <BaseButton variant="secondary" block :to="{ name: 'tour', query: { region: nextId } }">
          {{ fr.regionDone.backToMap }}
        </BaseButton>
      </template>
      <!-- Dernière région : un seul bouton, qui devient le bouton principal. -->
      <BaseButton v-else block :to="{ name: 'tour' }">{{ fr.regionDone.backToMap }}</BaseButton>
    </div>
  </main>
</template>

<style scoped>
.region-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  max-width: 480px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: var(--space-32) var(--space-16) calc(var(--space-16) + env(safe-area-inset-bottom));
  text-align: center;
}

.region-done__eyebrow {
  margin: 0;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.region-done__title {
  margin: 0;
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
}

.region-done__progress {
  width: 100%;
  max-width: 320px;
}

.region-done__progress :deep(.progress__label) {
  text-align: center;
}

.region-done__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
  margin-top: auto;
}
</style>
