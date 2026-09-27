import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/fonts.css'
import '@/styles/tokens.css'
import '@/styles/base.css'

import App from '@/App.vue'
import { configErrorMessage, configErrors } from '@/config/game'
import { fr } from '@/i18n/fr'
import { router } from '@/router'

// game.json invalide : on n'ouvre pas le jeu avec de mauvais chiffres. Le message est affiché
// dans la page et dans la console, puis le démarrage s'arrête.
if (configErrors.length) {
  const message = configErrorMessage()
  const box = document.createElement('pre')
  box.className = 'fatal-error'
  box.textContent = `${fr.errors.config}\n\n${message}`
  document.getElementById('app')?.replaceChildren(box)
  throw new Error(message)
}

createApp(App).use(createPinia()).use(router).mount('#app')
