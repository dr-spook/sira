<!--
  Tour du Faso (maquette 3) : chemin des 17 régions, panneau de la région choisie, bouton Continuer.
  Le chemin est dessiné en SVG à la largeur réelle de l'écran (mesurée), pour que les
  pointillés ne soient pas déformés.
-->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import RegionNode from '@/components/RegionNode.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import { gameConfig } from '@/config/game'
import { catalog } from '@/content/catalog'
import { currentRegionId, regionTarget } from '@/engine/classic'
import { fr } from '@/i18n/fr'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const player = usePlayerStore()
const progress = useProgressStore()

const ROW_HEIGHT = 104
const DISC = 64
const PADDING = 24
// Positions horizontales des nœuds (en fraction de la largeur), répétées le long du chemin.
const ZIGZAG = [0.26, 0.7, 0.4, 0.74, 0.3, 0.66]

const regions = computed(() =>
  gameConfig.classique.regionOrder.map((id) => {
    const region = catalog.regions.find((r) => r.id === id)!
    const state = progress.regions[id] ?? { status: 'locked' as const, successes: 0 }
    return {
      ...region,
      status: state.status,
      successes: state.successes,
      target: regionTarget(id, catalog.puzzles, gameConfig),
    }
  }),
)
const doneCount = computed(() => regions.value.filter((r) => r.status === 'done').length)
const current = computed(() => currentRegionId(progress.regions, gameConfig))

const queryRegion = typeof route.query.region === 'string' ? route.query.region : undefined
const selectedId = ref(queryRegion ?? current.value ?? regions.value[0]!.id)
const selected = computed(() => regions.value.find((r) => r.id === selectedId.value)!)
/** Région lancée par le bouton : celle choisie si elle est en cours, sinon la région en cours. */
const playable = computed(() =>
  selected.value.status === 'in-progress'
    ? selected.value
    : regions.value.find((r) => r.id === current.value),
)

// --- Dessin du chemin ---
const map = ref<HTMLElement>()
const width = ref(343)
let observer: ResizeObserver | undefined

const points = computed(() =>
  regions.value.map((_, index) => ({
    x: ZIGZAG[index % ZIGZAG.length]! * width.value,
    y: PADDING + index * ROW_HEIGHT + DISC / 2,
  })),
)
const height = computed(() => PADDING * 2 + (regions.value.length - 1) * ROW_HEIGHT + DISC)
const segments = computed(() =>
  points.value.slice(1).map((to, index) => {
    const from = points.value[index]!
    const bend = ROW_HEIGHT / 2
    return {
      d: `M ${from.x} ${from.y} C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`,
      // Tronçon parcouru : il mène à une région ouverte.
      reached: regions.value[index + 1]!.status !== 'locked',
    }
  }),
)

const nodeStyle = (index: number) => {
  const point = points.value[index]!
  const labelLeft = point.x > width.value / 2
  return {
    top: `${point.y - DISC / 2}px`,
    ...(labelLeft
      ? { right: `${width.value - point.x - DISC / 2}px` }
      : { left: `${point.x - DISC / 2}px` }),
  }
}
const labelSide = (index: number) => (points.value[index]!.x > width.value / 2 ? 'left' : 'right')

onMounted(async () => {
  if (map.value) {
    width.value = map.value.clientWidth
    observer = new ResizeObserver(([entry]) => {
      if (entry) width.value = entry.contentRect.width
    })
    observer.observe(map.value)
  }
  await nextTick()
  map.value
    ?.querySelector<HTMLElement>(`[data-region="${selectedId.value}"]`)
    ?.scrollIntoView({ block: 'center' })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main class="tour">
    <ScreenHeader
      :title="fr.tour.title"
      :subtitle="fr.tour.subtitle(doneCount, regions.length)"
      :back="{ name: 'hub' }"
    >
      <template #end><CauriChip :amount="player.profile.cauris" /></template>
    </ScreenHeader>

    <section ref="map" class="tour__map" :aria-label="fr.tour.mapLabel">
      <svg
        class="tour__path"
        :viewBox="`0 0 ${width} ${height}`"
        :height="height"
        aria-hidden="true"
      >
        <path
          v-for="(segment, index) in segments"
          :key="index"
          :d="segment.d"
          :class="segment.reached ? 'tour__segment--reached' : 'tour__segment--ahead'"
        />
      </svg>
      <div
        v-for="(region, index) in regions"
        :key="region.id"
        class="tour__node"
        :data-region="region.id"
        :style="nodeStyle(index)"
      >
        <RegionNode
          :name="region.name"
          :status="region.status"
          :successes="region.successes"
          :target="region.target"
          :selected="region.id === selectedId"
          :label-side="labelSide(index)"
          @select="selectedId = region.id"
        />
      </div>
    </section>

    <ul class="tour__legend">
      <li><span class="tour__dot tour__dot--done" />{{ fr.tour.legend.done }}</li>
      <li><span class="tour__dot tour__dot--current" />{{ fr.tour.legend.current }}</li>
      <li><span class="tour__dot tour__dot--locked" />{{ fr.tour.legend.locked }}</li>
    </ul>

    <footer class="tour__panel">
      <div class="tour__selected" aria-live="polite">
        <strong>{{ selected.name }}</strong>
        <span :class="`tour__status--${selected.status}`">
          {{ fr.tour.statusLabel(selected.status, selected.successes, selected.target) }}
        </span>
      </div>
      <BaseButton
        v-if="playable"
        block
        :to="{ name: 'question', params: { regionId: playable.id } }"
      >
        {{ fr.tour.continue(playable.name) }}
      </BaseButton>
      <template v-else>
        <p class="tour__complete">{{ fr.tour.complete }}</p>
        <BaseButton block :to="{ name: 'hub' }">{{ fr.tour.backToHub }}</BaseButton>
      </template>
    </footer>
  </main>
</template>

<style scoped>
.tour {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.tour__map {
  position: relative;
  overflow: hidden;
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
}

.tour__path {
  display: block;
  width: 100%;
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
}

.tour__segment--reached {
  stroke: var(--progress-fill);
}

.tour__segment--ahead {
  stroke: var(--border-soft);
  stroke-dasharray: 2 14;
}

.tour__node {
  position: absolute;
}

.tour__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-16);
  margin: var(--space-12) 0;
  padding: 0;
  color: var(--text-medium);
  font-size: var(--font-size-12);
  list-style: none;
}

.tour__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.tour__dot {
  width: 14px;
  height: 14px;
  border: var(--border-width) solid var(--border-strong);
  border-radius: 50%;
}

.tour__dot--done {
  border-color: var(--action-primary-edge);
  background: var(--state-success);
}

.tour__dot--current {
  border-color: var(--progress-fill);
  background: var(--surface-card);
}

.tour__dot--locked {
  border-color: var(--border-soft);
  background: var(--state-locked-bg);
}

/* Le panneau reste visible en bas pendant qu'on fait défiler la carte. */
.tour__panel {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin: 0 calc(var(--space-16) * -1);
  padding: var(--space-12) var(--space-16) calc(var(--space-16) + env(safe-area-inset-bottom));
  background: var(--surface-page);
}

.tour__selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-height: 56px;
  padding: var(--space-12) var(--space-16);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
}

.tour__selected strong {
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-display);
}

.tour__status--done,
.tour__status--in-progress {
  color: var(--state-success-text);
  font-weight: var(--font-weight-title);
}

.tour__status--locked {
  color: var(--state-locked-text);
}

.tour__complete {
  margin: 0;
  text-align: center;
  font-weight: var(--font-weight-title);
}
</style>
