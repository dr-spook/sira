import { describe, expect, it } from 'vitest'
import { placeTile } from './board'
import { applyHint } from './hints'
import { createRng } from './random'
import { createRound, type Round } from './round'
import { PUZZLES, testConfig } from './testing'

const config = testConfig()
const marka = PUZZLES.find((p) => p.id === 'bankui--marka')!
const bwaba = PUZZLES.find((p) => p.id === 'guiriko--bwaba')!

function round(format: 'duo' | 'carre' | 'direct', puzzle = format === 'direct' ? bwaba : marka) {
  const result = createRound(puzzle, format, PUZZLES, config, createRng(1))
  if (!result.ok) throw new Error(result.error)
  return result.value
}

function ok<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(`attendu ok, reçu ${result.error}`)
  return result.value
}

describe('applyHint : erreurs', () => {
  it('indice appliqué au mauvais format', () => {
    const rng = createRng(1)
    expect(applyHint('eliminer_2', round('direct'), 100, config, rng)).toEqual({
      ok: false,
      error: 'wrong-format',
    })
    expect(applyHint('eliminer_2', round('duo'), 100, config, rng)).toEqual({
      ok: false,
      error: 'wrong-format',
    })
    expect(applyHint('retirer_leurre', round('carre'), 100, config, rng)).toEqual({
      ok: false,
      error: 'wrong-format',
    })
    expect(applyHint('placer_lettre', round('duo'), 100, config, rng)).toEqual({
      ok: false,
      error: 'wrong-format',
    })
  })

  it('Cauris à 0 : aucun indice payant', () => {
    const rng = createRng(1)
    expect(applyHint('eliminer_2', round('carre'), 0, config, rng)).toEqual({
      ok: false,
      error: 'insufficient-cauris',
    })
    expect(applyHint('retirer_leurre', round('direct'), 0, config, rng)).toEqual({
      ok: false,
      error: 'insufficient-cauris',
    })
    expect(applyHint('placer_lettre', round('direct'), 14, config, rng)).toEqual({
      ok: false,
      error: 'insufficient-cauris',
    })
  })

  it('le solde exact suffit', () => {
    const result = ok(applyHint('placer_lettre', round('direct'), 15, config, createRng(1)))
    expect(result.balance).toBe(0)
    expect(result.cost).toBe(15)
  })
})

describe('Éliminer 2 mauvaises réponses', () => {
  it('retire 2 mauvaises réponses, jamais la bonne, puis plus rien', () => {
    for (let seed = 0; seed < 30; seed++) {
      const rng = createRng(seed)
      const start = round('carre')
      const once = ok(applyHint('eliminer_2', start, 100, config, rng))
      const set = once.round.format !== 'direct' ? once.round.choices : undefined
      expect(set?.eliminated).toHaveLength(2)
      expect(set?.eliminated).not.toContain(set?.correctId)
      expect(once.balance).toBe(85)
      expect(applyHint('eliminer_2', once.round, 100, config, rng)).toEqual({
        ok: false,
        error: 'nothing-left',
      })
    }
  })
})

describe('Retirer un leurre', () => {
  it('retire un leurre à chaque fois, jusqu’à ce qu’il n’en reste plus', () => {
    const rng = createRng(3)
    let current: Round = round('direct')
    for (let i = 0; i < 4; i++)
      current = ok(applyHint('retirer_leurre', current, 100, config, rng)).round
    if (current.format !== 'direct') throw new Error()
    const decoyIds = current.board.tiles.filter((t) => t.decoy).map((t) => t.id)
    expect([...current.board.removed].sort()).toEqual(decoyIds.sort())
    expect(applyHint('retirer_leurre', current, 100, config, rng)).toEqual({
      ok: false,
      error: 'nothing-left',
    })
  })

  it('sort le leurre de sa case s’il y était posé', () => {
    const start = round('direct')
    if (start.format !== 'direct') throw new Error()
    let board = start.board
    for (const decoy of board.tiles.filter((t) => t.decoy)) board = placeTile(board, decoy.id)
    const rng = createRng(1)
    const next = ok(applyHint('retirer_leurre', { ...start, board }, 100, config, rng)).round
    if (next.format !== 'direct') throw new Error()
    const removed = next.board.removed[0]
    expect(next.board.slots).not.toContain(removed)
  })
})

describe('Placer une lettre', () => {
  it('place la bonne lettre dans la première case vide et la verrouille', () => {
    const next = ok(applyHint('placer_lettre', round('direct'), 100, config, createRng(1))).round
    if (next.format !== 'direct') throw new Error()
    const tile = next.board.tiles.find((t) => t.id === next.board.slots[0])
    expect(tile?.letter).toBe('B')
    expect(next.board.locked[0]).toBe(true)
  })

  it('remplace une lettre fausse (qui retourne à la banque)', () => {
    const start = round('direct')
    if (start.format !== 'direct') throw new Error()
    const wrong = start.board.tiles.find((t) => t.decoy)!
    const board = placeTile(start.board, wrong.id)
    const next = ok(
      applyHint('placer_lettre', { ...start, board }, 100, config, createRng(1)),
    ).round
    if (next.format !== 'direct') throw new Error()
    expect(next.board.slots).not.toContain(wrong.id)
    expect(next.board.tiles.find((t) => t.id === next.board.slots[0])?.letter).toBe('B')
  })

  it('remplit toute la réponse en 5 fois, puis plus rien à placer', () => {
    const rng = createRng(1)
    let current: Round = round('direct')
    for (let i = 0; i < 5; i++)
      current = ok(applyHint('placer_lettre', current, 100, config, rng)).round
    if (current.format !== 'direct') throw new Error()
    expect(current.board.locked).toEqual([true, true, true, true, true])
    expect(applyHint('placer_lettre', current, 100, config, rng)).toEqual({
      ok: false,
      error: 'nothing-left',
    })
  })
})
