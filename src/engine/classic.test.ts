import { describe, expect, it } from 'vitest'
import {
  completeRegion,
  currentItem,
  formatsForCount,
  initialProgress,
  isRegionComplete,
  isTourComplete,
  nextRegionId,
  recordAnswer,
  regionTarget,
  currentRegionId,
  startRegionRun,
  type RegionRun,
} from './classic'
import type { Format } from './config'
import { answerKey } from './answers'
import { createRng } from './random'
import { makePuzzle, PUZZLES, testConfig } from './testing'

const config = testConfig()
const positions: Format[] = ['carre', 'carre', 'carre', 'direct', 'direct']

describe('formatsForCount', () => {
  it('répartit les formats sur toute la longueur de formatByPosition', () => {
    expect(formatsForCount(1, positions)).toEqual(['carre'])
    expect(formatsForCount(2, positions)).toEqual(['carre', 'direct'])
    expect(formatsForCount(3, positions)).toEqual(['carre', 'carre', 'direct'])
    expect(formatsForCount(4, positions)).toEqual(['carre', 'carre', 'direct', 'direct'])
    expect(formatsForCount(5, positions)).toEqual(positions)
    expect(formatsForCount(0, positions)).toEqual([])
  })
})

describe('startRegionRun', () => {
  it('région à 1 seule énigme (Oubri) : objectif 1, il en manque 4', () => {
    const run = startRegionRun({ regionId: 'oubri', puzzles: PUZZLES }, config, createRng(1))
    expect(run.target).toBe(1)
    expect(run.shortfall).toBe(4)
    expect(run.queue).toEqual([{ puzzleId: 'oubri--mossi', format: 'carre', failures: 0 }])
  })

  it('région à 4 énigmes (Bankui) : formats carre, carre, direct, direct', () => {
    const run = startRegionRun({ regionId: 'bankui', puzzles: PUZZLES }, config, createRng(1))
    expect(run.target).toBe(4)
    expect(run.queue.map((i) => i.format)).toEqual(['carre', 'carre', 'direct', 'direct'])
    expect(new Set(run.queue.map((i) => i.puzzleId)).size).toBe(4)
  })

  it('région complète : 5 énigmes tirées parmi plus, selon formatByPosition', () => {
    const many = Array.from({ length: 8 }, (_, i) => makePuzzle('soum', `Reponse${i}`))
    const run = startRegionRun({ regionId: 'soum', puzzles: many }, config, createRng(1))
    expect(run.target).toBe(5)
    expect(run.shortfall).toBe(0)
    expect(run.queue.map((i) => i.format)).toEqual(positions)
  })

  it('met les énigmes en logique A avant celles en logique B', () => {
    const mixed = [
      makePuzzle('soum', 'Un', { logic: 'B' }),
      makePuzzle('soum', 'Deux', { logic: 'A' }),
      makePuzzle('soum', 'Trois', { logic: 'B' }),
      makePuzzle('soum', 'Quatre', { logic: 'A' }),
    ]
    for (let seed = 0; seed < 20; seed++) {
      const run = startRegionRun({ regionId: 'soum', puzzles: mixed }, config, createRng(seed))
      const logics = run.queue.map((i) => mixed.find((p) => p.id === i.puzzleId)!.logic)
      expect(logics).toEqual(['A', 'A', 'B', 'B'])
    }
  })

  it('même graine, même tirage', () => {
    const draw = (seed: number) =>
      startRegionRun({ regionId: 'bankui', puzzles: PUZZLES }, config, createRng(seed))
    expect(draw(7)).toEqual(draw(7))
  })

  it('reprise : les énigmes déjà réussies sont comptées et les formats continuent', () => {
    const run = startRegionRun(
      { regionId: 'bankui', puzzles: PUZZLES, solvedInRegion: ['bankui--bwaba', 'bankui--marka'] },
      config,
      createRng(1),
    )
    expect(run.successes).toBe(2)
    expect(run.queue.map((i) => i.puzzleId).sort()).toEqual(['bankui--mossi', 'bankui--peul'])
    expect(run.queue.map((i) => i.format)).toEqual(['direct', 'direct'])
  })

  it('reuseSolvedAnswers : true rejoue Mossi, false l’écarte', () => {
    const input = { regionId: 'bankui', puzzles: PUZZLES, solvedAnswerKeys: [answerKey('Mossi')] }
    const reuse = startRegionRun(input, config, createRng(1))
    expect(reuse.queue.map((i) => i.puzzleId)).toContain('bankui--mossi')

    const noReuse = startRegionRun(input, testConfig({ reuseSolvedAnswers: false }), createRng(1))
    expect(noReuse.target).toBe(3)
    expect(noReuse.queue.map((i) => i.puzzleId)).not.toContain('bankui--mossi')
  })

  it('région sans énigme : objectif 0, validée tout de suite', () => {
    const run = startRegionRun({ regionId: 'yaadga', puzzles: PUZZLES }, config, createRng(1))
    expect(run.target).toBe(0)
    expect(isRegionComplete(run)).toBe(true)
  })
})

describe('file d’attente', () => {
  const start = (): RegionRun =>
    startRegionRun({ regionId: 'bankui', puzzles: PUZZLES }, config, createRng(1))

  it('une énigme ratée reste en tête : le joueur la réessaie tout de suite, avec son format', () => {
    const run = start()
    const first = currentItem(run)!
    const after = recordAnswer(recordAnswer(run, false), false)
    expect(after.successes).toBe(0)
    expect(after.queue).toHaveLength(4)
    expect(currentItem(after)).toEqual({ ...first, failures: 2 })
    // Une fois trouvée, on passe à l'énigme suivante.
    const solved = recordAnswer(after, true)
    expect(currentItem(solved)?.puzzleId).toBe(run.queue[1]!.puzzleId)
  })

  it('la région est validée quand l’objectif est atteint', () => {
    let run = recordAnswer(start(), false)
    for (let i = 0; i < 3; i++) run = recordAnswer(run, true)
    expect(isRegionComplete(run)).toBe(false)
    run = recordAnswer(run, true)
    expect(run.successes).toBe(4)
    expect(run.queue).toEqual([])
    expect(isRegionComplete(run)).toBe(true)
  })

  it('Oubri : une seule réussite suffit, même après des échecs', () => {
    let run = startRegionRun({ regionId: 'oubri', puzzles: PUZZLES }, config, createRng(1))
    run = recordAnswer(run, false)
    run = recordAnswer(run, false)
    expect(currentItem(run)?.failures).toBe(2)
    run = recordAnswer(run, true)
    expect(isRegionComplete(run)).toBe(true)
  })
})

describe('progression entre régions', () => {
  it('au départ, seule la première région de regionOrder est ouverte', () => {
    expect(initialProgress(config)).toEqual({
      guiriko: { status: 'in-progress', successes: 0 },
      kadiogo: { status: 'locked', successes: 0 },
      bankui: { status: 'locked', successes: 0 },
      oubri: { status: 'locked', successes: 0 },
    })
  })

  it('terminer une région ouvre la suivante de regionOrder', () => {
    const progress = completeRegion(initialProgress(config), 'guiriko', 3, config)
    expect(progress.guiriko).toEqual({ status: 'done', successes: 3 })
    expect(progress.kadiogo?.status).toBe('in-progress')
    expect(progress.bankui?.status).toBe('locked')
  })

  it('la dernière région n’ouvre rien, et le Tour est complet quand tout est terminé', () => {
    expect(nextRegionId('oubri', config)).toBeUndefined()
    let progress = initialProgress(config)
    for (const id of config.classique.regionOrder)
      progress = completeRegion(progress, id, 1, config)
    expect(isTourComplete(progress, config)).toBe(true)
  })
})

describe('regionTarget et currentRegionId', () => {
  it('donne l’objectif d’une région, réduit si elle manque d’énigmes', () => {
    expect(regionTarget('oubri', PUZZLES, config)).toBe(1)
    expect(regionTarget('bankui', PUZZLES, config)).toBe(4)
    expect(regionTarget('yaadga', PUZZLES, config)).toBe(0)
    const many = Array.from({ length: 8 }, (_, i) => makePuzzle('soum', `R${i}`))
    expect(regionTarget('soum', many, config)).toBe(5)
  })

  it('met en avant la première région en cours dans l’ordre du Tour', () => {
    let progress = initialProgress(config)
    expect(currentRegionId(progress, config)).toBe('guiriko')
    progress = completeRegion(progress, 'guiriko', 3, config)
    expect(currentRegionId(progress, config)).toBe('kadiogo')
    for (const id of config.classique.regionOrder)
      progress = completeRegion(progress, id, 1, config)
    expect(currentRegionId(progress, config)).toBeUndefined()
  })
})
