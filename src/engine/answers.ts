/**
 * Clé de comparaison entre deux réponses : NFC, sans accents, sans casse, sans espaces ni tirets.
 * « Mossi », « MOSSI » et « Gourmantche » / « Gourmantché » donnent la même clé : on ne les
 * propose donc jamais ensemble. (La vérification du Direct, elle, se fait tuile par tuile.)
 */
export function answerKey(answer: string): string {
  return answer
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[\s\-‐‑–—'’‘]/gu, '')
    .toLowerCase()
    .normalize('NFC')
}
