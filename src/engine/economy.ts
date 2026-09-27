// Gains et dépenses. Tous les montants viennent de game.json (GameConfig).
import type { Format, Gain, GameConfig } from './config'
import { err, ok, type Result } from './result'

export interface AnswerOutcome {
  format: Format
  success: boolean
  /** Série de bonnes réponses d'affilée AVANT cette réponse. */
  streak: number
  /** Vrai si l'énigme avait déjà été ratée : le gain est multiplié par retryGainFactor. */
  isRetry: boolean
}

export interface Reward {
  /** Cauris gagnés (négatif si game.json prévoit une perte sur réponse fausse). */
  cauris: number
  points: number
  /** Dont bonus de série. */
  streakBonus: number
  /** Nouvelle série après cette réponse. */
  streak: number
}

/** Gain d'une bonne réponse, hors bonus de série (affiché sur l'écran Question : « +20 »). */
export function baseGain(format: Format, isRetry: boolean, config: GameConfig): Gain {
  const base = config.formats[format]
  const factor = isRetry ? config.classique.retryGainFactor : 1
  return { cauris: Math.floor(base.cauris * factor), points: Math.floor(base.points * factor) }
}

export function answerReward(outcome: AnswerOutcome, config: GameConfig): Reward {
  if (!outcome.success) {
    return {
      // 0 - x plutôt que -x : évite un « -0 » quand game.json ne prévoit aucune perte.
      cauris: 0 - config.wrongAnswer.cauris,
      points: 0 - config.wrongAnswer.points,
      streakBonus: 0,
      streak: 0,
    }
  }
  const gain = baseGain(outcome.format, outcome.isRetry, config)
  const streak = outcome.streak + 1
  // Bonus à chaque multiple de `every` : 5, 10, 15…
  const streakBonus = streak % config.bonus.streak.every === 0 ? config.bonus.streak.cauris : 0
  return {
    cauris: gain.cauris + streakBonus,
    points: gain.points,
    streakBonus,
    streak,
  }
}

export function regionBonus(config: GameConfig): number {
  return config.bonus.regionComplete.cauris
}

/** Ajoute un gain à un solde, sans jamais descendre sous 0. */
export function addToBalance(balance: number, amount: number): number {
  return Math.max(0, balance + amount)
}

/** Paie un coût. Échoue si le solde ne suffit pas. */
export function spend(balance: number, cost: number): Result<number, 'insufficient-cauris'> {
  return balance >= cost ? ok(balance - cost) : err('insufficient-cauris')
}

export function isChampionUnlocked(classiquePoints: number, config: GameConfig): boolean {
  return classiquePoints >= config.unlocks.champion.classiquePoints
}
