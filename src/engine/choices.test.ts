import { describe, expect, it } from 'vitest'
import { answerKey } from './answers'
import { buildChoices, isCorrectChoice, type ChoiceSet } from './choices'
import { createRng } from './random'
import { makePuzzle, PUZZLES } from './testing'

const puzzle = (id: string) => PUZZLES.find((p) => p.id === id)!

function build(p = puzzle('bankui--marka'), format: 'duo' | 'carre' = 'carre', seed = 1) {
  const result = buildChoices(p, PUZZLES, format, createRng(seed))
  if (!result.ok) throw new Error(result.error)
  return result.value
}

const labels = (set: ChoiceSet) => set.options.map((o) => o.label)

describe('buildChoices', () => {
  it('Carré : 4 propositions distinctes dont la bonne ; Duo : 2', () => {
    const carre = build(puzzle('bankui--marka'), 'carre')
    expect(carre.options).toHaveLength(4)
    expect(new Set(carre.options.map((o) => o.id)).size).toBe(4)
    expect(labels(carre)).toContain('Marka')

    const duo = build(puzzle('bankui--marka'), 'duo')
    expect(duo.options).toHaveLength(2)
    expect(labels(duo)).toContain('Marka')
  })

  it('prend d’abord les réponses de la même région', () => {
    // Bankui : Bwaba, Marka, Mossi, Peul → les 3 fausses sont les 3 autres réponses de Bankui.
    for (let seed = 0; seed < 20; seed++) {
      expect(labels(build(puzzle('bankui--marka'), 'carre', seed)).sort()).toEqual([
        'Bwaba',
        'Marka',
        'Mossi',
        'Peul',
      ])
    }
  })

  it('complète avec tout le jeu quand la région ne suffit pas (Oubri : 1 seule énigme)', () => {
    const set = build(puzzle('oubri--mossi'), 'carre')
    expect(set.options).toHaveLength(4)
    expect(labels(set)).toContain('Mossi')
  })

  it('ne propose jamais la bonne réponse en double (Mossi existe dans 3 régions)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const set = build(puzzle('oubri--mossi'), 'carre', seed)
      expect(set.options.filter((o) => o.id === answerKey('Mossi'))).toHaveLength(1)
      expect(new Set(labels(set)).size).toBe(4)
    }
  })

  it('utilise d’abord les distractors du meta.json', () => {
    const p = makePuzzle('bankui', 'Marka', { distractors: ['Dagara', 'Birifor', 'Bobo'] })
    const set = buildChoices(p, PUZZLES, 'carre', createRng(1))
    expect(set.ok && labels(set.value).sort()).toEqual(['Birifor', 'Bobo', 'Dagara', 'Marka'])
  })

  it('ignore un distractor qui est la bonne réponse ou un doublon', () => {
    const p = makePuzzle('bankui', 'Marka', { distractors: ['MARKA', 'Dagara', 'dagara'] })
    const set = buildChoices(p, PUZZLES, 'carre', createRng(1))
    expect(set.ok && set.value.options.filter((o) => o.id === 'dagara')).toHaveLength(1)
    expect(set.ok && set.value.options.filter((o) => o.id === 'marka')).toHaveLength(1)
  })

  it('banque trop petite : renvoie moins de propositions, sans doublon', () => {
    const tiny = [makePuzzle('soum', 'Bella'), makePuzzle('soum', 'Tuareg')]
    const set = buildChoices(tiny[0]!, tiny, 'carre', createRng(1))
    expect(set.ok && labels(set.value).sort()).toEqual(['Bella', 'Tuareg'])
  })

  it('aucune fausse réponse possible : erreur no-distractor', () => {
    const alone = [makePuzzle('oubri', 'Mossi'), makePuzzle('kadiogo', 'Mossi')]
    expect(buildChoices(alone[0]!, alone, 'duo', createRng(1))).toEqual({
      ok: false,
      error: 'no-distractor',
    })
  })

  it('même graine, mêmes propositions dans le même ordre', () => {
    expect(build(puzzle('oubri--mossi'), 'carre', 99)).toEqual(
      build(puzzle('oubri--mossi'), 'carre', 99),
    )
  })

  it('une énigme ratée qui revient a ses propositions dans un autre ordre', () => {
    for (let seed = 0; seed < 50; seed++) {
      const rng = createRng(seed)
      const first = buildChoices(puzzle('bankui--marka'), PUZZLES, 'carre', rng)
      if (!first.ok) throw new Error()
      const again = buildChoices(puzzle('bankui--marka'), PUZZLES, 'carre', rng, first.value)
      expect(again.ok && again.value.options.map((o) => o.id)).not.toEqual(
        first.value.options.map((o) => o.id),
      )
    }
  })
})

describe('isCorrectChoice', () => {
  it('vérifie par identifiant', () => {
    const set = build()
    expect(isCorrectChoice(set, answerKey('Marka'))).toBe(true)
    expect(isCorrectChoice(set, answerKey('Peul'))).toBe(false)
  })
})
