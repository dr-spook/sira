const numberFormat = new Intl.NumberFormat('fr-FR')

export const fr = {
  appName: 'SIRA',

  common: {
    back: 'Retour',
    play: 'Jouer',
    close: 'Fermer',
  },

  cauri: {
    /** « 1 Cauri », « 245 Cauris » : pour les lecteurs d'écran. */
    count: (amount: number) =>
      `${numberFormat.format(amount)} ${Math.abs(amount) > 1 ? 'Cauris' : 'Cauri'}`,
    format: (amount: number, signed = false) =>
      `${signed && amount > 0 ? '+' : ''}${numberFormat.format(amount)}`,
  },

  answer: {
    correct: 'bonne réponse',
    wrong: 'mauvaise réponse',
    eliminated: 'éliminée',
  },

  tile: {
    removed: 'retirée',
  },

  slot: {
    empty: 'case vide',
    correct: 'juste',
    wrong: 'faux',
  },

  mode: {
    locked: 'verrouillé',
  },

  progress: {
    label: 'Progression',
  },

  chrono: {
    unit: 'sec',
    remaining: (seconds: number) =>
      `${seconds} ${seconds > 1 ? 'secondes restantes' : 'seconde restante'}`,
  },

  infoCard: {
    title: 'Le savais-tu ?',
  },

  errors: {
    config: 'Le jeu ne peut pas démarrer : un réglage est invalide.',
  },
} as const
