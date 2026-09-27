import { describe, expect, it } from 'vitest'

// Test bidon : vérifie seulement que Vitest est bien branché.
// À supprimer dès que le premier vrai test de l'engine existe.
describe('squelette', () => {
  it('lance Vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
