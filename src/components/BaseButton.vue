<!--
  Bouton principal (vert) ou secondaire (blanc). Un seul bouton principal par écran.
  Avec `to`, il devient un lien du router, sinon c'est un <button>.
  La classe `is-pressed` affiche l'état pressé en permanence : elle sert uniquement à la page /kit.
-->
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const {
  variant = 'primary',
  size = 'md',
  to,
  disabled = false,
  block = false,
  type = 'button',
} = defineProps<{
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  to?: RouteLocationRaw
  disabled?: boolean
  /** Prend toute la largeur disponible. */
  block?: boolean
  type?: 'button' | 'submit'
}>()

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <span
    v-if="to && disabled"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`, { 'base-button--block': block }]"
    role="link"
    aria-disabled="true"
  >
    <slot />
  </span>
  <RouterLink
    v-else-if="to"
    :to="to"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`, { 'base-button--block': block }]"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`, { 'base-button--block': block }]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  --edge: var(--edge-strong);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-height: 48px;
  min-width: var(--touch-target);
  margin-bottom: var(--depth);
  padding: var(--space-12) var(--space-24);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--depth) 0 var(--edge);
  font: inherit;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-display);
  letter-spacing: 0.06em;
  line-height: var(--line-height-title);
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform var(--duration-fast) ease-out,
    box-shadow var(--duration-fast) ease-out;
  -webkit-tap-highlight-color: transparent;
}

.base-button--sm {
  min-height: var(--touch-target);
  padding: var(--space-8) var(--space-16);
  border-radius: var(--radius-md);
  font-size: var(--font-size-14);
}

.base-button--block {
  display: flex;
  width: 100%;
}

.base-button--primary {
  --edge: var(--action-primary-edge);
  background: var(--action-primary);
  color: var(--text-on-color);
}

.base-button--secondary {
  background: var(--action-secondary);
  border-color: var(--action-secondary-border);
  color: var(--text-high);
}

/* Pressé : l'épaisseur s'écrase, le bouton descend d'autant. */
.base-button:active:not(:disabled, [aria-disabled='true']),
.base-button.is-pressed {
  transform: translateY(var(--depth));
  box-shadow: 0 0 0 var(--edge);
}

.base-button--primary:active:not(:disabled, [aria-disabled='true']),
.base-button--primary.is-pressed {
  background: var(--action-primary-pressed);
}

.base-button:disabled,
.base-button[aria-disabled='true'] {
  background: var(--action-disabled-bg);
  border-color: transparent;
  box-shadow: none;
  transform: translateY(var(--depth));
  color: var(--action-disabled-text);
  cursor: not-allowed;
}
</style>
