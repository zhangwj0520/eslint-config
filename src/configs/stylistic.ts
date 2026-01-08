import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types';
import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  experimental: false,
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    experimental,
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

  const config = pluginStylistic.configs.customize({
    experimental,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem;

  return [
    {
      name: 'zhangwj0520/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...experimental
          ? {}
          : {
              'antfu/consistent-list-newline': 'error',
            },

        'antfu/consistent-chaining': 'error',

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {
              'antfu/curly': 'error',
              'antfu/if-newline': 'error',
              'antfu/top-level-function': 'error',
            }
        ),

        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/jsx-quotes': ['error', 'prefer-double'],
        'style/jsx-sort-props': ['error', { ignoreCase: true, shorthandFirst: true }],
        'style/quotes': ['error', 'single', { allowTemplateLiterals: 'always', avoidEscape: true }],
        'style/semi': ['error', 'always', { omitLastInOneLineBlock: true, omitLastInOneLineClassBody: true }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides,
      },
    },
  ];
}
