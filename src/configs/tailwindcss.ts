import type { OptionsTailwindCSS, TypedFlatConfigItem } from '../types';

import { ensurePackages, interopDefault } from '../utils';

export async function tailwindcss(
  options: OptionsTailwindCSS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    attributify = true,
    strict = false,
  } = options;

  await ensurePackages([
    'eslint-plugin-tailwindcss',
  ]);

  const [
    pluginTailWindCSS,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-tailwindcss')),
  ] as const);

  return [
    {
      name: 'zhangwj0520/tailwindcss',
      plugins: {
        tailwind: pluginTailWindCSS,
      },
      rules: {
        // 'tailwindcss/classnames-order': 'warn',
        ...attributify
          ? {
              // 'tailwind/classnames-order': 'warn',
            }
          : {},
        ...strict
          ? {
              // 'tailwind/blocklist': 'error',
            }
          : {},
      },
    },
    {
      settings: {
        tailwindcss: {
        // These are the default values but feel free to customize
          callees: ['classnames', 'clsx', 'ctl'],
          classRegex: '^class(Name)?$', // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
          config: 'tailwind.config.js', // returned from `loadConfig()` utility if not provided
          cssFiles: [
            '**/*.css',
            '!**/node_modules',
            '!**/.*',
            '!**/dist',
            '!**/build',
          ],
          cssFilesRefreshRate: 5_000,
          removeDuplicates: true,
          skipClassAttribute: false,
          tags: [], // can be set to e.g. ['tw'] for use in tw`bg-blue`
          whitelist: [],
        },
      },
    },
  ];
}
