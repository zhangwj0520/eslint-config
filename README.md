# @zhangwj0520/eslint-config

[![npm](https://img.shields.io/npm/v/@zhangwj0520/eslint-config?color=444&label=)](https://npmjs.com/package/@zhangwj0520/eslint-config)

- 自动修复格式（旨在独立使用 ，无需 Prettier）
- 合理的默认值、最佳实践、仅一行配置
- 开箱即用，支持 TypeScript、JSX、Vue、JSON、YAML、Toml、Markdown 等
- 有主见，但[高度可定制](#customization)
- [ESLint Flat 配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)，轻松组合！
- 可选支持 [React](#react)、[Svelte](#svelte)、[UnoCSS](#unocss)、[Astro](#astro)、[Solid](#solid)
- 可选支持 [formatters](#formatters) 格式化 CSS、HTML、XML 等
- **风格原则**：阅读最简，diff 稳定，风格一致
  - 导入排序，尾随逗号
  - 单引号，无分号
  - 使用 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- 默认遵循 `.gitignore`
- 需要 ESLint v9.5.0+

> [!NOTE]
> 本配置默认为新的 [ESLint Flat 配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)。
>
> [!WARNING]
> 很感谢大家喜欢这个配置，也很荣幸。为此我尽量让它更灵活、可定制，以适配更多场景。
>
> 但请记住，这仍然是**个人配置**，有很多主观意见。变更未必适合所有人和所有场景。
>
> 如果你直接使用本配置，建议**每次升级都检查变更**。如需更强控制权，欢迎 fork。谢谢！

## 使用方法

### 手动安装

如果你喜欢手动配置：

```bash
pnpm i -D eslint @zhangwj0520/eslint-config
```

然后在项目根目录创建 `eslint.config.mjs`：

```js
// eslint.config.mjs
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig()
```

### package.json 脚本

例如：

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## IDE 支持（保存时自动修复）

<details>
<summary>🟦 VS Code 支持</summary>

<br>

安装 [VS Code ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

在 `.vscode/settings.json` 中添加如下设置：

```jsonc
{
  // 禁用默认格式化器，改用 eslint
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在 IDE 中静默风格规则，但仍自动修复
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // 启用所有支持语言的 eslint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

## 自定义

[ESLint Flat 配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)。它提供了更好的组织和组合方式。

通常你只需导入 `defineConfig` 预设：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig()
```

就可以了！或者你可以单独配置每个集成，例如：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
// 项目类型。库使用 'lib'，默认是 'app'
  type: 'lib',

  // 启用风格格式化规则
  // stylistic: true,

  // 或自定义风格规则
  stylistic: {
    indent: 2, // 4 或 'tab'
    quotes: 'single', // 或 'double'
  },

  // TypeScript 和 Vue 会自动检测，你也可以显式启用：
  typescript: true,
  vue: true,

  // 禁用 jsonc 和 yaml 支持
  jsonc: false,
  yaml: false,

  // `.eslintignore` 在 Flat 配置中不再受支持，请改用 `ignores`
  ignores: [
    '**/fixtures',
    // ...globs
  ]
})
```

`defineConfig` 工厂函数还接受任意数量的任意自定义配置覆盖：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig(
  {
    // defineConfig 的配置
  },

  // 从第二个参数开始是 ESLint Flat 配置
  // 你可以有多个配置
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

更高级的用法是，你还可以导入细粒度的配置并按需组合：

<details>
<summary>高级示例</summary>

我们一般不建议以这种风格使用，除非你确切知道它们在做什么，因为配置之间有共享选项，可能需要额外的注意以保持一致。

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@zhangwj0520/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
)
```

</details>

查看 [configs](https://github.com/antfu/eslint-config/blob/main/src/configs) 和 [factory](https://github.com/antfu/eslint-config/blob/main/src/factory.ts) 获取更多细节。

> 感谢 [sxzz/eslint-config](https://github.com/sxzz/eslint-config) 的启发和参考。

### 插件重命名

由于 flat 配置要求我们显式提供插件名称（而不是 npm 包名称的强制约定），我们重命名了一些插件，以使整体范围更一致，更易于书写。

| 新前缀     | 原前缀                 | 源插件                                                                                     |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9promise/eslint-plugin-import-lite)         |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

当你想要覆盖规则或内联禁用它们时，你需要更新为新前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> 关于插件重命名 - 这实际上是一个相当危险的举动，可能导致潜在的命名冲突，详见 [这里](https://github.com/eslint/eslint/discussions/17766) 和 [这里](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat)。由于本配置也非常**个人化**和**有观点**，我雄心勃勃地将其定位为每个项目唯一的**"顶级"**配置，这可能会影响规则命名的方式。
>
> 本配置更关心用户体验，尽量简化实现细节。例如，用户可以继续使用语义化的 `import/order`，而无需了解底层插件已两次迁移到 `eslint-plugin-i`，然后迁移到 `eslint-plugin-import-x`。用户也不必在中途迁移到隐式的 `i/order`，仅仅因为我们将实现切换到了一个分支。
>
> 也就是说，这可能仍然不是一个好主意。如果你维护自己的 eslint 配置，可能不想这样做。
>
> 如果你在将此配置与其他某些配置预设结合使用时遇到命名冲突，欢迎提出问题。我很乐意想办法使它们兼容。但目前我没有计划撤销重命名。

此预设将自动为你的自定义配置重命名插件。你可以使用原始前缀直接覆盖规则。

<details>
<summary>恢复为原始前缀</summary>

如果你真的想使用原始前缀，可以通过以下方式恢复插件重命名：

```ts
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig()
  .renamePlugins({
    ts: '@typescript-eslint',
    yaml: 'yml',
    node: 'n'
    // ...
  })
```

</details>

### 规则覆盖

某些规则仅在特定文件中启用，例如，`ts/*` 规则仅在 `.ts` 文件中启用，`vue/*` 规则仅在 `.vue` 文件中启用。如果你想覆盖规则，需要指定文件扩展名：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig(
  {
    vue: true,
    typescript: true
  },
  {
    // 请记得在此处指定文件 glob，否则可能导致 vue 插件处理非 vue 文件
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // 没有 `files`，则是所有文件的通用规则
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
```

我们还为每个集成提供了 `overrides` 选项，以便更轻松地进行配置：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```

### 配置组合器

工厂函数 `defineConfig()` 返回一个 [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer)，你可以链式调用这些方法以更灵活地组合配置。

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig()
  .prepend(
    // 一些主配置之前的配置
  )
  // 覆盖任何命名的配置
  .override(
    'zhangwj0520/stylistic/rules',
    {
      rules: {
        'style/generator-star-spacing': ['error', { after: true, before: false }],
      }
    }
  )
  // 重命名插件前缀
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  })
// ...
```

### Vue

Vue 支持会通过检查项目中是否安装了 `vue` 自动检测。你也可以显式启用/禁用它：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  vue: true
})
```

#### Vue 2

我们对 Vue 2 的支持有限（因为它已经[结束生命周期](https://v2.vuejs.org/eol/)）。如果你仍在使用 Vue 2，可以通过将 `vueVersion` 设置为 `2` 来手动配置：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  vue: {
    vueVersion: 2
  },
})
```

由于 Vue 2 处于维护模式，我们只接受错误修复。建议尽可能升级到 Vue 3。

#### Vue 可访问性

要启用 Vue 可访问性支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  vue: {
    a11y: true
  },
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D eslint-plugin-vuejs-accessibility
```

### 可选配置

我们提供了一些可选配置，以满足特定用例，但默认不包括它们的依赖。

#### 格式化工具

使用外部格式化工具格式化 ESLint 尚不支持的文件（`.css`、`.html` 等）。由 [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format) 提供支持。

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  formatters: {
    /**
     * 格式化 CSS、LESS、SCSS 文件，以及 Vue 中的 `<style>` 块
     * 默认使用 Prettier
     */
    css: true,
    /**
     * 格式化 HTML 文件
     * 默认使用 Prettier
     */
    html: true,
    /**
     * 格式化 Markdown 文件
     * 支持 Prettier 和 dprint
     * 默认使用 Prettier
     */
    markdown: 'prettier'
  }
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D eslint-plugin-format
```

#### React

要启用 React 支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  react: true,
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

要启用 Svelte 支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  svelte: true,
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

要启用 Astro 支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  astro: true,
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D eslint-plugin-astro
```

#### Solid

要启用 Solid 支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  solid: true,
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

要启用 UnoCSS 支持，你需要显式开启：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  unocss: true,
})
```

运行 `npx eslint` 时应该会提示你安装所需的依赖项，否则你可以手动安装：

```bash
npm i -D @unocss/eslint-plugin
```

### 可选规则

此配置还提供了一些可选插件/规则以供扩展使用。

#### `command`

由 [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command) 提供支持。它不是典型的 lint 规则，而是一个按需的微型代码修改工具，通过特定注释触发。

例如以下触发器：

- `/// to-function` - 将箭头函数转换为普通函数
- `/// to-arrow` - 将普通函数转换为箭头函数
- `/// to-for-each` - 将 for-in/for-of 循环转换为 `.forEach()`
- `/// to-for-of` - 将 `.forEach()` 转换为 for-of 循环
- `/// keep-sorted` - 对对象/数组/接口进行排序
- ... 等等 - 详见 [文档](https://github.com/antfu/eslint-plugin-command#built-in-commands)

你可以在要转换的代码上方添加触发注释，例如（注意三条斜杠）：

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

当你保存文件时，它会被转换为：

```ts
async function foo(msg: string): void {
  console.log(msg)
}
```

命令注释通常是一锤子的，保存后会连同转换一起删除。

### 类型感知规则

你可以通过将选项对象传递给 `typescript` 配置来选择性启用 [类型感知规则](https://typescript-eslint.io/linting/typed-linting/)：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

### 编辑器特定禁用

当 ESLint 在代码编辑器中运行时，以下规则的自动修复被禁用：

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

自 v3.16.0 起，它们不再被禁用，而是通过 [这个助手](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix) 设置为不可修复。

这是为了防止在重构时编辑器删除未使用的导入，从而获得更好的开发体验。这些规则将在你在终端中运行 ESLint 或 [Lint Staged](#lint-staged) 时应用。如果你不想要这种行为，可以禁用它们：

```js
// eslint.config.js
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  isInEditor: false
})
```

### Lint Staged

如果你想在每次提交前应用 lint 和自动修复，可以在 `package.json` 中添加以下内容：

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

然后

```bash
npm i -D lint-staged simple-git-hooks

// 激活钩子
npx simple-git-hooks
```

## 查看启用的规则

我构建了一个可视化工具，帮助你查看项目中启用的规则及其适用文件，[@eslint/config-inspector](https://github.com/eslint/config-inspector)

进入包含 `eslint.config.js` 的项目根目录，运行：

```bash
npx @eslint/config-inspector
```

## 版本控制策略

本项目遵循 [语义化版本控制](https://semver.org/) 发布。然而，由于这只是一个配置，涉及到许多主观意见和许多变动的部分，我们不将规则变更视为破坏性变更。

### 被视为破坏性变更的更改

- Node.js 版本要求更改
- 可能破坏配置的重大重构
- 插件重大更改可能破坏配置
- 可能影响大多数代码库的更改

### 被视为非破坏性变更的更改

- 启用/禁用规则和插件（可能变得更严格）
- 规则选项更改
- 依赖项版本提升

## 常见问题

### Prettier?

[Why I don't use Prettier](https://antfu.me/posts/why-not-prettier)

不过，你仍然可以使用 Prettier 来格式化 ESLint 尚不支持的文件，例如 `.css`、`.html` 等。有关更多详细信息，请参见[格式化工具](#formatters)。

### dprint?

[dprint](https://dprint.dev/) 也是一个很棒的格式化工具，具有更多自定义能力。然而，它与 Prettier 类似，都是从头读取 AST 并重新打印代码。这意味着它与 Prettier 类似，忽略原始换行符，可能导致不一致的 diff。因此，通常我们更喜欢使用 ESLint 来格式化和检查 JavaScript/TypeScript 代码。

同时，我们确实有 dprint 集成用于格式化其他文件，例如 `.md`。有关更多详细信息，请参见[格式化工具](#formatters)。

### 如何格式化 CSS？

你可以选择加入 [`formatters`](#formatters) 功能来格式化你的 CSS。请注意，这只是进行格式化，而不是 linting。如果你想要适当的 linting 支持，可以尝试 [`stylelint`](https://stylelint.io/)。

### 顶级函数风格等

我个人意见很强烈，所以这个配置也是。我更喜欢顶级函数始终使用函数声明而不是箭头函数；我喜欢没有大括号的一行 if 语句，并且总是换行，等等。我甚至写了一些自定义规则来强制执行它们。

我知道它们不一定是流行的观点。如果你真的想摆脱它们，可以通过以下方式禁用它们：

```ts
import defineConfig from '@zhangwj0520/eslint-config'

export default defineConfig({
  lessOpinionated: true
})
```

### 我更喜欢 XXX...

当然，你可以在项目中自定义和覆盖规则以适应你的需求。如果这仍然不适合你，欢迎 fork 此仓库并维护你自己的版本。

## 另请查看

- [antfu/dotfiles](https://github.com/antfu/dotfiles) - 我的 dotfiles
- [antfu/vscode-settings](https://github.com/antfu/vscode-settings) - 我的 VS Code 设置
- [antfu/starter-ts](https://github.com/antfu/starter-ts) - 我用于 TypeScript 库的启动模板
- [antfu/vitesse](https://github.com/antfu/vitesse) - 我用于 Vue & Vite 应用的启动模板
