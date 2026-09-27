// Interrupteurs des fonctionnalités réservées à l'équipe (voir docs/taches-equipe.md).
//
// Règle : un interrupteur à false = la fonctionnalité n'existe pas pour le joueur.
// Aucun bouton, aucun lien, aucun écran vide : l'app fonctionne normalement sans elle.
// La tâche qui construit une fonctionnalité passe son interrupteur à true dans sa propre PR.
export const features = {
  /** Bouton Indice et modale « Utiliser un indice » dans l'écran Question. */
  hints: false,
  /** Bibliothèque des anecdotes, et son accès depuis le Hub. */
  library: false,
  /** Écran Paramètres (son, réinitialisation). */
  settings: false,
  /** Mode Champion (sinon sa carte du Hub est verrouillée avec « Bientôt »). */
  champion: false,
  /** Mode Maître (sinon sa carte du Hub est verrouillée avec « Bientôt »). */
  maitre: false,
  /** Sons du jeu. */
  sounds: false,
  /** Duel sur le même téléphone. */
  duelLocal: false,
  /** Duel par Code Défi envoyé sur WhatsApp. */
  duelWhatsapp: false,
  /** Demande au navigateur de ne pas effacer la sauvegarde (navigator.storage.persist). */
  persistStorage: false,
} as const satisfies Record<string, boolean>

export type Feature = keyof typeof features
