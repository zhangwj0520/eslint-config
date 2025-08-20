import { execSync } from "node:child_process"

export function isGitClean(): boolean {
  try {
    execSync("git diff-index --quiet HEAD --")
    return true
  }
  catch {
    return false
  }
}

export function getEslintConfigContent(
  mainConfig: string,
  additionalConfigs?: string[],
): string {
  return `
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart()
}
