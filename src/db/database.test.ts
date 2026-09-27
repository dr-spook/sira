// fake-indexeddb remplace IndexedDB (absent de Node) par une base en mémoire.
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { SCHEMA_V1, SiraDatabase } from './database'
import {
  addHistory,
  listAnecdotes,
  loadProfile,
  loadRegionProgress,
  saveProfile,
  saveRegionProgress,
  solvedPuzzleIds,
  unlockAnecdote,
} from './repository'

let counter = 0
const opened: Dexie[] = []

function freshDb(): SiraDatabase {
  const db = new SiraDatabase(`sira-test-${++counter}`)
  opened.push(db)
  return db
}

afterEach(async () => {
  for (const db of opened.splice(0)) await db.delete()
})

describe('profil', () => {
  it('renvoie un profil vide la première fois', async () => {
    expect(await loadProfile(freshDb())).toEqual({ cauris: 0, points: 0, streak: 0 })
  })

  it('sauvegarde et relit le profil, y compris après réouverture de la base', async () => {
    const db = freshDb()
    await saveProfile({ cauris: 245, points: 62, streak: 3 }, db)
    db.close()

    const reopened = new SiraDatabase(db.name)
    opened.push(reopened)
    expect(await loadProfile(reopened)).toEqual({ cauris: 245, points: 62, streak: 3 })
  })

  it('une nouvelle sauvegarde remplace l’ancienne (une seule ligne)', async () => {
    const db = freshDb()
    await saveProfile({ cauris: 10, points: 0, streak: 1 }, db)
    await saveProfile({ cauris: 30, points: 45, streak: 2 }, db)
    expect(await db.profile.count()).toBe(1)
    expect(await loadProfile(db)).toEqual({ cauris: 30, points: 45, streak: 2 })
  })
})

describe('progression, historique, anecdotes', () => {
  it('sauvegarde la progression des régions', async () => {
    const db = freshDb()
    await saveRegionProgress(
      {
        guiriko: { status: 'done', successes: 3 },
        kadiogo: { status: 'in-progress', successes: 1 },
      },
      db,
    )
    expect(await loadRegionProgress(db)).toEqual({
      guiriko: { status: 'done', successes: 3 },
      kadiogo: { status: 'in-progress', successes: 1 },
    })
  })

  it('retrouve les énigmes réussies dans l’historique', async () => {
    const db = freshDb()
    const base = { mode: 'classique' as const, format: 'carre' as const, date: 1 }
    await addHistory({ ...base, puzzleId: 'oubri--mossi', success: false }, db)
    await addHistory({ ...base, puzzleId: 'oubri--mossi', success: true }, db)
    await addHistory({ ...base, puzzleId: 'guiriko--bobo', success: false }, db)
    expect(await solvedPuzzleIds(db)).toEqual(new Set(['oubri--mossi']))
  })

  it('une anecdote débloquée deux fois garde sa première date', async () => {
    const db = freshDb()
    await unlockAnecdote('oubri--mossi', db)
    const [first] = await listAnecdotes(db)
    await unlockAnecdote('oubri--mossi', db)
    expect(await listAnecdotes(db)).toEqual([first])
  })
})

describe('migration', () => {
  it('une version 2 qui ajoute une table garde toutes les données de la version 1', async () => {
    const v1 = freshDb()
    await saveProfile({ cauris: 120, points: 90, streak: 4 }, v1)
    await addHistory(
      { puzzleId: 'oubri--mossi', mode: 'classique', format: 'carre', success: true, date: 5 },
      v1,
    )
    await unlockAnecdote('oubri--mossi', v1)
    v1.close()

    // Ce que fera une future version : même schéma v1, plus une version 2 avec une table en plus.
    const v2 = new Dexie(v1.name)
    opened.push(v2)
    v2.version(1).stores(SCHEMA_V1)
    v2.version(2).stores({ settings: 'key' })
    await v2.open()

    expect(v2.verno).toBe(2)
    expect(await v2.table('profile').get('me')).toEqual({
      id: 'me',
      cauris: 120,
      points: 90,
      streak: 4,
    })
    expect(await v2.table('history').count()).toBe(1)
    expect(await v2.table('anecdotes').count()).toBe(1)
    await v2.table('settings').put({ key: 'sound', value: true })
    expect(await v2.table('settings').get('sound')).toEqual({ key: 'sound', value: true })
  })

  it('une version 2 avec une fonction upgrade peut transformer les anciennes lignes', async () => {
    const v1 = freshDb()
    await saveProfile({ cauris: 50, points: 0, streak: 0 }, v1)
    v1.close()

    const v2 = new Dexie(v1.name)
    opened.push(v2)
    v2.version(1).stores(SCHEMA_V1)
    v2.version(2)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('profile')
          .toCollection()
          .modify((row) => {
            row.bestStreak = 0
          }),
      )
    await v2.open()
    expect(await v2.table('profile').get('me')).toMatchObject({ cauris: 50, bestStreak: 0 })
  })
})
