import type { PuzzleLang, PuzzleLogic } from '../../src/engine/types.ts'

/** Crédit tel qu'écrit dans meta.json : `image` est le nom du fichier source (ex. « a.jpg »). */
export interface MetaCredit {
  image: string
  author?: string
  source?: string
  license?: string
}

export interface Meta {
  title?: string
  logic?: PuzzleLogic
  lang?: PuzzleLang
  images?: string[]
  distractors?: string[]
  decoyLetters?: string[]
  credits?: MetaCredit[]
  source?: string
}

export interface MetaResult {
  meta: Meta
  errors: string[]
  warnings: string[]
}

const KNOWN_FIELDS = [
  'title',
  'logic',
  'lang',
  'images',
  'distractors',
  'decoyLetters',
  'credits',
  'source',
]
const CREDIT_FIELDS = ['image', 'author', 'source', 'license']

const isString = (value: unknown): value is string => typeof value === 'string'
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString)
const nfc = (value: string) => value.normalize('NFC').trim()

/**
 * Lit et vérifie le contenu d'un meta.json.
 * Un JSON cassé ou une valeur du mauvais type est une erreur : on ne devine pas ce que l'auteur voulait.
 * Un champ inconnu n'est qu'un avertissement (faute de frappe probable).
 */
export function parseMeta(raw: string): MetaResult {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: Meta = {}

  let data: unknown
  try {
    data = JSON.parse(raw.replace(/^\uFEFF/, ''))
  } catch (error) {
    return { meta, errors: [`meta.json illisible : ${(error as Error).message}`], warnings }
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { meta, errors: ['meta.json illisible : il doit contenir un objet { … }'], warnings }
  }
  const fields = data as Record<string, unknown>

  for (const key of Object.keys(fields)) {
    if (!KNOWN_FIELDS.includes(key)) warnings.push(`meta.json : champ inconnu « ${key} »`)
  }

  const invalid = (field: string, expected: string) =>
    errors.push(`meta.json : « ${field} » doit être ${expected}`)

  if (fields.title !== undefined) {
    if (isString(fields.title) && nfc(fields.title)) meta.title = nfc(fields.title)
    else invalid('title', 'un texte non vide')
  }
  if (fields.logic !== undefined) {
    if (fields.logic === 'A' || fields.logic === 'B') meta.logic = fields.logic
    else invalid('logic', '"A" ou "B"')
  }
  if (fields.lang !== undefined) {
    if (fields.lang === 'fr' || fields.lang === 'moore') meta.lang = fields.lang
    else invalid('lang', '"fr" ou "moore"')
  }
  if (fields.source !== undefined) {
    if (isString(fields.source) && nfc(fields.source)) meta.source = nfc(fields.source)
    else invalid('source', 'un texte non vide')
  }
  for (const field of ['images', 'distractors', 'decoyLetters'] as const) {
    const value = fields[field]
    if (value === undefined) continue
    if (isStringArray(value)) meta[field] = value.map(nfc)
    else invalid(field, 'une liste de textes')
  }

  if (fields.credits !== undefined) {
    if (!Array.isArray(fields.credits)) {
      invalid('credits', 'une liste')
    } else {
      meta.credits = []
      fields.credits.forEach((credit: unknown, index) => {
        const label = `credits[${index}]`
        if (typeof credit !== 'object' || credit === null || Array.isArray(credit)) {
          invalid(label, 'un objet { "image": …, "author": …, "source": …, "license": … }')
          return
        }
        const entry = credit as Record<string, unknown>
        for (const key of Object.keys(entry)) {
          if (!CREDIT_FIELDS.includes(key))
            warnings.push(`meta.json : champ inconnu « ${label}.${key} »`)
        }
        if (!CREDIT_FIELDS.every((key) => entry[key] === undefined || isString(entry[key]))) {
          invalid(label, 'un objet dont les valeurs sont des textes')
          return
        }
        if (!isString(entry.image) || !nfc(entry.image)) {
          invalid(`${label}.image`, 'le nom d’un des 4 fichiers image')
          return
        }
        const parsed: MetaCredit = { image: nfc(entry.image) }
        for (const key of ['author', 'source', 'license'] as const) {
          const value = entry[key]
          if (isString(value) && nfc(value)) parsed[key] = nfc(value)
        }
        meta.credits?.push(parsed)
      })
    }
  }

  return { meta, errors, warnings }
}
