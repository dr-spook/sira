// Progression du mode Classique (le Tour du Faso) : tirage des énigmes d'une région,
// file d'attente, validation de la région et déblocage de la suivante.
import { answerKey } from './answers'
import type { Format, GameConfig } from './config'
import type { Rng } from './random'
import type { Puzzle } from './types'

export type RegionStatus = 'locked' | 'in-progress' | 'done'

export interface QueueItem {
  puzzleId: string
  format: Format
  /** Nombre d'échecs sur cette énigme pendant la partie. Plus de 0 : c'est une reprise. */
  failures: number
}

export interface RegionRun {
  regionId: string
  /** Nombre de réussites nécessaires pour valider la région. */
  target: number
  /** Nombre d'énigmes qui manquent pour atteindre puzzlesPerRegion (0 si la région est complète). */
  shortfall: number
  successes: number
  queue: QueueItem[]
}

/**
 * Format de chaque énigme quand la région en a `count`. Les positions sont réparties sur toute
 * la longueur de formatByPosition : position i = arrondi(i × (L − 1) / (count − 1)).
 * Avec L = 5 : 1 → carre ; 2 → carre, direct ; 3 → carre, carre, direct ; 4 → carre, carre, direct, direct.
 */
export function formatsForCount(count: number, formatByPosition: readonly Format[]): Format[] {
  const last = formatByPosition.length - 1
  if (count <= 0 || last < 0) return []
  if (count === 1) return [formatByPosition[0]!]
  return Array.from(
    { length: count },
    (_, i) => formatByPosition[Math.round((i * last) / (count - 1))]!,
  )
}

/**
 * Objectif d'une région : puzzlesPerRegion, ou moins si la région manque d'énigmes.
 * Sert à afficher « 3/5 » sur la carte avant même d'avoir commencé la région.
 */
export function regionTarget(
  regionId: string,
  puzzles: readonly Puzzle[],
  config: GameConfig,
): number {
  const available = puzzles.filter((p) => p.regionId === regionId).length
  return Math.min(config.classique.puzzlesPerRegion, available)
}

/** Région à mettre en avant : la première « en cours » dans l'ordre du Tour. */
export function currentRegionId(progress: RegionProgress, config: GameConfig): string | undefined {
  return config.classique.regionOrder.find((id) => progress[id]?.status === 'in-progress')
}

export interface RegionRunInput {
  regionId: string
  puzzles: readonly Puzzle[]
  /** Énigmes de cette région déjà réussies (reprise après fermeture de l'app). */
  solvedInRegion?: readonly string[]
  /** Clés des réponses déjà trouvées dans d'autres régions (utilisé si reuseSolvedAnswers vaut false). */
  solvedAnswerKeys?: readonly string[]
}

/**
 * Tire les énigmes d'une région. Logique A d'abord, puis B (gradient du GDD), mélangées à
 * l'intérieur de chaque groupe. Si la région a moins d'énigmes que puzzlesPerRegion, l'objectif
 * devient le nombre disponible, et `shortfall` indique combien il en manque.
 */
export function startRegionRun(input: RegionRunInput, config: GameConfig, rng: Rng): RegionRun {
  const { puzzlesPerRegion, formatByPosition, reuseSolvedAnswers } = config.classique
  const solvedHere = new Set(input.solvedInRegion ?? [])
  const solvedElsewhere = new Set(input.solvedAnswerKeys ?? [])

  const available = input.puzzles.filter(
    (p) =>
      p.regionId === input.regionId &&
      (reuseSolvedAnswers || solvedHere.has(p.id) || !solvedElsewhere.has(answerKey(p.answer))),
  )
  const target = Math.min(puzzlesPerRegion, available.length)
  const successes = Math.min(solvedHere.size, target)

  const remaining = available.filter((p) => !solvedHere.has(p.id))
  const ordered = [
    ...rng.shuffle(remaining.filter((p) => p.logic === 'A')),
    ...rng.shuffle(remaining.filter((p) => p.logic === 'B')),
  ].slice(0, target - successes)

  // Les formats suivent la position dans la région : une reprise continue là où on s'était arrêté.
  const formats = formatsForCount(target, formatByPosition)
  const queue = ordered.map((puzzle, i) => ({
    puzzleId: puzzle.id,
    format: formats[successes + i]!,
    failures: 0,
  }))

  return {
    regionId: input.regionId,
    target,
    shortfall: puzzlesPerRegion - target,
    successes,
    queue,
  }
}

export function currentItem(run: RegionRun): QueueItem | undefined {
  return run.queue[0]
}

/**
 * Enregistre la réponse à l'énigme en tête de file. Réussie : elle sort de la file.
 * Ratée : elle reste en tête, le joueur la réessaie tout de suite (avec le même format ;
 * propositions ou tuiles sont re-mélangées par createRound). La réponse n'est jamais montrée.
 */
export function recordAnswer(run: RegionRun, success: boolean): RegionRun {
  const [head, ...rest] = run.queue
  if (!head) return run
  if (success) return { ...run, successes: run.successes + 1, queue: rest }
  return { ...run, queue: [{ ...head, failures: head.failures + 1 }, ...rest] }
}

export function isRegionComplete(run: RegionRun): boolean {
  return run.successes >= run.target
}

export type RegionProgress = Record<string, { status: RegionStatus; successes: number }>

/** Progression de départ : seule la première région de regionOrder est ouverte. */
export function initialProgress(config: GameConfig): RegionProgress {
  return Object.fromEntries(
    config.classique.regionOrder.map((id, index) => [
      id,
      { status: index === 0 ? 'in-progress' : 'locked', successes: 0 },
    ]),
  ) as RegionProgress
}

export function nextRegionId(regionId: string, config: GameConfig): string | undefined {
  const order = config.classique.regionOrder
  const index = order.indexOf(regionId)
  return index === -1 ? undefined : order[index + 1]
}

/** Marque la région terminée et ouvre la suivante de regionOrder (si elle était verrouillée). */
export function completeRegion(
  progress: RegionProgress,
  regionId: string,
  successes: number,
  config: GameConfig,
): RegionProgress {
  const next = { ...progress, [regionId]: { status: 'done' as const, successes } }
  const nextId = nextRegionId(regionId, config)
  if (nextId && next[nextId]?.status === 'locked') {
    next[nextId] = { status: 'in-progress', successes: 0 }
  }
  return next
}

/** Vrai quand les 17 régions sont terminées : le joueur devient Griot du Faso. */
export function isTourComplete(progress: RegionProgress, config: GameConfig): boolean {
  return config.classique.regionOrder.every((id) => progress[id]?.status === 'done')
}
