import { describe, expect, it } from 'vitest'
import {
  buildBoard,
  clearSlot,
  isBoardCorrect,
  isBoardFull,
  MOORE_LETTERS,
  pickDecoys,
  placeTile,
  type Board,
} from './board'
import { createRng } from './random'
import { makePuzzle, PUZZLES } from './testing'

const options = { keepAccents: true, defaultDecoys: 4 }
const bwaba = PUZZLES.find((p) => p.id === 'guiriko--bwaba')!
const moore = makePuzzle('kadiogo', 'bɔɔrɔ', { lang: 'moore' })
const withMoore = [...PUZZLES, moore, makePuzzle('kadiogo', 'pɛɛm', { lang: 'moore' })]

/** Pose les tuiles dans l'ordre des lettres demandées. */
function spell(board: Board, letters: string[]): Board {
  let result = board
  const used = new Set<string>()
  for (const letter of letters) {
    const tile = result.tiles.find((t) => t.letter === letter && !used.has(t.id))!
    used.add(tile.id)
    result = placeTile(result, tile.id)
  }
  return result
}

describe('buildBoard', () => {
  it('contient les tuiles de la réponse plus 4 leurres', () => {
    const board = buildBoard(bwaba, PUZZLES, options, createRng(1))
    expect(board.tiles).toHaveLength(5 + 4)
    expect(
      board.tiles
        .filter((t) => !t.decoy)
        .map((t) => t.letter)
        .sort(),
    ).toEqual([...'AABBW'])
    expect(board.slots).toEqual([null, null, null, null, null])
  })

  it('choisit des leurres distincts, absents de la réponse', () => {
    for (let seed = 0; seed < 30; seed++) {
      const decoys = pickDecoys(bwaba, PUZZLES, options, createRng(seed))
      expect(decoys).toHaveLength(4)
      expect(new Set(decoys).size).toBe(4)
      for (const letter of decoys) expect('BWA').not.toContain(letter)
    }
  })

  it('complète avec A–Z quand les autres réponses ne suffisent pas', () => {
    const tiny = [makePuzzle('soum', 'Bella'), makePuzzle('soum', 'Ba')]
    const decoys = pickDecoys(tiny[0]!, tiny, options, createRng(1))
    expect(decoys).toHaveLength(4)
    for (const letter of decoys) expect('BEL').not.toContain(letter)
  })

  it('utilise les decoyLetters du meta.json quand elles existent', () => {
    const p = makePuzzle('djoro', 'Lobi', { decoyLetters: ['A', 'E', 'R'] })
    expect(pickDecoys(p, PUZZLES, options, createRng(1))).toEqual(['A', 'E', 'R'])
  })

  it('mot mooré : les tuiles Ɔ sont des tuiles à part entière', () => {
    const board = buildBoard(moore, withMoore, options, createRng(1))
    expect(board.expected).toEqual(['B', 'Ɔ', 'Ɔ', 'R', 'Ɔ'])
    expect(isBoardCorrect(spell(board, ['B', 'Ɔ', 'Ɔ', 'R', 'Ɔ']))).toBe(true)
    expect(isBoardCorrect(spell(board, ['B', 'Ɔ', 'R', 'Ɔ', 'Ɔ']))).toBe(false)
    // Un O latin n'est pas un Ɔ : la réponse n'en contient pas, le plateau non plus.
    expect(board.tiles.filter((t) => !t.decoy).some((t) => t.letter === 'O')).toBe(false)
  })

  it('les lettres mooré ne sont des leurres que pour une réponse en mooré', () => {
    const isMoore = (letter: string) => (MOORE_LETTERS as readonly string[]).includes(letter)
    let mooreDecoySeen = false
    for (let seed = 0; seed < 100; seed++) {
      expect(pickDecoys(bwaba, withMoore, options, createRng(seed)).some(isMoore)).toBe(false)
      if (pickDecoys(moore, withMoore, options, createRng(seed)).some(isMoore))
        mooreDecoySeen = true
    }
    expect(mooreDecoySeen).toBe(true)
  })

  it('même graine, même plateau', () => {
    expect(buildBoard(bwaba, PUZZLES, options, createRng(5))).toEqual(
      buildBoard(bwaba, PUZZLES, options, createRng(5)),
    )
  })

  it('une énigme ratée qui revient a ses tuiles dans un autre ordre', () => {
    for (let seed = 0; seed < 50; seed++) {
      const rng = createRng(seed)
      const first = buildBoard(bwaba, PUZZLES, options, rng)
      const again = buildBoard(bwaba, PUZZLES, options, rng, first)
      expect(again.tiles.map((t) => t.letter)).not.toEqual(first.tiles.map((t) => t.letter))
    }
  })
})

describe('placement et vérification', () => {
  const board = buildBoard(bwaba, PUZZLES, options, createRng(1))

  it('pose une tuile dans la première case libre, et une tuile ne peut être posée deux fois', () => {
    const tile = board.tiles[0]!
    const once = placeTile(board, tile.id)
    expect(once.slots[0]).toBe(tile.id)
    expect(placeTile(once, tile.id)).toBe(once)
  })

  it('vide une case', () => {
    const placed = placeTile(board, board.tiles[0]!.id)
    expect(clearSlot(placed, 0).slots[0]).toBeNull()
  })

  it('vérifie tuile par tuile : les bonnes lettres dans le mauvais ordre sont fausses', () => {
    const right = spell(board, [...'BWABA'])
    expect(isBoardFull(right)).toBe(true)
    expect(isBoardCorrect(right)).toBe(true)
    expect(isBoardCorrect(spell(board, [...'BABWA']))).toBe(false)
  })

  it('une tuile É n’est pas une tuile E', () => {
    const p = makePuzzle('tannounyan', 'Sénoufo')
    const b = buildBoard(p, [p], options, createRng(1))
    expect(b.expected).toContain('É')
    expect(b.expected).not.toContain('E')
  })
})
