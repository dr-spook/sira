import type { RegionStatus } from '@/engine/classic'

const numberFormat = new Intl.NumberFormat('fr-FR')
const plural = (count: number, one: string, many: string) => (Math.abs(count) > 1 ? many : one)

export const fr = {
  appName: 'SIRA',
  tagline: 'Le chemin des cultures',

  common: {
    back: 'Retour',
    play: 'Jouer',
    close: 'Fermer',
    soon: 'Bientôt',
  },

  cauri: {
    /** « 1 Cauri », « 245 Cauris » : pour les lecteurs d'écran. */
    count: (amount: number) =>
      `${numberFormat.format(amount)} ${plural(amount, 'Cauri', 'Cauris')}`,
    format: (amount: number, signed = false) =>
      `${signed && amount > 0 ? '+' : ''}${numberFormat.format(amount)}`,
    unit: (amount: number) => plural(amount, 'Cauri', 'Cauris'),
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
      `${seconds} ${plural(seconds, 'seconde restante', 'secondes restantes')}`,
  },

  infoCard: {
    title: 'Le savais-tu ?',
  },

  formats: {
    duo: 'Duo',
    carre: 'Carré',
    direct: 'Directe',
  },

  splash: {
    logoAlt: 'SIRA, le chemin des cultures',
    loading: 'Chargement…',
  },

  hub: {
    chooseMode: 'Choisis un mode',
    griot: (done: number, total: number) => `Griot du Faso · ${done}/${total}`,
    classique: { title: 'Classique', subtitle: 'Le Tour du Faso' },
    champion: {
      title: 'Champion',
      subtitle: (seconds: number) => `Rappel · ${seconds} s`,
      condition: (points: number) => `${points} pts en Classique`,
    },
    maitre: {
      title: 'Maître',
      subtitle: (seconds: number) => `Maîtrise · ${seconds} s`,
      condition: 'Après Champion',
    },
    puzzle: { title: 'Puzzle', subtitle: 'Reconstitue l’image' },
    multiplayer: { title: 'Multijoueur', subtitle: 'Duel entre amis' },
  },

  tour: {
    title: 'Le Tour du Faso',
    subtitle: (done: number, total: number) => `Deviens Griot du Faso · ${done}/${total}`,
    mapLabel: 'Carte des régions',
    legend: { done: 'Terminée', current: 'En cours', locked: 'Verrouillée' },
    statusLabel: (status: RegionStatus, successes: number, target: number) =>
      status === 'done'
        ? `Terminée · ${successes}/${target}`
        : status === 'locked'
          ? 'Verrouillée'
          : `En cours · ${successes}/${target}`,
    continue: (region: string) => `Continuer · ${region}`,
    complete: 'Tu as terminé le Tour du Faso !',
    backToHub: 'Retour au hub',
  },

  question: {
    progress: (region: string, position: number, total: number) =>
      `${region} · ${position}/${total}`,
    promptChoice: 'Quel mot relie ces 4 images ?',
    promptDirect: 'Compose la réponse',
    images: 'Les 4 images de l’énigme',
    imageFallback: (index: number) => `Image ${index}`,
    optionsLabel: 'Propositions',
    bankLabel: 'Lettres disponibles',
    slotsLabel: 'Ta réponse',
    validate: 'Valider',
    hint: 'Indice',
    giveUp: 'Abandonner',
    correct: 'Juste !',
    wrong: 'Faux',
    skip: 'Touche l’écran pour continuer',
  },

  result: {
    bravo: 'Bravo !',
    answerWas: 'La réponse était',
    points: (points: number) => `+${numberFormat.format(points)} points`,
    streakBonus: (streak: number, cauris: number) =>
      `Série de ${streak} : +${cauris} ${plural(cauris, 'Cauri', 'Cauris')}`,
    noLoss: 'Aucun Cauri perdu.',
    loss: (cauris: number) => `${cauris} ${plural(cauris, 'Cauri perdu', 'Cauris perdus')}`,
    next: 'Énigme suivante',
    continue: 'Continuer',
  },

  retry: {
    title: 'Pas tout à fait !',
    text: 'Regarde bien les 4 images : quel mot les relie ?',
    button: 'Réessayer',
  },

  regionDone: {
    title: 'Région terminée !',
    bonusLabel: 'Cauris · bonus région',
    next: 'Région suivante',
    backToMap: 'Retour à la carte',
  },

  errors: {
    config: 'Le jeu ne peut pas démarrer : un réglage est invalide.',
  },
} as const
