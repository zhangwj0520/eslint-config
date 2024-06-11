import { interopDefault } from '../utils'
import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      name: 'nika/stylistic/rules',
      plugins: {
        nika: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        'curly': ['off', 'multi', 'consistent'],

        'nika/consistent-list-newline': 'error',
        'style/brace-style': 'off',

        ...(lessOpinionated
          ? {

            }
          : {
              'nika/curly': 'error',
              'nika/if-newline': 'error',
              'nika/top-level-function': 'error',
            }
        ),

        ...overrides,
      },
    },
  ]
}
