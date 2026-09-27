// Les 3 indices. Chaque fonction renvoie la nouvelle manche et le coût payé, ou une erreur typée.
// Rien n'est modifié en place : l'appelant remplace l'ancienne manche par la nouvelle.
import type { Board } from './board'
import type { GameConfig, HintId } from './config'
import type { Rng } from './random'
import { err, ok, type Result } from './result'
import type { Round } from './round'

export type HintError = 'insufficient-cauris' | 'wrong-format' | 'nothing-left'

export interface HintSuccess {
  round: Round
  cost: number
  /** Solde après paiement. */
  balance: number
}

/**
 * Applique un indice. Ordre des vérifications : format, puis « plus rien à faire », puis solde,
 * pour ne jamais faire payer un indice qui ne servirait à rien.
 */
export function applyHint(
  hint: HintId,
  round: Round,
  balance: number,
  config: GameConfig,
  rng: Rng,
): Result<HintSuccess, HintError> {
  const { cost, formats } = config.hints[hint]
  if (!formats.includes(round.format)) return err('wrong-format')

  const next = computeHint(hint, round, rng)
  if (!next) return err('nothing-left')
  if (balance < cost) return err('insufficient-cauris')
  return ok({ round: next, cost, balance: balance - cost })
}

function computeHint(hint: HintId, round: Round, rng: Rng): Round | undefined {
  if (round.format === 'direct') {
    const board =
      hint === 'retirer_leurre'
        ? removeDecoy(round.board, rng)
        : hint === 'placer_lettre'
          ? placeLetter(round.board)
          : undefined
    return board && { ...round, board }
  }
  if (hint !== 'eliminer_2') return undefined
  const { choices } = round
  const remaining = choices.options.filter(
    (option) => option.id !== choices.correctId && !choices.eliminated.includes(option.id),
  )
  // Il faut 2 mauvaises réponses à retirer, sinon l'indice donnerait la réponse ou ne servirait à rien.
  if (remaining.length < 2) return undefined
  const removed = rng
    .shuffle(remaining)
    .slice(0, 2)
    .map((option) => option.id)
  return { ...round, choices: { ...choices, eliminated: [...choices.eliminated, ...removed] } }
}

/** Retire un leurre au hasard (et le sort de sa case s'il y était posé). */
export function removeDecoy(board: Board, rng: Rng): Board | undefined {
  const candidates = board.tiles.filter((tile) => tile.decoy && !board.removed.includes(tile.id))
  const target = rng.pick(candidates)
  if (!target) return undefined
  return {
    ...board,
    removed: [...board.removed, target.id],
    slots: board.slots.map((slot) => (slot === target.id ? null : slot)),
  }
}

/**
 * Place la bonne lettre dans la première case (en partant de la gauche) qui est vide ou fausse,
 * et la verrouille. La tuile qui occupait la case retourne dans la banque.
 */
export function placeLetter(board: Board): Board | undefined {
  const letterIn = (slot: string | null) => board.tiles.find((tile) => tile.id === slot)?.letter
  const index = board.expected.findIndex(
    (letter, i) => !board.locked[i] && letterIn(board.slots[i] ?? null) !== letter,
  )
  if (index === -1) return undefined
  const letter = board.expected[index]

  // Une tuile de la bonne lettre, pas retirée, pas déjà verrouillée ailleurs.
  // De préférence une tuile encore dans la banque (non posée).
  const usable = board.tiles.filter(
    (tile) =>
      tile.letter === letter &&
      !board.removed.includes(tile.id) &&
      !board.slots.some((slot, i) => slot === tile.id && board.locked[i]),
  )
  const tile = usable.find((t) => !board.slots.includes(t.id)) ?? usable[0]
  if (!tile) return undefined

  const slots = board.slots.map((slot) => (slot === tile.id ? null : slot))
  slots[index] = tile.id
  const locked = [...board.locked]
  locked[index] = true
  return { ...board, slots, locked }
}
