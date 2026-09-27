<!-- Splash (maquette 1) : logo, chargement de la sauvegarde, puis passage automatique au Hub. -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/brand/logo-sira-640.webp'
import ProgressBar from '@/components/ProgressBar.vue'
import { ui } from '@/config/ui'
import { fr } from '@/i18n/fr'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const player = usePlayerStore()
const progress = useProgressStore()
const loaded = ref(0)

onMounted(async () => {
  const minimum = new Promise((resolve) => setTimeout(resolve, ui.splashMinDurationMs))
  loaded.value = 0.2
  await player.ensureLoaded()
  loaded.value = 0.6
  await progress.ensureLoaded()
  loaded.value = 1
  await minimum
  // replace : le bouton « retour » du téléphone ne ramène pas au Splash.
  router.replace({ name: 'hub' })
})
</script>

<template>
  <main class="splash">
    <img class="splash__logo" :src="logo" :alt="fr.splash.logoAlt" width="640" height="488" />
    <div class="splash__loading">
      <ProgressBar :value="loaded" :max="1" :label="fr.splash.loading" />
    </div>
  </main>
</template>

<style scoped>
.splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-40);
  min-height: 100dvh;
  padding: var(--space-24);
  /* Fond blanc, comme la maquette couleur : le logo a lui-même un fond blanc. */
  background: var(--surface-card);
}

.splash__logo {
  width: min(320px, 80vw);
  height: auto;
}

.splash__loading {
  width: min(320px, 80vw);
}

.splash__loading :deep(.progress__label) {
  text-align: center;
}
</style>
