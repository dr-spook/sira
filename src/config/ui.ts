// Délais d'interface, regroupés ici pour les retrouver en un seul endroit.
// Ce ne sont pas des règles de jeu (celles-ci sont dans game.json).
export const ui = {
  /** Durée minimale d'affichage du Splash, pour que le logo ne fasse pas qu'un flash. */
  splashMinDurationMs: 2500,
  /**
   * Temps pendant lequel le résultat reste visible (bonne réponse en vert) avant la modale
   * Bravo ou Presque. Le joueur peut toucher l'écran pour passer ce délai.
   */
  resultRevealMs: 1200,
} as const
