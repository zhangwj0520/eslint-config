import type { OptionsStylistic, TypedFlatConfigItem } from '../types'
import { pluginAntfu, pluginImport } from '../plugins'
import { GLOB_SRC_EXT } from '../globs'

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true,
  } = options

  return [
    {
      name: 'nika/imports/rules',
      plugins: {
        import: pluginImport,
        nika: pluginAntfu,
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',

        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': 'error',
        'nika/import-dedupe': 'error',
        'nika/no-import-dist': 'error',
        'nika/no-import-node-modules-by-path': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }],
            }
          : {},
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'nika/imports/disables/bin',
      rules: {
        'nika/no-import-dist': 'off',
        'nika/no-import-node-modules-by-path': 'off',
      },
    },
  ]
}
