<!-- Encadré « La réponse était » : la bonne réponse en vert, après une erreur ou un temps écoulé. -->
<script setup lang="ts">
import { fr } from '@/i18n/fr'

const { answer } = defineProps<{ answer: string }>()
</script>

<template>
  <div class="answer-reveal">
    <p class="answer-reveal__label">{{ fr.result.answerWas }}</p>
    <p class="answer-reveal__answer">{{ answer }}</p>
  </div>
</template>

<style scoped>
.answer-reveal {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  border: var(--border-width) solid var(--state-success);
  border-radius: var(--radius-lg);
  background: var(--state-success-bg);
  color: var(--state-success-text);
  text-align: center;
}

.answer-reveal__label {
  margin: 0;
  font-size: var(--font-size-14);
}

.answer-reveal__answer {
  margin: var(--space-4) 0 0;
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
  letter-spacing: 0.06em;
  line-height: var(--line-height-title);
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
</style>
