/**
 * Gestion de la persistance du stockage pour la PWA SIRA (tâche D8).
 *
 * Demande au navigateur (via StorageManager.persist) d'accorder le statut
 * de stockage persistant à l'origine du site pour protéger les données
 * IndexedDB (progression, Cauris) contre les nettoyages automatiques.
 */

let pendingRequest: Promise<boolean> | null = null

/**
 * Réinitialise l'état de la requête en mémoire (usage interne pour les tests).
 */
export function _resetPersistRequestForTest(): void {
  pendingRequest = null
}

/**
 * Tente d'obtenir la persistance du stockage auprès du navigateur.
 *
 * Règle :
 * - Vérifie d'abord si l'API est disponible.
 * - Ne sollicite pas l'utilisateur si la persistance est déjà accordée.
 * - Encapsule tout appel pour ne jamais faire échouer le démarrage de l'app.
 * - Les messages d'information ne sont émis dans la console qu'en mode dev.
 *
 * @returns {Promise<boolean>} Vrai si le stockage est ou a été rendu persistant, faux sinon.
 */
export function requestPersistentStorage(): Promise<boolean> {
  if (pendingRequest) {
    return pendingRequest
  }

  pendingRequest = (async (): Promise<boolean> => {
    try {
      if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
        if (import.meta.env.DEV) {
          console.info(
            '[persistStorage] API StorageManager.persist indisponible sur ce navigateur.',
          )
        }
        return false
      }

      if (typeof navigator.storage.persisted === 'function') {
        const isPersisted = await navigator.storage.persisted()
        if (isPersisted) {
          if (import.meta.env.DEV) {
            console.info('[persistStorage] Stockage déjà persistant.')
          }
          return true
        }
      }

      const granted = await navigator.storage.persist()
      if (import.meta.env.DEV) {
        console.info(
          granted
            ? '[persistStorage] Persistance accordée par le navigateur.'
            : '[persistStorage] Persistance refusée par le navigateur.',
        )
      }
      return granted
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(
          '[persistStorage] Erreur inattendue lors de la demande de persistance :',
          error,
        )
      }
      return false
    }
  })()

  return pendingRequest
}
