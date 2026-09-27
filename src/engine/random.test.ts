import { describe, expect, it } from 'vitest'
import { createRng, seedFromString, shuffleDifferent } from './random'

const draw = (seed: number | string) => {
  const rng = createRng(seed)
  return Array.from({ length: 8 }, () => rng.next())
}

describe('createRng', () => {
  it('donne exactement la même suite pour la même graine', () => {
    expect(draw(42)).toEqual(draw(42))
    expect(draw('DEFI-7K2Q')).toEqual(draw('DEFI-7K2Q'))
  })

  it('donne des suites différentes pour des graines différentes', () => {
    expect(draw(1)).not.toEqual(draw(2))
    expect(draw('DEFI-A')).not.toEqual(draw('DEFI-B'))
  })

  it('reste dans les bornes', () => {
    const rng = createRng(7)
    for (let i = 0; i < 1000; i++) {
      const value = rng.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
      expect(rng.int(4)).toBeLessThan(4)
    }
  })

  it('mélange sans perdre ni dupliquer d’élément, sans toucher à l’original', () => {
    const items = ['A', 'B', 'C', 'D', 'E']
    const shuffled = createRng(3).shuffle(items)
    expect([...shuffled].sort()).toEqual(items)
    expect(items).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  it('pick renvoie undefined sur une liste vide', () => {
    expect(createRng(1).pick([])).toBeUndefined()
  })

  it('transforme un texte en graine de façon stable (NFC)', () => {
    expect(seedFromString('Djôrô')).toBe(seedFromString('Djôrô'.normalize('NFD')))
  })
})

describe('shuffleDifferent', () => {
  it('ne rend jamais le même ordre que le précédent', () => {
    for (let seed = 0; seed < 200; seed++) {
      const rng = createRng(seed)
      expect(shuffleDifferent(rng, ['A', 'B'], ['A', 'B'])).toEqual(['B', 'A'])
      const previous = ['A', 'B', 'C', 'D']
      expect(shuffleDifferent(rng, previous, previous)).not.toEqual(previous)
    }
  })

  it('accepte le même ordre quand tous les éléments sont identiques', () => {
    expect(shuffleDifferent(createRng(1), ['A', 'A'], ['A', 'A'])).toEqual(['A', 'A'])
  })
})
