import { describe, expect, it } from 'vitest'
import realConfig from '@/config/game.json'
import { catalog } from '@/content/catalog'
import { validateGameConfig } from './config'
import { REGION_ORDER, testConfig } from './testing'

/** Copie de testConfig() avec une valeur remplacée (ou supprimée si `value` vaut undefined). */
function withValue(path: string, value: unknown): unknown {
  const config = structuredClone(testConfig()) as unknown as Record<string, unknown>
  const keys = path.split('.')
  const last = keys.pop()!
  const parent = keys.reduce((node, key) => node[key] as Record<string, unknown>, config)
  if (value === undefined) delete parent[last]
  else parent[last] = value
  return config
}

const errorsOf = (raw: unknown, regions = REGION_ORDER) => {
  const result = validateGameConfig(raw, regions)
  return result.ok ? [] : result.errors
}

describe('validateGameConfig', () => {
  it('accepte le vrai src/config/game.json avec les régions de puzzles.json', () => {
    const result = validateGameConfig(
      realConfig,
      catalog.regions.map((r) => r.id),
    )
    expect(result.ok ? [] : result.errors).toEqual([])
  })

  it('accepte une configuration complète', () => {
    expect(errorsOf(testConfig())).toEqual([])
  })

  it('refuse autre chose qu’un objet', () => {
    expect(errorsOf(null)).toHaveLength(1)
    expect(errorsOf([])).toHaveLength(1)
  })

  it('signale chaque valeur invalide avec son chemin', () => {
    expect(errorsOf(withValue('formats.carre.cauris', -5))[0]).toMatch(/^formats\.carre\.cauris/)
    expect(errorsOf(withValue('hints.placer_lettre.cost', '15'))[0]).toMatch(
      /^hints\.placer_lettre\.cost/,
    )
    expect(errorsOf(withValue('tiles.keepAccents', 'oui'))[0]).toMatch(/^tiles\.keepAccents/)
  })

  it('signale un champ manquant', () => {
    expect(errorsOf(withValue('bonus.streak', undefined))).toEqual([
      'bonus.streak.every doit être un entier supérieur ou égal à 1 (reçu : undefined)',
      'bonus.streak.cauris doit être un entier supérieur ou égal à 0 (reçu : undefined)',
    ])
  })

  it('refuse un format inconnu et une longueur qui ne correspond pas à puzzlesPerRegion', () => {
    const errors = errorsOf(
      testConfig({ formatByPosition: ['carre', 'quiz', 'direct'] as never, puzzlesPerRegion: 5 }),
    )
    expect(errors.some((e) => e.includes('format inconnu "quiz"'))).toBe(true)
    expect(errors.some((e) => e.includes('doit avoir 5 formats'))).toBe(true)
  })

  it('exige toutes les régions dans regionOrder, sans doublon ni inconnue', () => {
    const errors = errorsOf(testConfig({ regionOrder: ['guiriko', 'guiriko', 'bankui', 'centre'] }))
    expect(errors.some((e) => e.includes('en double : guiriko'))).toBe(true)
    expect(errors.some((e) => e.includes('inconnues : centre'))).toBe(true)
    expect(errors.some((e) => e.includes('manquantes : kadiogo, oubri'))).toBe(true)
  })

  it('borne retryGainFactor entre 0 et 1', () => {
    expect(errorsOf(testConfig({ retryGainFactor: 0.5 }))).toEqual([])
    expect(errorsOf(testConfig({ retryGainFactor: 1.5 }))).toHaveLength(1)
    expect(errorsOf(testConfig({ retryGainFactor: -1 }))).toHaveLength(1)
  })
})
