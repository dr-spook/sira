<!--
  Petite puce de texte : format de l'énigme (« Carré »), série (« Série ×4 »), statut.
  Variante `neutral` pour l'instant ; la variante `reward` viendra avec l'écran Run terminé (tâche D6).
-->
<script setup lang="ts">
const { variant = 'neutral' } = defineProps<{
  variant?: 'neutral'
}>()
</script>

<template>
  <span class="tag-pill" :class="`tag-pill--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: 2px;
  padding: var(--space-4) var(--space-12);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 0 var(--edge-strong);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-title);
  line-height: var(--line-height-title);
  white-space: nowrap;
}

.tag-pill--neutral {
  background: var(--surface-card);
  color: var(--text-high);
}
</style>
