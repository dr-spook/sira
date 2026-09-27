import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,ts,vue}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dev-dist/**',
    '**/coverage/**',
    'content-source/**',
    'public/content/**',
    'src/content/**',
  ]),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // Prettier passe par ESLint : un fichier mal formaté fait échouer `npm run lint`.
  // `npm run format` le corrige.
  prettier,
)
