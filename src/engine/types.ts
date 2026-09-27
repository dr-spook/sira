// Format de src/content/puzzles.json, généré par `npm run content`.

export type PuzzleLogic = 'A' | 'B'
export type PuzzleLang = 'fr' | 'moore'

export interface Region {
  id: string
  name: string
  capital: string
}

export interface ImageCredit {
  /** Nom du fichier WebP généré (même valeur que dans `Puzzle.images`). */
  image: string
  author?: string
  source?: string
  license?: string
}

export interface Anecdote {
  title: string
  text: string
}

export interface Puzzle {
  /** `<regionId>--<réponse sans accents>`, par exemple `bankui--bwaba`. */
  id: string
  regionId: string
  /** La réponse telle qu'écrite (accents, espaces et tirets compris). */
  answer: string
  tiles: string[]
  lang: PuzzleLang
  logic: PuzzleLogic
  /** 4 noms de fichiers WebP, dans l'ordre d'affichage (dans public/content/img/). */
  images: string[]
  anecdote: Anecdote
  distractors: string[]
  decoyLetters: string[]
  credits: ImageCredit[]
  source: string | null
}

export interface PuzzleCatalog {
  version: 1
  regions: Region[]
  puzzles: Puzzle[]
}
