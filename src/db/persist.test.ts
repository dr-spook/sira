import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _resetPersistRequestForTest, requestPersistentStorage } from './persist'

describe('requestPersistentStorage', () => {
  beforeEach(() => {
    _resetPersistRequestForTest()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    _resetPersistRequestForTest()
    vi.unstubAllGlobals()
  })

  it('renvoie false sans erreur si navigator.storage n’existe pas', async () => {
    vi.stubGlobal('navigator', {})
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const result = await requestPersistentStorage()

    expect(result).toBe(false)
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('API StorageManager.persist indisponible'),
    )
  })

  it('renvoie false si navigator.storage.persist n’est pas défini', async () => {
    vi.stubGlobal('navigator', { storage: {} })

    const result = await requestPersistentStorage()

    expect(result).toBe(false)
  })

  it('renvoie true et n’appelle pas persist si le stockage est déjà persistant', async () => {
    const persistedMock = vi.fn().mockResolvedValue(true)
    const persistMock = vi.fn().mockResolvedValue(true)

    vi.stubGlobal('navigator', {
      storage: {
        persisted: persistedMock,
        persist: persistMock,
      },
    })
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const result = await requestPersistentStorage()

    expect(result).toBe(true)
    expect(persistedMock).toHaveBeenCalledTimes(1)
    expect(persistMock).not.toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Stockage déjà persistant'))
  })

  it('demande la persistance et renvoie true si elle est accordée', async () => {
    const persistedMock = vi.fn().mockResolvedValue(false)
    const persistMock = vi.fn().mockResolvedValue(true)

    vi.stubGlobal('navigator', {
      storage: {
        persisted: persistedMock,
        persist: persistMock,
      },
    })
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const result = await requestPersistentStorage()

    expect(result).toBe(true)
    expect(persistedMock).toHaveBeenCalledTimes(1)
    expect(persistMock).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Persistance accordée'))
  })

  it('demande la persistance et renvoie false si elle est refusée', async () => {
    const persistedMock = vi.fn().mockResolvedValue(false)
    const persistMock = vi.fn().mockResolvedValue(false)

    vi.stubGlobal('navigator', {
      storage: {
        persisted: persistedMock,
        persist: persistMock,
      },
    })
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const result = await requestPersistentStorage()

    expect(result).toBe(false)
    expect(persistedMock).toHaveBeenCalledTimes(1)
    expect(persistMock).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Persistance refusée'))
  })

  it('gère l’absence de la méthode persisted en appelant directement persist', async () => {
    const persistMock = vi.fn().mockResolvedValue(true)

    vi.stubGlobal('navigator', {
      storage: {
        persist: persistMock,
      },
    })

    const result = await requestPersistentStorage()

    expect(result).toBe(true)
    expect(persistMock).toHaveBeenCalledTimes(1)
  })

  it('ne fait qu’une seule demande en cas d’appels multiples consécutifs', async () => {
    const persistedMock = vi.fn().mockResolvedValue(false)
    const persistMock = vi.fn().mockResolvedValue(true)

    vi.stubGlobal('navigator', {
      storage: {
        persisted: persistedMock,
        persist: persistMock,
      },
    })

    const [res1, res2] = await Promise.all([requestPersistentStorage(), requestPersistentStorage()])

    expect(res1).toBe(true)
    expect(res2).toBe(true)
    expect(persistMock).toHaveBeenCalledTimes(1)
  })

  it('attrape toute exception levée par l’API sans bloquer et renvoie false', async () => {
    const persistedMock = vi.fn().mockRejectedValue(new Error('Erreur interne Storage'))
    vi.stubGlobal('navigator', {
      storage: {
        persisted: persistedMock,
        persist: vi.fn(),
      },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await requestPersistentStorage()

    expect(result).toBe(false)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Erreur inattendue'),
      expect.any(Error),
    )
  })
})
