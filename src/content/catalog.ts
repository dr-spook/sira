// Accès typé à puzzles.json (généré par `npm run content`, à ne jamais éditer à la main).
import data from './puzzles.json'
import type { PuzzleCatalog } from '@/engine/types'

export const catalog = data as PuzzleCatalog
