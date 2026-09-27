// Propositions des formats Duo (1 fausse) et Carré (3 fausses).
import { answerKey } from './answers'
import { shuffleDifferent, type Rng } from './random'
import { err, ok, type Result } from './result'
import type { Puzzle } from './types'

export type ChoiceFormat = 'duo' | 'carre'

export interface Choice {
  /** Clé de la réponse (voir answerKey) : sert à vérifier le choix du joueur. */
  id: string
  label: string
}

export interface ChoiceSet {
  format: ChoiceFormat
  options: Choice[]
  correctId: string
  /** Identifiants retirés par l'indice « Éliminer 2 mauvaises réponses ». */
  eliminated: string[]
}

const WRONG_COUNT: Record<ChoiceFormat, number> = { duo: 1, carre: 3 }

/**
 * Construit les propositions. Les fausses viennent, dans l'ordre :
 * 1. des `distractors` du meta.json ; 2. des autres réponses de la région ; 3. de tout le jeu.
 * Jamais deux fois la même réponse, jamais la bonne réponse en double (Mossi est dans 9 régions).
 * Si la banque est trop petite, on renvoie moins de propositions ; s'il n'y a aucune fausse
 * réponse possible, erreur `no-distractor`.
 * `previous` : les propositions du passage précédent (énigme ratée qui revient) ; l'ordre sera différent.
 */
export function buildChoices(
  puzzle: Puzzle,
  allPuzzles: readonly Puzzle[],
  format: ChoiceFormat,
  rng: Rng,
  previous?: ChoiceSet,
): Result<ChoiceSet, 'no-distractor'> {
  const correctId = answerKey(puzzle.answer)
  const taken = new Set([correctId])
  const wrong: Choice[] = []
  const wanted = WRONG_COUNT[format]

  const takeFrom = (labels: readonly string[]) => {
    for (const label of rng.shuffle(labels)) {
      if (wrong.length >= wanted) return
      const id = answerKey(label)
      if (!id || taken.has(id)) continue
      taken.add(id)
      wrong.push({ id, label: label.normalize('NFC') })
    }
  }

  takeFrom(puzzle.distractors)
  takeFrom(allPuzzles.filter((p) => p.regionId === puzzle.regionId).map((p) => p.answer))
  takeFrom(allPuzzles.map((p) => p.answer))

  if (!wrong.length) return err('no-distractor')

  const all = [{ id: correctId, label: puzzle.answer }, ...wrong]
  const options = previous
    ? shuffleDifferent(rng, all, previous.options, (a, b) => a.id === b.id)
    : rng.shuffle(all)
  return ok({ format, options, correctId, eliminated: [] })
}

export function isCorrectChoice(set: ChoiceSet, choiceId: string): boolean {
  return choiceId === set.correctId
}
