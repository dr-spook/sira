import { describe, expect, it } from 'vitest'
import { features } from './features'

describe('features', () => {
  it('contient exactement les 9 interrupteurs prévus', () => {
    expect(Object.keys(features).sort()).toEqual(
      [
        'champion',
        'duelLocal',
        'duelWhatsapp',
        'hints',
        'library',
        'maitre',
        'persistStorage',
        'settings',
        'sounds',
      ].sort(),
    )
  })

  // Quand une tâche active sa fonctionnalité, elle retire son nom de cette liste dans sa PR.
  it('garde à false les fonctionnalités pas encore livrées', () => {
    const stillOff: (keyof typeof features)[] = [
      'hints',
      'library',
      'settings',
      'champion',
      'maitre',
      'sounds',
      'duelLocal',
      'duelWhatsapp',
      'persistStorage',
    ]
    for (const name of stillOff) expect(features[name], name).toBe(false)
  })
})
