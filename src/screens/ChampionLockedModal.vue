<!--
  Modale « Champion verrouillé » : s'ouvre au toucher de la carte Champion tant que le joueur
  n'a pas assez de points en Classique. Échap et un toucher sur le voile la ferment.
-->
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import GameModal from '@/components/GameModal.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ResultIcon from '@/components/ResultIcon.vue'
import { fr } from '@/i18n/fr'

const { open, points, required } = defineProps<{
  open: boolean
  /** Points du joueur en Classique. */
  points: number
  /** Points à atteindre pour débloquer le mode Champion. */
  required: number
}>()

const emit = defineEmits<{ close: []; 'play-classic': [] }>()
</script>

<template>
  <GameModal :open="open" :title="fr.championLocked.title" dismissible @close="emit('close')">
    <template #icon><ResultIcon variant="locked" /></template>
    <p class="champion-locked__text">{{ fr.championLocked.text(required) }}</p>
    <ProgressBar
      :value="points"
      :max="required"
      :label="fr.championLocked.progress(points, required)"
    />
    <template #actions>
      <BaseButton block @click="emit('play-classic')">{{ fr.championLocked.button }}</BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.champion-locked__text {
  margin: 0 0 var(--space-16);
}
</style>
