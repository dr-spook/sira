// Données de test partagées par les tests de l'engine (jamais importé par le jeu).
// Réglages et énigmes fixes : les tests ne cassent pas quand le pôle Game Design change game.json.
import type { GameConfig } from './config'
import { toTiles } from './tiles'
import type { Puzzle } from './types'

export const REGION_ORDER = ['guiriko', 'kadiogo', 'bankui', 'oubri']

export function testConfig(overrides: Partial<GameConfig['classique']> = {}): GameConfig {
  return {
    tiles: { keepAccents: true },
    formats: {
      duo: { cauris: 10, points: 25 },
      carre: { cauris: 20, points: 45 },
      direct: { cauris: 50, points: 100 },
    },
    bonus: { streak: { every: 5, cauris: 20 }, regionComplete: { cauris: 50 } },
    wrongAnswer: { cauris: 0, points: 0 },
    hints: {
      eliminer_2: { cost: 15, formats: ['carre'] },
      retirer_leurre: { cost: 10, formats: ['direct'] },
      placer_lettre: { cost: 15, formats: ['direct'] },
    },
    direct: { defaultDecoys: 4 },
    classique: {
      puzzlesPerRegion: 5,
      formatByPosition: ['carre', 'carre', 'carre', 'direct', 'direct'],
      reuseSolvedAnswers: true,
      retryGainFactor: 1,
      regionOrder: REGION_ORDER,
      ...overrides,
    },
    unlocks: { champion: { classiquePoints: 100 } },
    timers: { championSeconds: 20, maitreSeconds: 10 },
  }
}

export function makePuzzle(
  regionId: string,
  answer: string,
  extra: Partial<Omit<Puzzle, 'regionId' | 'answer'>> = {},
): Puzzle {
  return {
    id: `${regionId}--${answer.toLowerCase()}`,
    regionId,
    answer,
    tiles: toTiles(answer, { keepAccents: true }),
    lang: 'fr',
    logic: 'A',
    images: ['a.webp', 'b.webp', 'c.webp', 'd.webp'],
    anecdote: { title: answer, text: '…' },
    distractors: [],
    decoyLetters: [],
    credits: [],
    source: null,
    ...extra,
  }
}

/** Petit jeu de test, sur le modèle du vrai contenu (Mossi dans plusieurs régions, Oubri à 1 énigme). */
export const PUZZLES: Puzzle[] = [
  makePuzzle('guiriko', 'Bobo'),
  makePuzzle('guiriko', 'Bwaba'),
  makePuzzle('guiriko', 'Toussian'),
  makePuzzle('kadiogo', 'Mossi'),
  makePuzzle('kadiogo', 'Peul'),
  makePuzzle('bankui', 'Bwaba'),
  makePuzzle('bankui', 'Marka'),
  makePuzzle('bankui', 'Mossi'),
  makePuzzle('bankui', 'Peul'),
  makePuzzle('oubri', 'Mossi'),
]
