// Forme de src/config/game.json et sa validation. Fonction pure : game.ts l'appelle au démarrage.

export const FORMATS = ['duo', 'carre', 'direct'] as const
export type Format = (typeof FORMATS)[number]

export const HINT_IDS = ['eliminer_2', 'retirer_leurre', 'placer_lettre'] as const
export type HintId = (typeof HINT_IDS)[number]

export interface Gain {
  cauris: number
  points: number
}

export interface GameConfig {
  tiles: { keepAccents: boolean }
  formats: Record<Format, Gain>
  bonus: {
    streak: { every: number; cauris: number }
    regionComplete: { cauris: number }
  }
  wrongAnswer: Gain
  hints: Record<HintId, { cost: number; formats: Format[] }>
  direct: { defaultDecoys: number }
  classique: {
    puzzlesPerRegion: number
    formatByPosition: Format[]
    reuseSolvedAnswers: boolean
    retryGainFactor: number
    regionOrder: string[]
  }
  unlocks: { champion: { classiquePoints: number } }
  timers: { championSeconds: number; maitreSeconds: number }
}

export type ConfigValidation = { ok: true; config: GameConfig } | { ok: false; errors: string[] }

type Json = Record<string, unknown>

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Vérifie game.json. Renvoie TOUTES les erreurs d'un coup, avec le chemin de chaque valeur
 * fautive (« classique.puzzlesPerRegion »), pour que le pôle Game Design corrige en une fois.
 * `regionIds` : les régions de puzzles.json, que regionOrder doit contenir exactement.
 */
export function validateGameConfig(raw: unknown, regionIds: readonly string[]): ConfigValidation {
  const errors: string[] = []

  const at = (path: string): unknown =>
    path.split('.').reduce<unknown>((node, key) => (isObject(node) ? node[key] : undefined), raw)

  const integer = (path: string, min = 0) => {
    const value = at(path)
    if (typeof value !== 'number' || !Number.isInteger(value) || value < min) {
      errors.push(
        `${path} doit être un entier supérieur ou égal à ${min} (reçu : ${JSON.stringify(value)})`,
      )
    }
  }
  const boolean = (path: string) => {
    if (typeof at(path) !== 'boolean') {
      errors.push(`${path} doit valoir true ou false (reçu : ${JSON.stringify(at(path))})`)
    }
  }
  const formatList = (path: string, allowEmpty: boolean) => {
    const value = at(path)
    if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
      errors.push(`${path} doit être une liste de formats (${FORMATS.join(', ')})`)
      return
    }
    value.forEach((format, index) => {
      if (!FORMATS.includes(format as Format)) {
        errors.push(
          `${path}[${index}] : format inconnu ${JSON.stringify(format)} (attendu : ${FORMATS.join(', ')})`,
        )
      }
    })
  }

  if (!isObject(raw)) return { ok: false, errors: ['game.json doit contenir un objet { … }'] }

  boolean('tiles.keepAccents')
  for (const format of FORMATS) {
    integer(`formats.${format}.cauris`)
    integer(`formats.${format}.points`)
  }
  integer('bonus.streak.every', 1)
  integer('bonus.streak.cauris')
  integer('bonus.regionComplete.cauris')
  integer('wrongAnswer.cauris')
  integer('wrongAnswer.points')
  for (const hint of HINT_IDS) {
    integer(`hints.${hint}.cost`)
    formatList(`hints.${hint}.formats`, false)
  }
  integer('direct.defaultDecoys')
  integer('classique.puzzlesPerRegion', 1)
  formatList('classique.formatByPosition', false)
  boolean('classique.reuseSolvedAnswers')
  integer('unlocks.champion.classiquePoints')
  integer('timers.championSeconds', 1)
  integer('timers.maitreSeconds', 1)

  const factor = at('classique.retryGainFactor')
  if (typeof factor !== 'number' || factor < 0 || factor > 1) {
    errors.push(
      `classique.retryGainFactor doit être un nombre entre 0 et 1 (reçu : ${JSON.stringify(factor)})`,
    )
  }

  const positions = at('classique.formatByPosition')
  const perRegion = at('classique.puzzlesPerRegion')
  if (Array.isArray(positions) && typeof perRegion === 'number' && positions.length !== perRegion) {
    errors.push(
      `classique.formatByPosition doit avoir ${perRegion} formats, un par énigme de la région (reçu : ${positions.length})`,
    )
  }

  const order = at('classique.regionOrder')
  if (!Array.isArray(order) || !order.every((id) => typeof id === 'string')) {
    errors.push('classique.regionOrder doit être une liste d’identifiants de régions')
  } else {
    const duplicates = order.filter((id, index) => order.indexOf(id) !== index)
    const unknown = order.filter((id) => !regionIds.includes(id))
    const missing = regionIds.filter((id) => !order.includes(id))
    if (duplicates.length)
      errors.push(`classique.regionOrder : en double : ${[...new Set(duplicates)].join(', ')}`)
    if (unknown.length)
      errors.push(`classique.regionOrder : régions inconnues : ${unknown.join(', ')}`)
    if (missing.length)
      errors.push(`classique.regionOrder : régions manquantes : ${missing.join(', ')}`)
  }

  return errors.length ? { ok: false, errors } : { ok: true, config: raw as unknown as GameConfig }
}
