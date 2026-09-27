<!--
  Carte « Le savais-tu ? », coiffée de la bande tissée rouge, jaune et vert
  (élément signature, couleurs-v1.md §8.3 ; maquette Bravo).
  Le texte passe par la prop `text` ou par l'emplacement par défaut.
-->
<script setup lang="ts">
import { fr } from '@/i18n/fr'

const {
  title = fr.infoCard.title,
  text,
  pattern = true,
} = defineProps<{
  title?: string
  text?: string
  /** Affiche la bande de motif en haut de la carte. */
  pattern?: boolean
}>()
</script>

<template>
  <section class="info-card">
    <div v-if="pattern" class="info-card__pattern" aria-hidden="true" />
    <div class="info-card__body">
      <h3 class="info-card__title">{{ title }}</h3>
      <div class="info-card__text">
        <slot>{{ text }}</slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.info-card {
  overflow: hidden;
  width: 100%;
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  color: var(--text-high);
  text-align: left;
}

/* Blocs de 13 px rouge, jaune, vert, séparés par un trait encre de 3 px, comme sur la maquette. */
.info-card__pattern {
  --block: 13px;
  --gap: 3px;
  --step: calc(var(--block) + var(--gap));

  height: 8px;
  border-bottom: var(--border-width) solid var(--pattern-gap);
  background: repeating-linear-gradient(
    to right,
    var(--pattern-red) 0 var(--block),
    var(--pattern-gap) var(--block) var(--step),
    var(--pattern-yellow) var(--step) calc(var(--step) + var(--block)),
    var(--pattern-gap) calc(var(--step) + var(--block)) calc(var(--step) * 2),
    var(--pattern-green) calc(var(--step) * 2) calc(var(--step) * 2 + var(--block)),
    var(--pattern-gap) calc(var(--step) * 2 + var(--block)) calc(var(--step) * 3)
  );
}

.info-card__body {
  padding: var(--space-12) var(--space-16) var(--space-16);
}

.info-card__title {
  margin: 0 0 var(--space-8);
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.info-card__text {
  font-size: var(--font-size-16);
  line-height: var(--line-height-body);
}
</style>
