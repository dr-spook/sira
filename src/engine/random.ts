// Hasard reproductible. L'engine n'utilise JAMAIS Math.random : toute fonction qui tire au sort
// reçoit un Rng créé à partir d'une graine. Même graine = même suite de tirages, ce qui rend
// les tests reproductibles et permettra au Duel (Code Défi) de donner les mêmes énigmes aux deux joueurs.

export interface Rng {
  /** Nombre dans [0, 1). */
  next(): number
  /** Entier dans [0, max). */
  int(max: number): number
  /** Un élément au hasard (undefined si la liste est vide). */
  pick<T>(items: readonly T[]): T | undefined
  /** Copie mélangée de la liste (l'original n'est pas modifié). */
  shuffle<T>(items: readonly T[]): T[]
}

/** Transforme un texte (un futur Code Défi) en graine numérique (hachage FNV-1a 32 bits). */
export function seedFromString(text: string): number {
  let hash = 0x811c9dc5
  for (const char of text.normalize('NFC')) {
    hash ^= char.codePointAt(0)!
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Générateur mulberry32 : petit, rapide, et assez bien réparti pour un jeu. */
export function createRng(seed: number | string): Rng {
  let state = (typeof seed === 'string' ? seedFromString(seed) : seed) >>> 0

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (max: number) => Math.floor(next() * max)

  return {
    next,
    int,
    pick: (items) => (items.length ? items[int(items.length)] : undefined),
    shuffle: (items) => {
      // Mélange de Fisher-Yates.
      const copy = [...items]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = int(i + 1)
        ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
      }
      return copy
    },
  }
}

/**
 * Mélange en garantissant un ordre différent de `previous` (quand c'est possible, c'est-à-dire
 * s'il y a au moins deux éléments différents). Sert quand une énigme ratée revient.
 */
export function shuffleDifferent<T>(
  rng: Rng,
  items: readonly T[],
  previous: readonly T[],
  same: (a: T, b: T) => boolean = Object.is,
): T[] {
  const equal = (list: readonly T[]) =>
    list.length === previous.length && list.every((item, i) => same(item, previous[i]!))
  let result = rng.shuffle(items)
  if (!equal(result)) return result
  // Une rotation d'un cran change forcément l'ordre, sauf si tous les éléments sont identiques.
  result = [...result.slice(1), ...result.slice(0, 1)]
  return result
}
