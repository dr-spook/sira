import { describe, expect, it } from 'vitest'
import { toTiles } from './tiles'

const keep = { keepAccents: true }
const strip = { keepAccents: false }

describe('toTiles', () => {
  it('met chaque lettre en majuscule, une tuile par lettre', () => {
    expect(toTiles('Bwaba', keep)).toEqual(['B', 'W', 'A', 'B', 'A'])
  })

  it('garde É distinct de E quand keepAccents est true', () => {
    expect(toTiles('Gourmantché', keep)).toEqual([...'GOURMANTCHÉ'])
    expect(toTiles('Djôrô', keep)).toEqual(['D', 'J', 'Ô', 'R', 'Ô'])
  })

  it('ramène les accents à la lettre de base quand keepAccents est false', () => {
    expect(toTiles('Gourmantché', strip)).toEqual([...'GOURMANTCHE'])
    expect(toTiles('Djôrô', strip)).toEqual(['D', 'J', 'O', 'R', 'O'])
  })

  it('découpe les mots mooré avec Ɔ et Ɛ comme des tuiles à part entière', () => {
    for (const options of [keep, strip]) {
      expect(toTiles('bɔɔrɔ', options)).toEqual(['B', 'Ɔ', 'Ɔ', 'R', 'Ɔ'])
      expect(toTiles('pɛɛm', options)).toEqual(['P', 'Ɛ', 'Ɛ', 'M'])
      expect(toTiles('ŋ', options)).toEqual(['Ŋ'])
    }
  })

  it('conserve Ñ dans les deux modes', () => {
    expect(toTiles('ñ', keep)).toEqual(['Ñ'])
    expect(toTiles('ñ', strip)).toEqual(['Ñ'])
  })

  it('exclut espaces, tirets et apostrophes des tuiles', () => {
    expect(toTiles("Fada N'Gourma", keep).join('')).toBe('FADANGOURMA')
    expect(toTiles('Fada N’Gourma', keep).join('')).toBe('FADANGOURMA')
    expect(toTiles('Bobo-Dioulasso', keep).join('')).toBe('BOBODIOULASSO')
  })

  it('donne le même résultat pour un texte décomposé (NFD) ou composé (NFC)', () => {
    const nfd = 'Sénoufo'.normalize('NFD')
    expect(toTiles(nfd, keep)).toEqual(toTiles('Sénoufo', keep))
    expect(toTiles(nfd, keep)).toContain('É')
  })
})
