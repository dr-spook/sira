import { describe, expect, it } from 'vitest'
import { REGIONS, matchRegionFolder, slugify } from './regions.ts'

function regionId(folder: string): string | undefined {
  const match = matchRegionFolder(folder)
  return match.ok ? match.region.id : undefined
}

describe('matchRegionFolder', () => {
  it('reconnaît Goulmou avec une apostrophe droite ou typographique', () => {
    expect(regionId("Goulmou(Fada N'Gourma)")).toBe('goulmou')
    expect(regionId('Goulmou(Fada N’Gourma)')).toBe('goulmou')
  })

  it('reconnaît Djôrô avec ou sans accents, quelle que soit la casse', () => {
    expect(regionId('Djôrô(Gaoua)')).toBe('djoro')
    expect(regionId('Djoro(Gaoua)')).toBe('djoro')
    expect(regionId('DJORO(gaoua)')).toBe('djoro')
  })

  it('reconnaît un nom écrit en NFD (accents décomposés, fréquent sur macOS)', () => {
    expect(regionId('Kuilsé(Kaya)'.normalize('NFD'))).toBe('kuilse')
  })

  it('tolère un espace avant la parenthèse', () => {
    expect(regionId('Nakambé (Tenkodogo)')).toBe('nakambe')
  })

  it('refuse une région inconnue, un mauvais chef-lieu ou un nom mal formé', () => {
    expect(matchRegionFolder('Centre(Ouagadougou)').ok).toBe(false)
    expect(matchRegionFolder('Kadiogo(Kaya)').ok).toBe(false)
    expect(matchRegionFolder('Kadiogo').ok).toBe(false)
  })
})

describe('REGIONS', () => {
  it('contient les 17 régions, avec des identifiants uniques et sans accents', () => {
    expect(REGIONS).toHaveLength(17)
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(17)
    for (const region of REGIONS) expect(region.id).toBe(slugify(region.name))
  })
})

describe('slugify', () => {
  it('produit un identifiant ASCII', () => {
    expect(slugify('Gourmantché')).toBe('gourmantche')
    expect(slugify('bɔɔrɔ')).toBe('booro')
    expect(slugify("Fada N'Gourma")).toBe('fada-n-gourma')
  })
})
