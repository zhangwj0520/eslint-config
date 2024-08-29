// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import { nika } from './src'

export default nika(
  {
    vue: true,
    react: true,
    typescript: true,
    formatters: true,
    type: 'lib',
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
