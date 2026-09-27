// Charge src/config/game.json, le vérifie et l'expose typé.
// Si une valeur est invalide, `configErrors` n'est pas vide et main.ts arrête le démarrage.
import raw from './game.json'
import { catalog } from '@/content/catalog'
import { validateGameConfig, type GameConfig } from '@/engine/config'

const result = validateGameConfig(
  raw,
  catalog.regions.map((region) => region.id),
)

export const configErrors: string[] = result.ok ? [] : result.errors

/** Message complet à afficher quand game.json est invalide. */
export function configErrorMessage(): string {
  return `src/config/game.json est invalide :\n- ${configErrors.join('\n- ')}`
}

// Ne lire gameConfig qu'une fois l'app démarrée : main.ts garantit qu'il est valide.
export const gameConfig = (result.ok ? result.config : undefined) as GameConfig
