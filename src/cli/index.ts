import process from 'node:process'
import c from 'picocolors'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import * as p from '@clack/prompts'
import { run } from './run'
import { pkgJson } from './constants'

function header(): void {
  // eslint-disable-next-line no-console
  console.log('\n')
  p.intro(`${c.green(`@zhangwj0520/eslint-config `)}${c.dim(`v${pkgJson.version}`)}`)
}

const instance = yargs(hideBin(process.argv))
  .scriptName('@zhangwj0520/eslint-config')
  .usage('')
  .command(
    '*',
    'Run the initialization or migration',
    args => args
      .option('yes', {
        alias: 'y',
        description: 'Skip prompts and use default values',
        type: 'boolean',
      })
      .option('template', {
        alias: 't',
        description: 'Use the framework template for optimal customization: vue / react',
        type: 'string',
      })
      .option('extra', {
        alias: 'e',
        array: true,
        description: 'Use the extra utils: formatter / perfectionist / unocss',
        type: 'string',
      })
      .help(),
    async (args) => {
      header()
      try {
        await run(args)
      }
      catch (error) {
        p.log.error(c.inverse(c.red(' Failed to migrate ')))
        p.log.error(c.red(`✘ ${String(error)}`))
        process.exit(1)
      }
    },
  )
  .showHelpOnFail(false)
  .alias('h', 'help')
  .version('version', pkgJson.version)
  .alias('v', 'version')

// eslint-disable-next-line ts/no-unused-expressions
instance
  .help()
  .argv
