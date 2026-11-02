<!--
  Modale « Temps écoulé » : en mode chrono, quand le temps est fini, on montre la bonne réponse
  (contrairement au Classique, où le joueur réessaie). Le 0 est rouge : c'est le temps qui est
  en cause, pas le joueur (couleurs-v1.md §6).
-->
<script setup lang="ts">
import AnswerReveal from '@/components/AnswerReveal.vue'
import BaseButton from '@/components/BaseButton.vue'
import ChronoRing from '@/components/ChronoRing.vue'
import GameModal from '@/components/GameModal.vue'
import { fr } from '@/i18n/fr'

const { open, answer } = defineProps<{
  open: boolean
  /** La bonne réponse, affichée au joueur. */
  answer: string
}>()

const emit = defineEmits<{ next: [] }>()
</script>

<template>
  <GameModal :open="open" :title="fr.timeUp.title">
    <template #icon><ChronoRing :seconds="0" :total="1" :show-unit="false" /></template>
    <AnswerReveal :answer="answer" />
    <template #actions>
      <BaseButton block @click="emit('next')">{{ fr.timeUp.button }}</BaseButton>
    </template>
  </GameModal>
</template>
