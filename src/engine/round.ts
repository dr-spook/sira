// Une « manche » : une énigme en cours, dans un format donné (propositions ou plateau).
import { buildBoard, isBoardCorrect, type Board } from './board'
import { buildChoices, isCorrectChoice, type ChoiceSet } from './choices'
import type { Format, GameConfig } from './config'
import type { Rng } from './random'
import { err, ok, type Result } from './result'
import type { Puzzle } from './types'

export type Round =
  | { puzzleId: string; format: 'duo' | 'carre'; choices: ChoiceSet }
  | { puzzleId: string; format: 'direct'; board: Board }

/**
 * Prépare la manche d'une énigme. `previous` : la manche du passage précédent, quand une
 * énigme ratée revient ; propositions ou tuiles sont alors re-mélangées dans un autre ordre.
 */
export function createRound(
  puzzle: Puzzle,
  format: Format,
  allPuzzles: readonly Puzzle[],
  config: GameConfig,
  rng: Rng,
  previous?: Round,
): Result<Round, 'no-distractor'> {
  if (format === 'direct') {
    const previousBoard = previous?.format === 'direct' ? previous.board : undefined
    const board = buildBoard(
      puzzle,
      allPuzzles,
      { keepAccents: config.tiles.keepAccents, defaultDecoys: config.direct.defaultDecoys },
      rng,
      previousBoard,
    )
    return ok({ puzzleId: puzzle.id, format, board })
  }
  const previousChoices = previous && previous.format !== 'direct' ? previous.choices : undefined
  const choices = buildChoices(puzzle, allPuzzles, format, rng, previousChoices)
  if (!choices.ok) return err(choices.error)
  return ok({ puzzleId: puzzle.id, format, choices: choices.value })
}

/**
 * Vérifie la réponse : par identifiant pour Duo et Carré, tuile par tuile pour le Direct
 * (le plateau doit alors être rempli ; `choiceId` est ignoré).
 */
export function isRoundCorrect(round: Round, choiceId?: string): boolean {
  if (round.format === 'direct') return isBoardCorrect(round.board)
  return choiceId !== undefined && isCorrectChoice(round.choices, choiceId)
}
