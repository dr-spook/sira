<!--
  Hub (maquette 2) : Cauris, progression « Griot du Faso », cartes des modes.
  Seul le Classique est jouable ; les autres cartes suivent src/config/features.ts.
-->
<script setup lang="ts">
import { computed } from 'vue'
import CauriChip from '@/components/CauriChip.vue'
import ModeCard from '@/components/ModeCard.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import { features } from '@/config/features'
import { gameConfig } from '@/config/game'
import { fr } from '@/i18n/fr'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'

const player = usePlayerStore()
const progress = useProgressStore()

const total = gameConfig.classique.regionOrder.length
const done = computed(
  () => Object.values(progress.regions).filter((region) => region.status === 'done').length,
)

interface Mode {
  id: string
  title: string
  subtitle: string
  locked: boolean
  lockLabel?: string
}

// Une fonctionnalité pas encore livrée affiche « Bientôt » : on ne promet ni date ni contenu.
const otherModes = computed<Mode[]>(() => [
  {
    id: 'champion',
    title: fr.hub.champion.title,
    subtitle: fr.hub.champion.subtitle(gameConfig.timers.championSeconds),
    locked: !features.champion || !player.championUnlocked(),
    lockLabel: features.champion
      ? fr.hub.champion.condition(gameConfig.unlocks.champion.classiquePoints)
      : fr.common.soon,
  },
  {
    id: 'maitre',
    title: fr.hub.maitre.title,
    subtitle: fr.hub.maitre.subtitle(gameConfig.timers.maitreSeconds),
    locked: true,
    lockLabel: features.maitre ? fr.hub.maitre.condition : fr.common.soon,
  },
  {
    id: 'puzzle',
    title: fr.hub.puzzle.title,
    subtitle: fr.hub.puzzle.subtitle,
    locked: true,
    lockLabel: fr.common.soon,
  },
  {
    id: 'multiplayer',
    title: fr.hub.multiplayer.title,
    subtitle: fr.hub.multiplayer.subtitle,
    locked: true,
    lockLabel: fr.common.soon,
  },
])
</script>

<template>
  <main class="hub">
    <ScreenHeader :title="fr.appName" brand>
      <template #end><CauriChip :amount="player.profile.cauris" /></template>
    </ScreenHeader>

    <p class="hub__intro">{{ fr.hub.chooseMode }}</p>
    <ProgressBar :value="done" :max="total" :segments="total" :label="fr.hub.griot(done, total)" />

    <div class="hub__modes">
      <ModeCard
        :title="fr.hub.classique.title"
        :subtitle="fr.hub.classique.subtitle"
        :to="{ name: 'tour' }"
      />
      <ModeCard
        v-for="mode in otherModes"
        :key="mode.id"
        :title="mode.title"
        :subtitle="mode.subtitle"
        :locked="mode.locked"
        :lock-label="mode.lockLabel"
      />
    </div>
  </main>
</template>

<style scoped>
.hub {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--space-16) var(--space-32);
}

.hub__intro {
  margin: var(--space-8) 0;
  color: var(--text-medium);
}

.hub__modes {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin-top: var(--space-24);
}
</style>
