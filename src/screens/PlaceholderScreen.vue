<!-- Écran provisoire : vérifie que l'app tourne. Sera remplacé par le Splash et le Hub. -->
<script setup lang="ts">
import { fr } from '@/i18n/fr'
</script>

<template>
  <main class="placeholder">
    <h1 class="placeholder__title">{{ fr.appName }}</h1>
  </main>
</template>

<style scoped>
.placeholder {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 1rem;
}

.placeholder__title {
  margin: 0;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}
</style>
