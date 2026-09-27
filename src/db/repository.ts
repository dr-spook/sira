// Lectures et écritures de la sauvegarde. Chaque fonction reçoit la base en paramètre
// (les tests passent une base de test), avec la base du jeu par défaut.
import type { RegionProgress } from '@/engine/classic'
import {
  db as defaultDb,
  type AnecdoteRow,
  type HistoryRow,
  type ProfileRow,
  type SiraDatabase,
} from './database'

export type Profile = Omit<ProfileRow, 'id'>

export const EMPTY_PROFILE: Profile = { cauris: 0, points: 0, streak: 0 }

export async function loadProfile(db: SiraDatabase = defaultDb): Promise<Profile> {
  const row = await db.profile.get('me')
  if (!row) return { ...EMPTY_PROFILE }
  const { cauris, points, streak } = row
  return { cauris, points, streak }
}

export async function saveProfile(profile: Profile, db: SiraDatabase = defaultDb): Promise<void> {
  await db.profile.put({ id: 'me', ...profile })
}

/** Progression de toutes les régions. Vide si le joueur n'a jamais joué. */
export async function loadRegionProgress(db: SiraDatabase = defaultDb): Promise<RegionProgress> {
  const rows = await db.regionProgress.toArray()
  return Object.fromEntries(
    rows.map(({ regionId, status, successes }) => [regionId, { status, successes }]),
  )
}

export async function saveRegionProgress(
  progress: RegionProgress,
  db: SiraDatabase = defaultDb,
): Promise<void> {
  await db.regionProgress.bulkPut(
    Object.entries(progress).map(([regionId, { status, successes }]) => ({
      regionId,
      status,
      successes,
    })),
  )
}

export async function addHistory(
  entry: Omit<HistoryRow, 'id'>,
  db: SiraDatabase = defaultDb,
): Promise<void> {
  await db.history.add(entry)
}

/** Identifiants des énigmes déjà réussies au moins une fois. */
export async function solvedPuzzleIds(db: SiraDatabase = defaultDb): Promise<Set<string>> {
  const rows = await db.history.filter((row) => row.success).toArray()
  return new Set(rows.map((row) => row.puzzleId))
}

export async function unlockAnecdote(
  puzzleId: string,
  db: SiraDatabase = defaultDb,
): Promise<void> {
  // Une anecdote déjà débloquée garde sa première date.
  const existing = await db.anecdotes.get(puzzleId)
  if (!existing) await db.anecdotes.put({ puzzleId, unlockedAt: Date.now() })
}

export async function listAnecdotes(db: SiraDatabase = defaultDb): Promise<AnecdoteRow[]> {
  return db.anecdotes.orderBy('puzzleId').toArray()
}
