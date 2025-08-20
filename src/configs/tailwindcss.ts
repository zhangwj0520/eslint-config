import type { OptionsTailwindCSS, TypedFlatConfigItem } from "../types"

import { ensurePackages, interopDefault } from "../utils"

export async function tailwindcss(
  options: OptionsTailwindCSS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    attributify = true,
    strict = false,
  } = options

  await ensurePackages([
    "eslint-plugin-tailwindcss",
  ])

  const [
    pluginTailWindCSS,
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-tailwindcss")),
  ] as const)

  return [
    {
      name: "zhangwj0520/tailwindcss",
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
  ]
}
