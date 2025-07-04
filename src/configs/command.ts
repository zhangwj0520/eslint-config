import type { TypedFlatConfigItem } from '../types'

import createCommand from 'eslint-plugin-command/config'

export async function command(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ...createCommand(),
      name: 'zhangwj0520/command/rules',
    },
  ]
}
