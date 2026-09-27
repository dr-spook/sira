import type { Region } from '../../src/engine/types.ts'

// Les 17 régions officielles : annexe 1 de docs/gdd-v3.md (Conseil des ministres, 2 juillet 2025).
export const REGIONS: readonly Region[] = [
  { id: 'bankui', name: 'Bankui', capital: 'Dédougou' },
  { id: 'djoro', name: 'Djôrô', capital: 'Gaoua' },
  { id: 'goulmou', name: 'Goulmou', capital: 'Fada N’Gourma' },
  { id: 'guiriko', name: 'Guiriko', capital: 'Bobo-Dioulasso' },
  { id: 'kadiogo', name: 'Kadiogo', capital: 'Ouagadougou' },
  { id: 'kuilse', name: 'Kuilsé', capital: 'Kaya' },
  { id: 'liptako', name: 'Liptako', capital: 'Dori' },
  { id: 'nakambe', name: 'Nakambé', capital: 'Tenkodogo' },
  { id: 'nando', name: 'Nando', capital: 'Koudougou' },
  { id: 'nazinon', name: 'Nazinon', capital: 'Manga' },
  { id: 'oubri', name: 'Oubri', capital: 'Ziniaré' },
  { id: 'sirba', name: 'Sirba', capital: 'Bogandé' },
  { id: 'soum', name: 'Soum', capital: 'Djibo' },
  { id: 'sourou', name: 'Sourou', capital: 'Tougan' },
  { id: 'tannounyan', name: 'Tannounyan', capital: 'Banfora' },
  { id: 'tapoa', name: 'Tapoa', capital: 'Diapaga' },
  { id: 'yaadga', name: 'Yaadga', capital: 'Ouahigouya' },
]

/** Clé de comparaison : sans accents, sans casse, et ’ ‘ ramenés à '. */
export function matchKey(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’‘]/g, "'").trim().toLowerCase()
}

/** Identifiant ASCII : minuscules, sans accents, lettres mooré ramenées au latin, le reste en tirets. */
export function slugify(text: string): string {
  return matchKey(text)
    .replace(/ɛ/g, 'e')
    .replace(/ɔ/g, 'o')
    .replace(/ŋ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type RegionMatch = { ok: true; region: Region } | { ok: false; reason: string }

/** Retrouve la région d'un dossier `<Région>(<Chef-lieu>)`. */
export function matchRegionFolder(folder: string): RegionMatch {
  const parts = /^(.+?)\s*\((.+)\)\s*$/u.exec(folder.normalize('NFC'))
  if (!parts) {
    return { ok: false, reason: 'le nom doit être de la forme « Région(Chef-lieu) »' }
  }
  const [, name = '', capital = ''] = parts
  const region = REGIONS.find((r) => matchKey(r.name) === matchKey(name))
  if (!region) {
    return { ok: false, reason: `« ${name} » ne fait pas partie des 17 régions officielles` }
  }
  if (matchKey(region.capital) !== matchKey(capital)) {
    return {
      ok: false,
      reason: `le chef-lieu de ${region.name} est « ${region.capital} », pas « ${capital} »`,
    }
  }
  return { ok: true, region }
}
