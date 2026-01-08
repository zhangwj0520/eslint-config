import type { OptionsFiles, OptionsReact, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types';

import { ensurePackages, interopDefault } from '../utils';

export async function tanstack(
  options: OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes & OptionsReact & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  await ensurePackages([
    '@tanstack/eslint-config',
  ]);

  const [
    pluginTanstack,
  ] = await Promise.all([
    interopDefault(import('@tanstack/eslint-config')),
  ] as const);

  return [
    {
      name: 'zhangwj0520/tanstack',
      plugins: {
        tanstack: pluginTanstack,
      },
    },

  ];
}
