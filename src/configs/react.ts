/* eslint-disable perfectionist/sort-objects */
import type { OptionsFiles, OptionsReact, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types';

import { isPackageExists } from 'local-pkg';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs';

import { ensurePackages, interopDefault } from '../utils';

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  'vite',
];
const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev',
];
const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev',
];
const NextJsPackages = [
  'next',
];

function toLegacyReactRuleId(ruleId: string): string {
  if (!ruleId.startsWith('@eslint-react/'))
    return ruleId;

  const rawRuleId = ruleId.slice('@eslint-react/'.length);

  if (rawRuleId.startsWith('dom-'))
    return `react-dom/${rawRuleId.slice('dom-'.length)}`;
  if (rawRuleId.startsWith('rsc-'))
    return `react-rsc/${rawRuleId.slice('rsc-'.length)}`;
  if (rawRuleId.startsWith('web-api-'))
    return `react-web-api/${rawRuleId.slice('web-api-'.length)}`;
  if (rawRuleId.startsWith('naming-convention-'))
    return `react-naming-convention/${rawRuleId.slice('naming-convention-'.length)}`;

  return `react/${rawRuleId}`;
}

function normalizeReactRules(rules: TypedFlatConfigItem['rules'] | undefined): TypedFlatConfigItem['rules'] {
  if (!rules)
    return rules;

  return Object.fromEntries(
    Object.entries(rules).map(([ruleId, ruleValue]) => [toLegacyReactRuleId(ruleId), ruleValue]),
  );
}

function createLegacyPluginAliases(pluginReact: any): TypedFlatConfigItem['plugins'] {
  const reactRules: Record<string, unknown> = {};
  const reactDomRules: Record<string, unknown> = {};
  const reactNamingConventionRules: Record<string, unknown> = {};
  const reactRscRules: Record<string, unknown> = {};
  const reactWebApiRules: Record<string, unknown> = {};

  for (const [ruleName, rule] of Object.entries<Record<string, unknown>>(pluginReact.rules ?? {})) {
    if (ruleName.startsWith('dom-')) {
      reactDomRules[ruleName.slice('dom-'.length)] = rule;
      continue;
    }

    if (ruleName.startsWith('naming-convention-')) {
      reactNamingConventionRules[ruleName.slice('naming-convention-'.length)] = rule;
      continue;
    }

    if (ruleName.startsWith('rsc-')) {
      reactRscRules[ruleName.slice('rsc-'.length)] = rule;
      continue;
    }

    if (ruleName.startsWith('web-api-')) {
      reactWebApiRules[ruleName.slice('web-api-'.length)] = rule;
      continue;
    }

    reactRules[ruleName] = rule;
  }

  return {
    'react': {
      meta: pluginReact.meta,
      rules: reactRules,
    },
    'react-dom': {
      meta: pluginReact.meta,
      rules: reactDomRules,
    },
    'react-naming-convention': {
      meta: pluginReact.meta,
      rules: reactNamingConventionRules,
    },
    'react-rsc': {
      meta: pluginReact.meta,
      rules: reactRscRules,
    },
    'react-web-api': {
      meta: pluginReact.meta,
      rules: reactWebApiRules,
    },
  };
}
export async function react(
  options: OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes & OptionsReact & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [
      `${GLOB_MARKDOWN}/**`,
      GLOB_ASTRO_TS,
    ],
    overrides = {},
    tsconfigPath,
  } = options;

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-refresh',
  ]);

  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'react/no-leaked-conditional-rendering': 'error',
  };

  const [
    pluginReact,
    pluginReactRefresh,
  ] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i));
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i));
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i));
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i));

  const pluginsFromConfigs = pluginReact.configs.all.plugins;

  const reactPlugins = pluginsFromConfigs?.['@eslint-react/dom']
    ? {
        'react': pluginsFromConfigs['@eslint-react'],
        'react-dom': pluginsFromConfigs['@eslint-react/dom'],
        'react-naming-convention': pluginsFromConfigs['@eslint-react/naming-convention'],
        'react-rsc': pluginsFromConfigs['@eslint-react/rsc'],
        'react-web-api': pluginsFromConfigs['@eslint-react/web-api'],
      }
    : createLegacyPluginAliases(pluginReact);

  const recommendedRules = normalizeReactRules(pluginReact.configs.recommended.rules);

  return [
    {
      name: 'zhangwj0520/react/setup',
      plugins: {
        ...reactPlugins,
        'react-refresh': pluginReactRefresh,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'zhangwj0520/react/rules',
      rules: {
        ...recommendedRules,

        'react/prefer-namespace-import': 'error',

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        'react-refresh/only-export-components': [
          'error',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-static-params
                    'generateStaticParams',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-metadata
                    'metadata',
                    'generateMetadata',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-viewport
                    'viewport',
                    'generateViewport',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
                    'generateImageMetadata',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
                    'generateSitemaps',
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action',
                    'clientLoader',
                    'clientAction',
                    'handle',
                    'shouldRevalidate',
                  ]
                : []),
            ],
          },
        ],

        // overrides
        ...overrides,
      },
    },
    {
      files: filesTypeAware,
      name: 'zhangwj0520/react/typescript',
      rules: {
        // Disables rules that are already handled by TypeScript
        'react-dom/no-string-style-prop': 'off',
        'react-dom/no-unknown-property': 'off',
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'zhangwj0520/react/type-aware-rules',
          rules: {
            ...typeAwareRules,
          },
        }]
      : [],
  ];
}
