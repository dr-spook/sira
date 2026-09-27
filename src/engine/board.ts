// Plateau de lettres du format Direct : tuiles de la réponse + leurres, et cases de réponse.
import { toTiles } from './tiles'
import { shuffleDifferent, type Rng } from './random'
import type { Puzzle } from './types'

export const MOORE_LETTERS = ['Ɛ', 'Ɔ', 'Ŋ', 'Ñ'] as const
const FALLBACK_LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

export interface Tile {
  id: string
  letter: string
  /** Vrai pour un leurre. Ne jamais l'afficher : leurres et bonnes lettres se ressemblent. */
  decoy: boolean
}

export interface Board {
  /** Toutes les tuiles, dans l'ordre d'affichage de la banque. */
  tiles: Tile[]
  /** Une case par lettre de la réponse : l'identifiant de la tuile posée, ou null. */
  slots: (string | null)[]
  /** Cases remplies par l'indice « Placer une lettre » : le joueur ne peut plus les vider. */
  locked: boolean[]
  /** Tuiles retirées par l'indice « Retirer un leurre ». */
  removed: string[]
  /** Les lettres attendues, case par case. */
  expected: string[]
}

export interface BoardOptions {
  keepAccents: boolean
  defaultDecoys: number
}

/**
 * Choisit les leurres. Priorité aux `decoyLetters` du meta.json. Sinon : des lettres distinctes,
 * absentes de la réponse, tirées des autres réponses du jeu, complétées par A–Z si besoin.
 * Les lettres mooré ne servent de leurres que si la réponse est en mooré.
 */
export function pickDecoys(
  puzzle: Puzzle,
  allPuzzles: readonly Puzzle[],
  options: BoardOptions,
  rng: Rng,
): string[] {
  const inAnswer = new Set(puzzle.tiles)
  const allowMoore = puzzle.lang === 'moore'
  const allowed = (letter: string) =>
    !inAnswer.has(letter) && (allowMoore || !(MOORE_LETTERS as readonly string[]).includes(letter))

  if (puzzle.decoyLetters.length) return puzzle.decoyLetters.filter(allowed)

  const decoys: string[] = []
  const takeFrom = (letters: Iterable<string>) => {
    for (const letter of rng.shuffle([...new Set(letters)])) {
      if (decoys.length >= options.defaultDecoys) return
      if (allowed(letter) && !decoys.includes(letter)) decoys.push(letter)
    }
  }

  const others = allPuzzles.filter((p) => p.id !== puzzle.id)
  const pool = others.flatMap((p) => toTiles(p.answer, { keepAccents: options.keepAccents }))
  takeFrom(allowMoore ? [...pool, ...MOORE_LETTERS] : pool)
  takeFrom(FALLBACK_LETTERS)
  return decoys
}

/**
 * Construit le plateau : tuiles de la réponse + leurres, mélangés.
 * `previous` : le plateau du passage précédent (énigme ratée qui revient) ; l'ordre sera différent.
 */
export function buildBoard(
  puzzle: Puzzle,
  allPuzzles: readonly Puzzle[],
  options: BoardOptions,
  rng: Rng,
  previous?: Board,
): Board {
  const answerTiles: Tile[] = puzzle.tiles.map((letter, i) => ({
    id: `a${i}`,
    letter,
    decoy: false,
  }))
  const decoyTiles: Tile[] = pickDecoys(puzzle, allPuzzles, options, rng).map((letter, i) => ({
    id: `d${i}`,
    letter,
    decoy: true,
  }))
  const all = [...answerTiles, ...decoyTiles]
  // On compare les lettres (et non les identifiants) : le joueur voit des lettres.
  const tiles = previous
    ? shuffleDifferent(rng, all, previous.tiles, (a, b) => a.letter === b.letter)
    : rng.shuffle(all)

  return {
    tiles,
    slots: puzzle.tiles.map(() => null),
    locked: puzzle.tiles.map(() => false),
    removed: [],
    expected: [...puzzle.tiles],
  }
}

/** Lettre de la tuile posée dans une case (undefined si la case est vide). */
export const letterOf = (board: Board, tileId: string | null) =>
  tileId === null ? undefined : board.tiles.find((tile) => tile.id === tileId)?.letter

/** Pose une tuile de la banque dans la première case libre. Sans effet si c'est impossible. */
export function placeTile(board: Board, tileId: string): Board {
  const tile = board.tiles.find((t) => t.id === tileId)
  if (!tile || board.removed.includes(tileId) || board.slots.includes(tileId)) return board
  const index = board.slots.indexOf(null)
  if (index === -1) return board
  const slots = [...board.slots]
  slots[index] = tileId
  return { ...board, slots }
}

/** Vide une case (la tuile retourne dans la banque). Sans effet sur une case verrouillée. */
export function clearSlot(board: Board, index: number): Board {
  if (board.locked[index] || board.slots[index] == null) return board
  const slots = [...board.slots]
  slots[index] = null
  return { ...board, slots }
}

export function isBoardFull(board: Board): boolean {
  return board.slots.every((slot) => slot !== null)
}

/** Vérification tuile par tuile : chaque case doit contenir exactement la lettre attendue. */
export function isBoardCorrect(board: Board): boolean {
  return board.expected.every((letter, i) => letterOf(board, board.slots[i] ?? null) === letter)
}
