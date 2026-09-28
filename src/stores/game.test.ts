// Test d'ensemble : les stores relient bien l'engine et la sauvegarde (base IndexedDB en mémoire).
import 'fake-indexeddb/auto'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { gameConfig } from '@/config/game'
import { catalog } from '@/content/catalog'
import { db } from '@/db/database'
import { listAnecdotes, loadProfile, loadRegionProgress } from '@/db/repository'
import type { Round } from '@/engine/round'
import { useGameStore } from './game'
import { usePlayerStore } from './player'

/** Donne la bonne réponse à la manche en cours (ou une mauvaise). */
async function answer(game: ReturnType<typeof useGameStore>, correct: boolean) {
  const round = game.round as Round
  if (round.format === 'direct') {
    const { tiles, expected } = round.board
    const used = new Set<string>()
    const take = (tile: { id: string }) => {
      used.add(tile.id)
      game.tapTile(tile.id)
    }
    if (correct) {
      for (const letter of expected)
        take(tiles.find((t) => t.letter === letter && !t.decoy && !used.has(t.id))!)
    } else {
      // Un leurre dans la première case suffit à rendre la réponse fausse.
      take(tiles.find((t) => t.decoy)!)
      while (used.size < expected.length) take(tiles.find((t) => !used.has(t.id))!)
    }
    return game.submit()
  }
  const { options, correctId } = round.choices
  const choice = correct ? correctId : options.find((o) => o.id !== correctId)!.id
  return game.submit(choice)
}

beforeEach(async () => {
  setActivePinia(createPinia())
  await db.delete()
  await db.open()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('store game (Classique)', () => {
  const first = gameConfig.classique.regionOrder[0]!
  const second = gameConfig.classique.regionOrder[1]!
  const firstCount = catalog.puzzles.filter((p) => p.regionId === first).length

  it('refuse une région verrouillée', async () => {
    const game = useGameStore()
    await game.startRegion(second)
    expect(game.error).toBe('region-locked')
    expect(game.round).toBeNull()
  })

  it('joue la première région en entier : gains sauvegardés, région suivante débloquée', async () => {
    const game = useGameStore()
    await game.startRegion(first, 123)
    const target = Math.min(firstCount, gameConfig.classique.puzzlesPerRegion)
    expect(game.run?.target).toBe(target)

    let expectedCauris = 0
    let last
    for (let i = 0; i < target; i++) {
      last = await answer(game, true)
      expectedCauris += last!.reward.cauris
      game.next()
    }
    expect(last?.regionComplete).toBe(true)
    expectedCauris += gameConfig.bonus.regionComplete.cauris

    expect((await loadProfile()).cauris).toBe(expectedCauris)
    expect(usePlayerStore().profile.cauris).toBe(expectedCauris)
    const progress = await loadRegionProgress()
    expect(progress[first]?.status).toBe('done')
    expect(progress[second]?.status).toBe('in-progress')
    expect(await listAnecdotes()).toHaveLength(target)
  })

  it('une réponse fausse ne coûte rien, remet la série à 0, et la même énigme revient re-mélangée', async () => {
    const game = useGameStore()
    await game.startRegion(first, 7)
    const firstPuzzle = game.run!.queue[0]!.puzzleId

    const result = await answer(game, false)
    expect(result?.success).toBe(false)
    expect(result?.reward.cauris).toBe(0)
    expect(usePlayerStore().profile).toMatchObject({ cauris: 0, streak: 0 })
    expect(game.run!.queue[0]).toMatchObject({ puzzleId: firstPuzzle, failures: 1 })
    const before = game.round
    game.next()
    expect(game.round?.puzzleId).toBe(firstPuzzle)
    expect(game.round).not.toBe(before)
  })

  it('même graine, même tirage de la région', async () => {
    const game = useGameStore()
    await game.startRegion(first, 42)
    const queue = game.run!.queue.map((i) => i.puzzleId)
    await game.startRegion(first, 42)
    expect(game.run!.queue.map((i) => i.puzzleId)).toEqual(queue)
  })

  it('indice sans Cauris : refusé, rien ne change', async () => {
    const game = useGameStore()
    await game.startRegion(first, 1)
    const before = game.round
    const hint = before?.format === 'direct' ? 'retirer_leurre' : 'eliminer_2'
    expect(await game.requestHint(hint)).toEqual({ ok: false, error: 'insufficient-cauris' })
    expect(game.round).toBe(before)
  })
})
