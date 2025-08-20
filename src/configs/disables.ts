import type { TypedFlatConfigItem } from "../types"

import { GLOB_SRC, GLOB_SRC_EXT } from "../globs"

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: "zhangwj0520/disables/scripts",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
        "zhangwj0520/no-top-level-await": "off",
      },
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: "zhangwj0520/disables/cli",
      rules: {
        "no-console": "off",
        "zhangwj0520/no-top-level-await": "off",
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "zhangwj0520/disables/bin",
      rules: {
        "zhangwj0520/no-import-dist": "off",
        "zhangwj0520/no-import-node-modules-by-path": "off",
      },
    },
    {
      files: ["**/*.d.?([cm])ts"],
      name: "zhangwj0520/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "zhangwj0520/disables/cjs",
      rules: {
        "ts/no-require-imports": "off",
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: "zhangwj0520/disables/config-files",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
        "zhangwj0520/no-top-level-await": "off",
      },
    },
  ]
}
