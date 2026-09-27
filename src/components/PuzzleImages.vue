<!--
  Les 4 images d'une énigme, en grille 2 × 2, recadrées pour remplir leur case (object-fit: cover).
  Si une image manque (npm run content pas encore lancé), une case grise « Image 1 » la remplace.
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { fr } from '@/i18n/fr'

const { images } = defineProps<{
  /** Noms des fichiers WebP (dans public/content/img/), dans l'ordre d'affichage. */
  images: readonly string[]
}>()

const failed = ref<Set<string>>(new Set())
watch(
  () => images,
  () => (failed.value = new Set()),
)

const src = (name: string) => `${import.meta.env.BASE_URL}content/img/${name}`
const markFailed = (name: string) => (failed.value = new Set([...failed.value, name]))
</script>

<template>
  <ul class="puzzle-images" :aria-label="fr.question.images">
    <li v-for="(name, index) in images" :key="`${index}-${name}`" class="puzzle-images__cell">
      <span v-if="failed.has(name)" class="puzzle-images__fallback">
        {{ fr.question.imageFallback(index + 1) }}
      </span>
      <img
        v-else
        :src="src(name)"
        alt=""
        decoding="async"
        width="480"
        height="300"
        @error="markFailed(name)"
      />
    </li>
  </ul>
</template>

<style scoped>
.puzzle-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.puzzle-images__cell {
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: var(--border-width) solid var(--border-soft);
  border-radius: var(--radius-md);
  background: var(--surface-locked);
}

.puzzle-images__cell img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.puzzle-images__fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
