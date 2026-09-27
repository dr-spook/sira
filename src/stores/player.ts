// Le joueur : Cauris, points du Classique, série en cours. Sauvegardé dans Dexie à chaque changement.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameConfig } from '@/config/game'
import { EMPTY_PROFILE, loadProfile, saveProfile, type Profile } from '@/db/repository'
import { addToBalance, isChampionUnlocked, spend, type Reward } from '@/engine/economy'

export const usePlayerStore = defineStore('player', () => {
  const profile = ref<Profile>({ ...EMPTY_PROFILE })
  const loaded = ref(false)
  let loading: Promise<void> | null = null

  /** Charge depuis la sauvegarde une seule fois, même si plusieurs écrans le demandent en même temps. */
  function ensureLoaded(): Promise<void> {
    loading ??= load()
    return loading
  }

  async function load() {
    profile.value = await loadProfile()
    loaded.value = true
  }

  async function persist() {
    await saveProfile({ ...profile.value })
  }

  /** Ajoute le résultat d'une réponse (gain, points, nouvelle série). */
  async function applyReward(reward: Reward) {
    profile.value = {
      cauris: addToBalance(profile.value.cauris, reward.cauris),
      points: addToBalance(profile.value.points, reward.points),
      streak: reward.streak,
    }
    await persist()
  }

  async function addCauris(amount: number) {
    profile.value = { ...profile.value, cauris: addToBalance(profile.value.cauris, amount) }
    await persist()
  }

  /** Paie un coût. Renvoie false (sans rien changer) si le solde ne suffit pas. */
  async function spendCauris(cost: number): Promise<boolean> {
    const result = spend(profile.value.cauris, cost)
    if (!result.ok) return false
    profile.value = { ...profile.value, cauris: result.value }
    await persist()
    return true
  }

  const championUnlocked = () => isChampionUnlocked(profile.value.points, gameConfig)

  return {
    profile,
    loaded,
    load,
    ensureLoaded,
    applyReward,
    addCauris,
    spendCauris,
    championUnlocked,
  }
})
