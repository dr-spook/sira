import { describe, expect, it } from 'vitest'
import { answerKey } from './answers'
import { placeTile } from './board'
import { createRng } from './random'
import { createRound, isRoundCorrect } from './round'
import { makePuzzle, PUZZLES, testConfig } from './testing'

const config = testConfig()
const oubri = PUZZLES.find((p) => p.id === 'oubri--mossi')!

describe('createRound', () => {
  it('Carré : propositions ; Direct : plateau', () => {
    const carre = createRound(oubri, 'carre', PUZZLES, config, createRng(1))
    expect(carre.ok && carre.value.format).toBe('carre')
    const direct = createRound(oubri, 'direct', PUZZLES, config, createRng(1))
    expect(direct.ok && direct.value.format).toBe('direct')
  })

  it('vérifie Duo et Carré par identifiant', () => {
    const result = createRound(oubri, 'duo', PUZZLES, config, createRng(1))
    if (!result.ok) throw new Error()
    expect(isRoundCorrect(result.value, answerKey('Mossi'))).toBe(true)
    expect(isRoundCorrect(result.value, 'peul')).toBe(false)
    expect(isRoundCorrect(result.value)).toBe(false)
  })

  it('vérifie le Direct tuile par tuile, y compris en mooré', () => {
    const moore = makePuzzle('kadiogo', 'pɛɛm', { lang: 'moore' })
    const result = createRound(moore, 'direct', [...PUZZLES, moore], config, createRng(1))
    if (!result.ok || result.value.format !== 'direct') throw new Error()
    let board = result.value.board
    const used = new Set<string>()
    for (const letter of ['P', 'Ɛ', 'Ɛ', 'M']) {
      const tile = board.tiles.find((t) => t.letter === letter && !used.has(t.id))!
      used.add(tile.id)
      board = placeTile(board, tile.id)
    }
    expect(isRoundCorrect({ ...result.value, board })).toBe(true)
  })

  it('reprise d’une énigme ratée : nouvel ordre, même format', () => {
    const rng = createRng(1)
    const first = createRound(oubri, 'carre', PUZZLES, config, rng)
    if (!first.ok || first.value.format === 'direct') throw new Error()
    const again = createRound(oubri, 'carre', PUZZLES, config, rng, first.value)
    if (!again.ok || again.value.format === 'direct') throw new Error()
    expect(again.value.choices.options.map((o) => o.id)).not.toEqual(
      first.value.choices.options.map((o) => o.id),
    )
  })

  it('propage l’erreur quand aucune fausse réponse n’existe', () => {
    const alone = [makePuzzle('oubri', 'Mossi')]
    expect(createRound(alone[0]!, 'carre', alone, config, createRng(1))).toEqual({
      ok: false,
      error: 'no-distractor',
    })
  })
})
