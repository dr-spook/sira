<!--
  Écran Question (maquettes 4 et 5) : formats Carré, Duo et Direct.
  Après la réponse, le résultat reste visible (message « Juste ! » ou « Faux » avec une icône)
  pendant ui.resultRevealMs, puis la modale Bravo ou Réessayer s'ouvre. Toucher l'écran pendant
  ce délai ouvre la modale tout de suite.
  Après une erreur, la bonne réponse n'est JAMAIS montrée : le joueur réessaie la même énigme.
-->
<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AnswerOption, { type AnswerOptionState } from '@/components/AnswerOption.vue'
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import LetterSlot from '@/components/LetterSlot.vue'
import LetterTile from '@/components/LetterTile.vue'
import PuzzleImages from '@/components/PuzzleImages.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import TagPill from '@/components/TagPill.vue'
import { features } from '@/config/features'
import { gameConfig } from '@/config/game'
import { ui } from '@/config/ui'
import { catalog } from '@/content/catalog'
import { isBoardFull, letterOf } from '@/engine/board'
import { currentItem } from '@/engine/classic'
import type { Gain } from '@/engine/config'
import { baseGain } from '@/engine/economy'
import { fr } from '@/i18n/fr'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import BravoModal from './BravoModal.vue'
import RetryModal from './RetryModal.vue'

const { regionId } = defineProps<{ regionId: string }>()

const router = useRouter()
const game = useGameStore()
const player = usePlayerStore()

const phase = ref<'answering' | 'reveal' | 'modal'>('answering')
/** Ouvre la modale Indice : elle sera branchée par la tâche I3 (interrupteur hints). */
const hintsOpen = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | undefined

const region = computed(() => catalog.regions.find((r) => r.id === regionId))
const round = computed(() => game.round)
// L'énigme vient de la manche affichée, pas de la file : quand la dernière réponse termine la
// région, la file est vide mais l'écran (et la modale Bravo) doivent rester affichés.
const puzzle = computed(() => catalog.puzzles.find((p) => p.id === round.value?.puzzleId))
const result = computed(() => game.lastResult)

// Position (« 2/5 ») et gain (« +20 ») : figés au début de la manche, pour ne pas bouger
// pendant l'affichage du résultat.
const position = ref(1)
const gain = ref<Gain>()
watch(
  () => game.round,
  (next, previous) => {
    const item = game.run && currentItem(game.run)
    if (!next || next === previous || game.answered || !game.run || !item) return
    position.value = Math.min(game.run.successes + 1, game.run.target)
    gain.value = baseGain(item.format, item.failures > 0, gameConfig)
  },
  { immediate: true },
)

// --- Carré et Duo ---
const choices = computed(() =>
  round.value && round.value.format !== 'direct' ? round.value.choices : undefined,
)
const letters = ['A', 'B', 'C', 'D']
function optionState(id: string): AnswerOptionState {
  const set = choices.value
  if (!set) return 'idle'
  if (set.eliminated.includes(id)) return 'eliminated'
  if (!result.value || id !== result.value.choiceId) return 'idle'
  // Seule l'option choisie change d'état : en cas d'erreur, la bonne réponse reste cachée.
  return result.value.success ? 'correct' : 'wrong'
}

// --- Direct ---
const board = computed(() => (round.value?.format === 'direct' ? round.value.board : undefined))
const slotState = computed(() =>
  !result.value ? 'idle' : result.value.success ? 'correct' : 'wrong',
)
const isPlaced = (tileId: string) => board.value?.slots.includes(tileId) ?? false
const canValidate = computed(() => !!board.value && isBoardFull(board.value) && !game.answered)

// --- Réponse et résultat ---
async function choose(choiceId: string) {
  if (game.answered) return
  if (await game.submit(choiceId)) startReveal()
}

async function validate() {
  if (!canValidate.value) return
  if (await game.submit()) startReveal()
}

function startReveal() {
  phase.value = 'reveal'
  revealTimer = setTimeout(showModal, ui.resultRevealMs)
}

function showModal() {
  clearTimeout(revealTimer)
  if (phase.value === 'reveal') phase.value = 'modal'
}

function next() {
  if (result.value?.regionComplete) {
    router.push({ name: 'region-done', params: { regionId } })
    return
  }
  phase.value = 'answering'
  game.next()
}

onMounted(async () => {
  const sameRun = game.run?.regionId === regionId && game.round && !game.answered
  if (!sameRun) await game.startRegion(regionId)
  // Région verrouillée, inconnue ou déjà terminée : retour à la carte plutôt qu'un écran vide.
  if (!game.round) router.replace({ name: 'tour', query: { region: regionId } })
})

onBeforeUnmount(() => clearTimeout(revealTimer))
</script>

<template>
  <main
    v-if="region && round && puzzle"
    class="question"
    :class="{ 'is-revealing': phase === 'reveal' }"
    @click="phase === 'reveal' && showModal()"
  >
    <ScreenHeader
      :title="fr.question.progress(region.name, position, game.run?.target ?? 0)"
      :back="{ name: 'tour', query: { region: regionId } }"
    >
      <template #end><CauriChip :amount="player.profile.cauris" /></template>
    </ScreenHeader>

    <div class="question__tags">
      <TagPill>{{ fr.formats[round.format] }}</TagPill>
      <CauriChip v-if="gain" :amount="gain.cauris" size="sm" signed />
    </div>

    <h2 class="question__prompt">
      {{ round.format === 'direct' ? fr.question.promptDirect : fr.question.promptChoice }}
    </h2>

    <PuzzleImages :images="puzzle.images" />

    <!-- Carré et Duo -->
    <div
      v-if="choices"
      class="question__options"
      :class="`question__options--${round.format}`"
      role="group"
      :aria-label="fr.question.optionsLabel"
    >
      <AnswerOption
        v-for="(option, index) in choices.options"
        :key="option.id"
        :letter="letters[index]"
        :label="option.label"
        :state="optionState(option.id)"
        :disabled="game.answered"
        @select="choose(option.id)"
      />
    </div>

    <!-- Direct -->
    <template v-if="board">
      <div class="question__slots" role="group" :aria-label="fr.question.slotsLabel">
        <LetterSlot
          v-for="(tileId, index) in board.slots"
          :key="index"
          :letter="letterOf(board, tileId)"
          :state="slotState"
          @clear="game.tapSlot(index)"
        />
      </div>
      <div class="question__bank" role="group" :aria-label="fr.question.bankLabel">
        <template v-for="tile in board.tiles" :key="tile.id">
          <!-- Une tuile posée laisse sa place vide : le plateau ne bouge pas. -->
          <span v-if="isPlaced(tile.id)" class="question__bank-gap" aria-hidden="true" />
          <LetterTile
            v-else
            :letter="tile.letter"
            :state="board.removed.includes(tile.id) ? 'disabled' : 'bank'"
            @press="game.tapTile(tile.id)"
          />
        </template>
      </div>
    </template>

    <!-- Signal texte et icône : la couleur n'est jamais le seul signal (note de LetterSlot). -->
    <p
      class="question__feedback"
      :class="result ? (result.success ? 'is-correct' : 'is-wrong') : ''"
      role="status"
    >
      <template v-if="result">
        <Check v-if="result.success" :size="20" :stroke-width="3" aria-hidden="true" />
        <X v-else :size="20" :stroke-width="3" aria-hidden="true" />
        {{ result.success ? fr.question.correct : fr.question.wrong }}
        <span v-if="phase === 'reveal'" class="question__skip">{{ fr.question.skip }}</span>
      </template>
    </p>

    <BaseButton v-if="board" block :disabled="!canValidate" @click="validate">
      {{ fr.question.validate }}
    </BaseButton>

    <footer class="question__footer">
      <BaseButton
        v-if="features.hints"
        variant="secondary"
        size="sm"
        :disabled="game.answered"
        @click="hintsOpen = true"
      >
        {{ fr.question.hint }}
      </BaseButton>
      <RouterLink class="question__give-up" :to="{ name: 'tour', query: { region: regionId } }">
        {{ fr.question.giveUp }}
      </RouterLink>
    </footer>

    <template v-if="result">
      <BravoModal
        v-if="result.success"
        :open="phase === 'modal'"
        :cauris="result.reward.cauris"
        :points="result.reward.points"
        :streak="result.reward.streak"
        :streak-bonus="result.reward.streakBonus"
        :anecdote="result.puzzle.anecdote.text"
        :region-complete="result.regionComplete"
        @next="next"
      />
      <RetryModal v-else :open="phase === 'modal'" :loss="-result.reward.cauris" @retry="next" />
    </template>
  </main>
</template>

<style scoped>
.question {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  max-width: 480px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 0 var(--space-16) calc(var(--space-16) + env(safe-area-inset-bottom));
}

.is-revealing {
  cursor: pointer;
}

.question__tags {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.question__prompt {
  margin: 0;
  font-size: var(--font-size-20);
}

.question__options {
  display: grid;
  gap: var(--space-8);
}

.question__slots,
.question__bank {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-8);
}

.question__bank-gap {
  width: 48px;
  height: calc(48px + var(--depth));
}

.question__feedback {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-4) var(--space-8);
  min-height: 28px;
  margin: 0;
  font-weight: var(--font-weight-display);
}

.question__feedback.is-correct {
  color: var(--state-success-text);
}

.question__feedback.is-wrong {
  color: var(--state-error-text);
}

.question__skip {
  flex-basis: 100%;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-body);
  text-align: center;
}

.question__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-16);
}

.question__give-up {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-target);
  margin-left: auto;
  padding: 0 var(--space-8);
  color: var(--text-medium);
  font-weight: var(--font-weight-title);
  text-decoration: none;
}
</style>
