<!-- Cauri (coquillage, la monnaie du jeu). Prend la couleur du texte autour (currentColor). -->
<script setup lang="ts">
const { size = '1em', title } = defineProps<{
  size?: string | number
  /** Texte lu par les lecteurs d'écran. Sans title, l'icône est décorative. */
  title?: string
}>()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
    focusable="false"
  >
    <title v-if="title">{{ title }}</title>
    <ellipse cx="12" cy="12" rx="7" ry="10" />
    <path d="M12 5.5v13" />
    <path d="M9.5 8h2.5M9.5 11h2.5M9.5 14h2.5M9.5 17h2.5" />
    <path d="M12 8h2.5M12 11h2.5M12 14h2.5M12 17h2.5" />
  </svg>
</template>
