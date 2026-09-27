// Progression du Tour du Faso : statut de chaque région. Sauvegardée dans Dexie.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameConfig } from '@/config/game'
import { loadRegionProgress, saveRegionProgress } from '@/db/repository'
import {
  completeRegion as completeRegionRule,
  initialProgress,
  isTourComplete,
  type RegionProgress,
} from '@/engine/classic'

export const useProgressStore = defineStore('progress', () => {
  const regions = ref<RegionProgress>({})
  const loaded = ref(false)

  async function load() {
    const saved = await loadRegionProgress()
    // Première partie, ou région ajoutée depuis : on complète avec la progression de départ.
    regions.value = { ...initialProgress(gameConfig), ...saved }
    await saveRegionProgress(regions.value)
    loaded.value = true
  }

  async function recordSuccess(regionId: string, successes: number) {
    const entry = regions.value[regionId]
    if (!entry || entry.status === 'done') return
    regions.value = { ...regions.value, [regionId]: { ...entry, successes } }
    await saveRegionProgress(regions.value)
  }

  async function completeRegion(regionId: string, successes: number) {
    regions.value = completeRegionRule(regions.value, regionId, successes, gameConfig)
    await saveRegionProgress(regions.value)
  }

  const isUnlocked = (regionId: string) => {
    const status = regions.value[regionId]?.status
    return status === 'in-progress' || status === 'done'
  }
  const tourComplete = () => isTourComplete(regions.value, gameConfig)

  return { regions, loaded, load, recordSuccess, completeRegion, isUnlocked, tourComplete }
})
