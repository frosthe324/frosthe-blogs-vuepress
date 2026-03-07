---
title: Web Front-end Notes - Bundling
date: 2021-10-14 16:21:58
description: Notes of Web front-end bundling
excerpt: Notes of Web front-end bundling
category:
    - WebFrontend
tag:
    - javascript
    - engineering
    - webpack
    - rollup
---

## Webpack

Webpack is used to compile JavaScript modules. Once installed, you can interact with webpack either from its [CLI](https://webpack.js.org/api/cli/) or [API](https://webpack.js.org/api/node/).

- [webpack](https://www.npmjs.com/package/webpack): 
- [webpack-cli](https://www.npmjs.com/package/webpack-cli): If you're using webpack v4 or later and want to call `webpack` from the command line, you'll also need to install the CLI.

Commonly used options in `webpack.config.js`:

- `entry`: Tell webpack the starting point to build the dependency graph.
- `output`: Tell webpack the output file or folder it should put.
- `target`: Instructs webpack to target a specific environment. Defaults to `'browserslist'` or to `'web'` when no browserslist configuration was found.

Dependency Graph: 

Any time one file depends on another, webpack treats this as a dependency. This allows webpack to take non-code assets, such as images or web fonts, and also provide them as dependencies for your application. Starting from these entry points, webpack recursively builds a dependency graph that includes every module your application needs, then bundles all of those modules into a small number of bundles - often, just one - to be loaded by the browser.

Webpack Concepts:

- `Entry`: An entry point indicates which module webpack should use to begin building out its internal dependency graph.
- `Output`: The output property tells webpack where to emit the bundles it creates and how to name these files.
- `Loaders`: Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.
  - `test`: The `test` property identifies which file or files should be transformed.
  - `use`: The `use` property indicates which loader should be used to do the transforming.
- `Plugins`: While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables.
- `Mode`: By setting the `mode` parameter to either `development`, `production` or `none`, you can enable webpack's built-in optimizations that correspond to each environment. The default value is `production`. Learn more about the [mode configuration](https://webpack.js.org/configuration/mode/) and what optimizations take place on each value.


### Webpack with TypeScript

- [typescript](https://www.npmjs.com/package/typescript): The TypeScript language and compiler package.
- [ts-loader](https://www.npmjs.com/package/ts-loader): TypeScript loader for webpack. `ts-loader` uses `tsc`, the TypeScript compiler, and relies on your `tsconfig.json` configuration. Make sure to avoid setting `module` to "CommonJS", or webpack won't be able to tree-shake your code.

___
## Rollup

Rollup specializes in outputting ES modules which can be used directly by the browser.

- Tree-Shaking: Rollup analyzes the code you are importing, and exclude anything that isn't actually used.
- Compatibility: 
  - Importing CommonJS modules: Rollup can import existing CommonJS modules through a plugin.
  - Publishing ES Modules: You can use Rollup to compile to UMD or CommonJS format which can be used by NodeJs and webpack.

See more at [Rollup Introduction](https://rollupjs.org/guide/en/#introduction) page.

### Plugins

By default, rollup only support import es modules, to load other data as modules, we need plugins.

- Plugins: Plugins are used to process different kind of data for importing.
- Output Plugins: are applied specifically to some outputs. They can only modify code after the main analysis of Rollup has completed. One possible use-case is minification of bundles to be consumed in a browser.

For more details, see [Using Plugins](https://rollupjs.org/guide/en/#using-plugins).

#### Tricky notes on Plugins

- The default typescript plugin [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript) is problematic, use [rollup-plugin-typescript2](https://github.com/ezolenko/rollup-plugin-typescript2) instead.
- The [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) plugin locates modules using the Node resolution algorithm, for using third party modules in `node_modules`.
  - `browser: true`: instructs the plugin to use the browser module resolutions in `package.json` and adds `'browser'` to `exportConditions` if it is not present so browser conditionals in exports are applied.
- The [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) plugin converts CommonJS modules to ES6, so they can be included in a Rollup bundle.
  - `transformMixedEsModules: true` will allow mixed importing syntax of `import` and `require` expressions.
- The [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias) does NOT apply to style importing in `.vue` files, need to handle that in `rollup-plugin-vue`(https://github.com/vuejs/rollup-plugin-vue) plugin.

___

## SystemJs

In-browser Javascript modules features supported by `systemjs`:
1. import maps
2. one file with multiple modules
3. Introspection of the module registry.
4. `const vueUrl = import.meta.resolve('vue');`
5. `const currentModuleUrl = import.meta.url;`
6. JSON modules, CSS modules, HTML modules and wasm(WebAssembly) modules.

___

## Vite

- The next tooling generation for the standard native module system of all browsers.
- Utilize ESBuild transpile TS(X), but not doing type checkes. ESBuild is written in Go, much faster doing transpile than the Typescript package written in JS.
- CSS hot reloading out of the box, without reloading the page.
- Pre-bundling: Utilize ESBuild to prebunlde CJS modules to ESM, so that CJS packages like React can work in the browser out of the box.
- Tree-shaking: During the pre-bundling process, Vite chunks the on-demand modules into one-single ESM, so that it reduces the size of the module loaded in the end. Vite utlizies Rollup for Production builds.
- Hot Module Replacement: Each module is cached individually at development, thus edits on modules only invalidate that module, without the need to rebundling the whole application.


### Nodejs packages work out of the box

- Typescript
- JSX
- TSX
- React
- SCSS