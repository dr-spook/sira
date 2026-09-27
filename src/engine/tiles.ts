export interface TileOptions {
  /** `true` : É reste É. `false` : É devient E (sauf Ñ, lettre mooré). Réglé par `tiles.keepAccents` dans game.json. */
  keepAccents: boolean
}

// Espaces, tirets et apostrophes : gardés dans la réponse, mais ce ne sont pas des tuiles.
const SEPARATORS = /^[\s\-‐‑–—'’‘]+$/u

const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' })

/**
 * Découpe une réponse en tuiles : une tuile par lettre affichable, en majuscules, en NFC.
 * On découpe par « graphème » (ce que l'œil voit comme une lettre) et non par caractère,
 * pour qu'une lettre suivie d'un accent combiné reste une seule tuile.
 */
export function toTiles(answer: string, options: TileOptions): string[] {
  const upper = answer.normalize('NFC').toUpperCase().normalize('NFC')
  const tiles: string[] = []

  for (const { segment } of segmenter.segment(upper)) {
    if (SEPARATORS.test(segment)) continue
    tiles.push(options.keepAccents ? segment : stripAccents(segment))
  }
  return tiles
}

// Ɛ, Ɔ et Ŋ n'ont pas de forme décomposée : elles traversent cette fonction sans changer.
function stripAccents(letter: string): string {
  if (letter === 'Ñ') return letter
  return letter.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC')
}
