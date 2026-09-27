import { describe, expect, it } from 'vitest'
import {
  addToBalance,
  answerReward,
  baseGain,
  isChampionUnlocked,
  regionBonus,
  spend,
} from './economy'
import { testConfig } from './testing'

const config = testConfig()
const success = (format: 'duo' | 'carre' | 'direct', streak = 0, isRetry = false) =>
  answerReward({ format, success: true, streak, isRetry }, config)

describe('answerReward', () => {
  it('gagne les Cauris et les points du format', () => {
    expect(success('duo')).toMatchObject({ cauris: 10, points: 25, streak: 1 })
    expect(success('carre')).toMatchObject({ cauris: 20, points: 45, streak: 1 })
    expect(success('direct')).toMatchObject({ cauris: 50, points: 100, streak: 1 })
  })

  it('ajoute le bonus de série à chaque multiple de 5', () => {
    expect(success('carre', 3)).toMatchObject({ cauris: 20, streakBonus: 0, streak: 4 })
    expect(success('carre', 4)).toMatchObject({ cauris: 40, streakBonus: 20, streak: 5 })
    expect(success('carre', 5)).toMatchObject({ streakBonus: 0, streak: 6 })
    expect(success('carre', 9)).toMatchObject({ streakBonus: 20, streak: 10 })
  })

  it('réponse fausse : aucune perte, la série retombe à 0', () => {
    expect(
      answerReward({ format: 'direct', success: false, streak: 4, isRetry: false }, config),
    ).toEqual({
      cauris: 0,
      points: 0,
      streakBonus: 0,
      streak: 0,
    })
  })

  it('applique une perte si game.json en prévoit une', () => {
    const strict = { ...config, wrongAnswer: { cauris: 5, points: 10 } }
    const reward = answerReward(
      { format: 'carre', success: false, streak: 0, isRetry: false },
      strict,
    )
    expect(reward).toMatchObject({ cauris: -5, points: -10 })
  })

  it('reprise après un échec : gain multiplié par retryGainFactor, arrondi à l’entier inférieur', () => {
    expect(success('carre', 0, true)).toMatchObject({ cauris: 20, points: 45 })
    const half = testConfig({ retryGainFactor: 0.5 })
    expect(
      answerReward({ format: 'carre', success: true, streak: 0, isRetry: true }, half),
    ).toMatchObject({
      cauris: 10,
      points: 22,
    })
    // Le bonus de série n'est pas réduit.
    expect(
      answerReward({ format: 'duo', success: true, streak: 4, isRetry: true }, half),
    ).toMatchObject({
      cauris: 5 + 20,
      streakBonus: 20,
    })
  })
})

describe('soldes', () => {
  it('ne descend jamais sous 0', () => {
    expect(addToBalance(0, -5)).toBe(0)
    expect(addToBalance(10, -3)).toBe(7)
  })

  it('Cauris à 0 : impossible de payer', () => {
    expect(spend(0, 10)).toEqual({ ok: false, error: 'insufficient-cauris' })
    expect(spend(0, 0)).toEqual({ ok: true, value: 0 })
    expect(spend(15, 15)).toEqual({ ok: true, value: 0 })
  })

  it('bonus de région et déblocage de Champion', () => {
    expect(regionBonus(config)).toBe(50)
    expect(isChampionUnlocked(99, config)).toBe(false)
    expect(isChampionUnlocked(100, config)).toBe(true)
  })
})

describe('baseGain', () => {
  it('donne le gain du format, réduit pour une reprise', () => {
    expect(baseGain('carre', false, config)).toEqual({ cauris: 20, points: 45 })
    expect(baseGain('direct', true, testConfig({ retryGainFactor: 0.5 }))).toEqual({
      cauris: 25,
      points: 50,
    })
  })
})
