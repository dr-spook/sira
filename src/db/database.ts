// Schéma de la sauvegarde locale (IndexedDB, via Dexie). Jamais de localStorage pour le jeu.
//
// MIGRATIONS : ne JAMAIS modifier une version déjà publiée, les joueurs ont des données dedans.
// Pour ajouter une table ou un index, on ajoute une version à la suite, avec SEULEMENT les tables
// nouvelles ou modifiées. Dexie garde les autres tables et leurs données. Exemple :
//
//   this.version(2).stores({ settings: 'key' })
//   this.version(3).stores({ history: '++id, puzzleId, date, mode' }).upgrade(async (tx) => {
//     // transformer les anciennes lignes si besoin
//   })
//
// Le test src/db/database.test.ts vérifie qu'une version 2 garde bien les données de la version 1.
import Dexie, { type EntityTable } from 'dexie'
import type { RegionStatus } from '@/engine/classic'
import type { Format } from '@/engine/config'

export type GameMode = 'classique' | 'champion' | 'maitre'

export interface ProfileRow {
  /** Une seule ligne : le joueur de ce téléphone. */
  id: 'me'
  cauris: number
  /** Points gagnés en Classique (ils débloquent Champion). */
  points: number
  /** Bonnes réponses d'affilée en cours. */
  streak: number
}

export interface RegionProgressRow {
  regionId: string
  status: RegionStatus
  successes: number
}

export interface HistoryRow {
  id?: number
  puzzleId: string
  mode: GameMode
  format: Format
  success: boolean
  /** Horodatage en millisecondes (Date.now()). */
  date: number
}

export interface AnecdoteRow {
  puzzleId: string
  unlockedAt: number
}

/** Version 1 du schéma. Clé primaire en premier, puis les index. */
export const SCHEMA_V1 = {
  profile: 'id',
  regionProgress: 'regionId',
  history: '++id, puzzleId, date',
  anecdotes: 'puzzleId',
} as const

export class SiraDatabase extends Dexie {
  profile!: EntityTable<ProfileRow, 'id'>
  regionProgress!: EntityTable<RegionProgressRow, 'regionId'>
  history!: EntityTable<HistoryRow, 'id'>
  anecdotes!: EntityTable<AnecdoteRow, 'puzzleId'>

  constructor(name = 'sira') {
    super(name)
    this.version(1).stores(SCHEMA_V1)
  }
}

/** La base du jeu. Seuls les stores (via repository.ts) s'en servent, jamais les composants. */
export const db = new SiraDatabase()
