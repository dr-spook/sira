<!--
  Modale « Utiliser un indice » (maquette 15) : les indices du format en cours, avec leur coût.
  Elle n'achète rien elle-même : elle prévient l'écran Question (`select`), qui paie via le store
  du jeu et gère les erreurs. Une ligne trop chère reste touchable : l'écran ouvrira alors la
  modale « Pas assez de Cauris ».
-->
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import GameModal from '@/components/GameModal.vue'
import { gameConfig } from '@/config/game'
import type { HintId } from '@/engine/config'
import type { Round } from '@/engine/round'
import { fr } from '@/i18n/fr'

const {
  open,
  format,
  balance,
  exhausted = [],
} = defineProps<{
  open: boolean
  /** Format de la manche en cours : seuls les indices qui s'y appliquent sont proposés. */
  format: Round['format']
  /** Cauris du joueur. */
  balance: number
  /** Indices qui ne servent plus à rien sur cette manche : grisés, avec un texte. */
  exhausted?: HintId[]
}>()

const emit = defineEmits<{ close: []; select: [hint: HintId] }>()

const hints = computed(() =>
  (Object.keys(gameConfig.hints) as HintId[])
    .filter((id) => gameConfig.hints[id].formats.includes(format))
    .map((id) => ({
      id,
      cost: gameConfig.hints[id].cost,
      missing: Math.max(gameConfig.hints[id].cost - balance, 0),
      exhausted: exhausted.includes(id),
    })),
)
</script>

<template>
  <GameModal :open="open" :title="fr.hint.title" dismissible @close="emit('close')">
    <ul class="hint-list">
      <li v-for="hint in hints" :key="hint.id">
        <button
          type="button"
          class="hint-row"
          :disabled="hint.exhausted"
          @click="emit('select', hint.id)"
        >
          <span class="hint-row__text">
            <span>{{ fr.hint.labels[hint.id] }}</span>
            <span v-if="hint.exhausted" class="hint-row__note">{{ fr.hint.nothingLeft }}</span>
            <span v-else-if="hint.missing > 0" class="hint-row__note">
              {{ fr.hint.missing(hint.missing) }}
            </span>
          </span>
          <CauriChip :amount="hint.cost" size="sm" />
        </button>
      </li>
    </ul>
    <template #actions>
      <BaseButton variant="secondary" block @click="emit('close')">{{ fr.hint.close }}</BaseButton>
    </template>
  </GameModal>
</template>

<style scoped>
.hint-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hint-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  width: 100%;
  min-height: var(--touch-target);
  padding: var(--space-12) var(--space-16);
  border: var(--border-width-strong) solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--depth) 0 var(--edge-strong);
  background: var(--surface-card);
  color: var(--text-high);
  font: inherit;
  font-weight: var(--font-weight-title);
  text-align: left;
  cursor: pointer;
}

.hint-row:disabled {
  border: var(--border-width) solid var(--border-soft);
  box-shadow: none;
  background: var(--surface-locked);
  color: var(--state-locked-text);
  cursor: default;
}

.hint-row__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.hint-row__note {
  color: var(--text-medium);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-body);
}
</style>
