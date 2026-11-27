<!--
  Écran « Run terminé » (maquette 12, tâche D6) : score géant, record perso (TagPill reward),
  deux cartes de statistiques et actions (rejouer, retour au hub).
-->
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import TagPill from '@/components/TagPill.vue'
import { fr } from '@/i18n/fr'

const { score, isRecord, correct, total, bestStreak } = defineProps<{
  /** Score final obtenu pendant la session. */
  score: number
  /** Vrai si le score bat ou égale un record personnel. */
  isRecord: boolean
  /** Nombre d'énigmes résolues avec succès. */
  correct: number
  /** Nombre total d'énigmes jouées dans le run. */
  total: number
  /** Meilleure série de réponses consécutives justes. */
  bestStreak: number
}>()

const emit = defineEmits<{
  replay: []
  'back-to-hub': []
}>()
</script>

<template>
  <main class="run-done">
    <p class="run-done__eyebrow">{{ fr.runDone.eyebrow }}</p>
    <h1 class="run-done__title">{{ fr.runDone.title }}</h1>

    <div class="run-done__score-container">
      <span class="run-done__score-label">{{ fr.runDone.scoreLabel }}</span>
      <span class="run-done__score-value">{{ fr.runDone.score(score) }}</span>
      <TagPill v-if="isRecord" variant="reward">{{ fr.runDone.record }}</TagPill>
    </div>

    <div class="run-done__stats">
      <div class="run-done__stat-card">
        <span class="run-done__stat-value">{{ fr.runDone.correctValue(correct, total) }}</span>
        <span class="run-done__stat-label">{{ fr.runDone.correct }}</span>
      </div>
      <div class="run-done__stat-card">
        <span class="run-done__stat-value">{{ fr.runDone.streakValue(bestStreak) }}</span>
        <span class="run-done__stat-label">{{ fr.runDone.bestStreak }}</span>
      </div>
    </div>

    <div class="run-done__actions">
      <BaseButton block @click="emit('replay')">{{ fr.runDone.replay }}</BaseButton>
      <BaseButton variant="secondary" block @click="emit('back-to-hub')">
        {{ fr.runDone.backToHub }}
      </BaseButton>
    </div>
  </main>
</template>

<style scoped>
.run-done {
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

.run-done__eyebrow {
  margin: 0;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.run-done__title {
  margin: 0;
  color: var(--text-high);
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
  line-height: var(--line-height-title);
}

.run-done__score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  margin: var(--space-16) 0;
}

.run-done__score-label {
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.run-done__score-value {
  color: var(--text-high);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-display);
  line-height: var(--line-height-title);
}

.run-done__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  width: 100%;
  max-width: 320px;
  margin-bottom: var(--space-16);
}

.run-done__stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  min-height: 88px;
  margin-bottom: var(--depth);
  padding: var(--space-16) var(--space-12);
  border: var(--border-width-strong) solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  background: var(--surface-card);
  color: var(--text-high);
}

.run-done__stat-value {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-display);
  line-height: var(--line-height-title);
}

.run-done__stat-label {
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
}

.run-done__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
  margin-top: auto;
}
</style>
