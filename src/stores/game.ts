// Partie en cours du mode Classique : file d'énigmes d'une région, manche en cours, indices,
// réponses. Relie l'engine (les règles) à la sauvegarde (via les stores player et progress).
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { gameConfig } from '@/config/game'
import { catalog } from '@/content/catalog'
import { addHistory, solvedPuzzleIds, unlockAnecdote } from '@/db/repository'
import { answerKey } from '@/engine/answers'
import { clearSlot, isBoardFull, placeTile } from '@/engine/board'
import {
  currentItem,
  isRegionComplete,
  recordAnswer,
  startRegionRun,
  type RegionRun,
} from '@/engine/classic'
import type { HintId } from '@/engine/config'
import { answerReward, regionBonus, type Reward } from '@/engine/economy'
import { applyHint, type HintError } from '@/engine/hints'
import { createRng, type Rng } from '@/engine/random'
import type { Result } from '@/engine/result'
import { createRound, isRoundCorrect, type Round } from '@/engine/round'
import type { Puzzle } from '@/engine/types'
import { usePlayerStore } from './player'
import { useProgressStore } from './progress'

export interface AnswerResult {
  success: boolean
  reward: Reward
  puzzle: Puzzle
  /** Bonus de région, versé si cette réponse termine la région (0 sinon). */
  regionBonus: number
  regionComplete: boolean
}

const puzzleById = new Map(catalog.puzzles.map((p) => [p.id, p]))

/** Graine d'une partie. Le hasard est permis ici (hors de l'engine). */
function newSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]!
}

export const useGameStore = defineStore('game', () => {
  const run = ref<RegionRun | null>(null)
  const round = shallowRef<Round | null>(null)
  const seed = ref<number | null>(null)
  const error = ref<string | null>(null)
  // Le générateur n'est pas réactif : Vue n'a pas à suivre son état interne.
  let rng: Rng = createRng(0)
  // Dernière manche de chaque énigme ratée : sa reprise sera mélangée dans un autre ordre.
  const previousRounds = new Map<string, Round>()

  const currentPuzzle = computed(() => {
    const item = run.value && currentItem(run.value)
    return item ? puzzleById.get(item.puzzleId) : undefined
  })

  /** Commence (ou reprend) une région. `forcedSeed` servira au Duel (même graine, mêmes énigmes). */
  async function startRegion(regionId: string, forcedSeed?: number) {
    const player = usePlayerStore()
    const progress = useProgressStore()
    if (!player.loaded) await player.load()
    if (!progress.loaded) await progress.load()
    if (!progress.isUnlocked(regionId)) {
      error.value = 'region-locked'
      return
    }

    seed.value = forcedSeed ?? newSeed()
    rng = createRng(seed.value)
    previousRounds.clear()
    error.value = null

    const solved = await solvedPuzzleIds()
    const inRegion = catalog.puzzles.filter((p) => p.regionId === regionId)
    const elsewhere = catalog.puzzles.filter((p) => p.regionId !== regionId && solved.has(p.id))

    run.value = startRegionRun(
      {
        regionId,
        puzzles: catalog.puzzles,
        solvedInRegion: inRegion.filter((p) => solved.has(p.id)).map((p) => p.id),
        solvedAnswerKeys: elsewhere.map((p) => answerKey(p.answer)),
      },
      gameConfig,
      rng,
    )

    if (import.meta.env.DEV && run.value.shortfall > 0) {
      console.warn(
        `[SIRA] Région « ${regionId} » : ${run.value.target} énigme(s) au lieu de ${gameConfig.classique.puzzlesPerRegion}. L'objectif est réduit à ${run.value.target}.`,
      )
    }

    if (isRegionComplete(run.value)) {
      // Région sans énigme (ou déjà toute réussie) : validée tout de suite, sans bonus.
      await progress.completeRegion(regionId, run.value.successes)
      round.value = null
      return
    }
    prepareRound()
  }

  function prepareRound() {
    const item = run.value && currentItem(run.value)
    const puzzle = item && puzzleById.get(item.puzzleId)
    if (!item || !puzzle) {
      round.value = null
      return
    }
    const result = createRound(
      puzzle,
      item.format,
      catalog.puzzles,
      gameConfig,
      rng,
      previousRounds.get(puzzle.id),
    )
    if (result.ok) {
      round.value = result.value
    } else {
      round.value = null
      error.value = result.error
    }
  }

  function tapTile(tileId: string) {
    if (round.value?.format !== 'direct') return
    round.value = { ...round.value, board: placeTile(round.value.board, tileId) }
  }

  function tapSlot(index: number) {
    if (round.value?.format !== 'direct') return
    round.value = { ...round.value, board: clearSlot(round.value.board, index) }
  }

  /** Utilise un indice. En cas d'erreur, rien n'est payé ni modifié. */
  async function requestHint(hint: HintId): Promise<Result<unknown, HintError>> {
    const player = usePlayerStore()
    if (!round.value) return { ok: false, error: 'wrong-format' }
    const result = applyHint(hint, round.value, player.profile.cauris, gameConfig, rng)
    if (result.ok) {
      await player.spendCauris(result.value.cost)
      round.value = result.value.round
    }
    return result
  }

  /**
   * Valide la réponse. `choiceId` pour Duo et Carré ; pour le Direct, le plateau doit être rempli.
   * Renvoie undefined si la réponse n'est pas encore complète.
   */
  async function submit(choiceId?: string): Promise<AnswerResult | undefined> {
    const player = usePlayerStore()
    const progress = useProgressStore()
    const current = round.value
    const item = run.value && currentItem(run.value)
    const puzzle = item && puzzleById.get(item.puzzleId)
    if (!current || !item || !puzzle || !run.value) return undefined
    if (current.format === 'direct' ? !isBoardFull(current.board) : choiceId === undefined) {
      return undefined
    }

    const success = isRoundCorrect(current, choiceId)
    const reward = answerReward(
      { format: item.format, success, streak: player.profile.streak, isRetry: item.failures > 0 },
      gameConfig,
    )
    await player.applyReward(reward)
    await addHistory({
      puzzleId: puzzle.id,
      mode: 'classique',
      format: item.format,
      success,
      date: Date.now(),
    })

    if (success) {
      await unlockAnecdote(puzzle.id)
      previousRounds.delete(puzzle.id)
    } else {
      previousRounds.set(puzzle.id, current)
    }

    run.value = recordAnswer(run.value, success)
    const regionComplete = isRegionComplete(run.value)
    let bonus = 0
    if (regionComplete) {
      bonus = regionBonus(gameConfig)
      await player.addCauris(bonus)
      await progress.completeRegion(run.value.regionId, run.value.successes)
    } else if (success) {
      await progress.recordSuccess(run.value.regionId, run.value.successes)
    }

    round.value = null
    return { success, reward, puzzle, regionBonus: bonus, regionComplete }
  }

  /** Passe à l'énigme suivante de la file (après la modale Bravo ou Presque). */
  function next() {
    if (run.value && !isRegionComplete(run.value)) prepareRound()
  }

  return {
    run,
    round,
    seed,
    error,
    currentPuzzle,
    startRegion,
    tapTile,
    tapSlot,
    requestHint,
    submit,
    next,
  }
})
