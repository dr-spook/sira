<!--
  Page /kit : référence visuelle de l'équipe. Chaque composant, dans chacun de ses états.
  Uniquement en dev (voir src/router.ts) : absente du build de production.
-->
<script setup lang="ts">
import { ref } from 'vue'
import AnswerOption from '@/components/AnswerOption.vue'
import BaseButton from '@/components/BaseButton.vue'
import CauriChip from '@/components/CauriChip.vue'
import ChronoRing from '@/components/ChronoRing.vue'
import GameModal from '@/components/GameModal.vue'
import IconCauri from '@/components/icons/IconCauri.vue'
import InfoCard from '@/components/InfoCard.vue'
import LetterSlot from '@/components/LetterSlot.vue'
import LetterTile from '@/components/LetterTile.vue'
import ModeCard from '@/components/ModeCard.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import { kit } from './kit-texts'

const { states, demo } = kit
const [answerA = '', answerB = '', answerC = '', answerD = ''] = demo.answers

const modalOpen = ref(false)
const dismissibleOpen = ref(false)
const lastEvent = ref<string>(demo.none)
function log(name: string) {
  lastEvent.value = name
}
</script>

<template>
  <main class="kit">
    <header class="kit__intro">
      <h1>{{ kit.title }}</h1>
      <p>{{ kit.intro }}</p>
      <p class="kit__note">{{ kit.pressedNote }}</p>
      <p class="kit__note">
        {{ demo.lastAction }} : <strong>{{ lastEvent }}</strong>
      </p>
    </header>

    <section class="kit__section">
      <h2>IconCauri</h2>
      <div class="kit__row">
        <IconCauri size="16" />
        <IconCauri size="24" />
        <IconCauri size="40" />
        <span class="kit__on-color"><IconCauri size="24" /></span>
      </div>
    </section>

    <section class="kit__section">
      <h2>BaseButton</h2>
      <h3>primary</h3>
      <div class="kit__stack">
        <figure>
          <BaseButton block @click="log('BaseButton click')">{{ demo.primary }}</BaseButton>
          <figcaption>{{ states.rest }} · {{ states.focus }}</figcaption>
        </figure>
        <figure>
          <BaseButton block class="is-pressed">{{ demo.primary }}</BaseButton>
          <figcaption>{{ states.pressed }}</figcaption>
        </figure>
        <figure>
          <BaseButton block disabled>{{ demo.primary }}</BaseButton>
          <figcaption>{{ states.disabled }}</figcaption>
        </figure>
        <figure>
          <BaseButton size="sm">{{ demo.primary }}</BaseButton>
          <figcaption>size="sm"</figcaption>
        </figure>
      </div>
      <h3>secondary</h3>
      <div class="kit__stack">
        <figure>
          <BaseButton variant="secondary" block>{{ demo.secondary }}</BaseButton>
          <figcaption>{{ states.rest }}</figcaption>
        </figure>
        <figure>
          <BaseButton variant="secondary" block class="is-pressed">{{ demo.secondary }}</BaseButton>
          <figcaption>{{ states.pressed }}</figcaption>
        </figure>
        <figure>
          <BaseButton variant="secondary" block disabled>{{ demo.secondary }}</BaseButton>
          <figcaption>{{ states.disabled }}</figcaption>
        </figure>
        <figure>
          <BaseButton variant="secondary" block to="/">{{ demo.secondary }}</BaseButton>
          <figcaption>{{ states.link }} (to="/")</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>CauriChip</h2>
      <div class="kit__row">
        <figure>
          <CauriChip :amount="15" size="sm" />
          <figcaption>sm</figcaption>
        </figure>
        <figure>
          <CauriChip :amount="245" />
          <figcaption>md</figcaption>
        </figure>
        <figure>
          <CauriChip :amount="20" size="lg" signed :label="demo.cauriUnit" />
          <figcaption>lg, signed</figcaption>
        </figure>
        <figure>
          <CauriChip :amount="50" signed :label="demo.cauriLabel" />
          <figcaption>label</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>AnswerOption</h2>
      <div class="kit__stack">
        <figure>
          <AnswerOption letter="A" :label="answerA" @select="log('AnswerOption select')" />
          <figcaption>{{ states.rest }}</figcaption>
        </figure>
        <figure>
          <AnswerOption letter="A" :label="answerA" class="is-pressed" />
          <figcaption>{{ states.pressed }}</figcaption>
        </figure>
        <figure>
          <AnswerOption letter="B" :label="answerB" state="correct" />
          <figcaption>{{ states.correct }}</figcaption>
        </figure>
        <figure>
          <AnswerOption letter="C" :label="answerC" state="wrong" />
          <figcaption>{{ states.wrong }}</figcaption>
        </figure>
        <figure>
          <AnswerOption letter="D" :label="answerD" state="eliminated" />
          <figcaption>{{ states.eliminated }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>LetterTile</h2>
      <div class="kit__row">
        <figure>
          <div class="kit__tiles">
            <LetterTile
              v-for="letter in demo.letters"
              :key="letter"
              :letter="letter"
              @press="log(`LetterTile ${letter}`)"
            />
          </div>
          <figcaption>{{ states.bank }}</figcaption>
        </figure>
        <figure>
          <LetterTile letter="K" class="is-pressed" />
          <figcaption>{{ states.pressed }}</figcaption>
        </figure>
        <figure>
          <LetterTile letter="K" state="placed" />
          <figcaption>{{ states.placed }}</figcaption>
        </figure>
        <figure>
          <LetterTile letter="O" state="disabled" />
          <figcaption>{{ states.removed }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>LetterSlot</h2>
      <div class="kit__row">
        <figure>
          <LetterSlot />
          <figcaption>{{ states.empty }}</figcaption>
        </figure>
        <figure>
          <LetterSlot letter="B" @clear="log('LetterSlot clear')" />
          <figcaption>{{ states.filled }}</figcaption>
        </figure>
        <figure>
          <div class="kit__tiles">
            <LetterSlot v-for="letter in ['B', 'A', 'N']" :key="letter" :letter state="correct" />
          </div>
          <figcaption>{{ states.correct }}</figcaption>
        </figure>
        <figure>
          <div class="kit__tiles">
            <LetterSlot v-for="letter in ['B', 'A', 'N']" :key="letter" :letter state="wrong" />
          </div>
          <figcaption>{{ states.wrong }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>ModeCard</h2>
      <div class="kit__stack">
        <figure>
          <ModeCard
            :title="demo.modeTitle"
            :subtitle="demo.modeSubtitle"
            @play="log('ModeCard play')"
          />
          <figcaption>{{ states.unlocked }}</figcaption>
        </figure>
        <figure>
          <ModeCard
            :title="demo.lockedTitle"
            :subtitle="demo.lockedSubtitle"
            locked
            :lock-label="demo.lockedCondition"
            @locked-click="log('ModeCard locked-click')"
          />
          <figcaption>{{ states.locked }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>ProgressBar</h2>
      <div class="kit__stack">
        <figure>
          <ProgressBar :value="62" :max="100" :label="demo.progressPoints" />
          <figcaption>{{ states.continuous }}</figcaption>
        </figure>
        <figure>
          <ProgressBar :value="2" :max="17" :segments="17" :label="demo.progressLabel" />
          <figcaption>{{ states.segmented }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>ChronoRing</h2>
      <div class="kit__row">
        <figure>
          <ChronoRing :seconds="20" :total="20" />
          <figcaption>{{ states.normal }} (20/20)</figcaption>
        </figure>
        <figure>
          <ChronoRing :seconds="12" :total="20" />
          <figcaption>{{ states.normal }} (12/20)</figcaption>
        </figure>
        <figure>
          <ChronoRing :seconds="4" :total="20" />
          <figcaption>{{ states.urgent }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>GameModal</h2>
      <div class="kit__row">
        <BaseButton variant="secondary" @click="modalOpen = true">{{ kit.modal.open }}</BaseButton>
        <BaseButton variant="secondary" @click="dismissibleOpen = true">{{
          kit.modal.openDismissible
        }}</BaseButton>
      </div>
      <GameModal v-model:open="modalOpen" :title="kit.modal.title">
        <template #icon><CauriChip :amount="15" size="lg" /></template>
        <p>{{ kit.modal.body }}</p>
        <template #actions>
          <BaseButton block @click="modalOpen = false">{{ kit.modal.confirm }}</BaseButton>
          <BaseButton variant="secondary" block @click="modalOpen = false">{{
            kit.modal.close
          }}</BaseButton>
        </template>
      </GameModal>
      <GameModal v-model:open="dismissibleOpen" :title="kit.modal.title" dismissible>
        <p>{{ kit.modal.body }}</p>
        <template #actions>
          <BaseButton variant="secondary" block @click="dismissibleOpen = false">{{
            kit.modal.close
          }}</BaseButton>
        </template>
      </GameModal>
    </section>

    <section class="kit__section">
      <h2>ScreenHeader</h2>
      <div class="kit__stack">
        <figure>
          <ScreenHeader :title="demo.headerTitle" back @back="log('ScreenHeader back')">
            <template #end><CauriChip :amount="245" /></template>
          </ScreenHeader>
          <figcaption>{{ states.withBack }}</figcaption>
        </figure>
        <figure>
          <ScreenHeader :title="demo.headerPlain" :subtitle="demo.headerSubtitle" />
          <figcaption>{{ states.withoutBack }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="kit__section">
      <h2>InfoCard</h2>
      <div class="kit__stack">
        <figure>
          <InfoCard :text="demo.anecdote" />
          <figcaption>{{ states.withPattern }}</figcaption>
        </figure>
        <figure>
          <InfoCard :text="demo.anecdote" :pattern="false" />
          <figcaption>{{ states.withoutPattern }}</figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<style scoped>
.kit {
  max-width: 420px;
  margin: 0 auto;
  padding: var(--space-24) var(--space-16) var(--space-48);
}

.kit__intro h1 {
  margin: 0 0 var(--space-8);
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-display);
}

.kit__intro p {
  margin: 0 0 var(--space-8);
}

.kit__note {
  color: var(--text-medium);
  font-size: var(--font-size-14);
}

.kit__section {
  padding: var(--space-24) 0;
  border-top: var(--border-width) solid var(--border-soft);
}

.kit__section h2 {
  margin: 0 0 var(--space-16);
  font-family: ui-monospace, monospace;
  font-size: var(--font-size-20);
}

.kit__section h3 {
  margin: var(--space-16) 0 var(--space-8);
  color: var(--text-medium);
  font-family: ui-monospace, monospace;
  font-size: var(--font-size-14);
}

.kit__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-16);
}

.kit__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.kit figure {
  margin: 0;
}

.kit figcaption {
  margin-top: var(--space-4);
  color: var(--text-medium);
  font-family: ui-monospace, monospace;
  font-size: var(--font-size-12);
}

.kit__tiles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.kit__on-color {
  display: inline-grid;
  place-items: center;
  padding: var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--reward);
  color: var(--reward-text);
}
</style>
