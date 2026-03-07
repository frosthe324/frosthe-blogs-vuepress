---
title: Web Front-end Notes - Typescript Practice
date: 2021-03-01 09:21:58
description: Notes of Typescript practice
excerpt: Notes of Typescript practice
category:
  - WebFrontend
tag:
  - typescript
  - javascript
---

## TypeScript Tooling

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): The handbook for references.
- [Playground](https://www.typescriptlang.org/play): An online playground for TypeScript.
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig): An annotated reference to more than a hundred compiler options available in a `tsconfig.json` or `jsconfig.json`.
- [Type Search](https://www.typescriptlang.org/dt/search?search=): Search for npm modules with types from DefinitelyTyped or embedded in the module.

Since TypeScript becomes more and more popular in JavaScript world, it becomes 1st citizen when it comes to topics like linting, bundling, debugging, unit testing and so on. However, most of the tools are built in the first place for Javascript, there are some extra work to do to make them support TypeScript.

## TypeScript Centralized World

To use TypeScript in a project, we need:

- [typescript](https://www.npmjs.com/package/typescript): The npm package that inclues TypeScript language and compiler package.
- [tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html): The CLI options references, most of which can be chunked out in a `tsconfig.json` file.

### TypeScript Linting

For historical reasons, TSLint has been deprecated since 2019. Instead of continuing using TSLint, [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint) becomes the option for linting TypeScript.

In order to properly configure `eslint` and `typescript-eslint`, there are a set of packages needed and what they do:

- [ESLint](https://eslint.org/): The essential package required for Javascript linting, the [`eslint:recommended`](https://eslint.org/docs/rules/) ruleset is ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages): `typescript-eslint` contains a set of packages, we pick the necessary ones to fulfill our needs:
  - [typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser): This package is the custom implementation provided to ESLint, which is capable of parsing Tyescript source code, and delivering an AST which is compatible with the one ESLint expects.
  - [typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin): This package allows to use the typescript specific rules, it also provides the `plugin:@typescript-eslint/recommended` config - it's just like `eslint:recommended`, except it only turns on rules from TypeScript-specific plugin.
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier#readme): This plugin works best if you disable all other ESLint rules relating to code formatting, this plugin ships with a `plugin:prettier/recommended` config that sets up both the plugin and `eslint-config-prettier` in one goal.

Read [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) for more details.

#### TypeScript Vue Project Linting

- [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue): Initially setup together with `vue-cli` created project, it provides the `vue-eslint parser` and some [predefined configs](https://eslint.vuejs.org/user-guide/#bundle-configurations) such as `plugin:vue/essential`.
- Vue Cli related eslint configs: The configs are specifically designed to be used by Vue CLI setups and is not meant for outside use
  - [@vue/eslint-config-typescript](https://github.com/vuejs/eslint-config-typescript#readme): It provides config `@vue/typescript/recommended` which is extended from the `plugin:@typescript-eslint/recommended` ruleset.
  - [@vue/eslint-config-prettier](https://github.com/vuejs/eslint-config-prettier#readme): Similar to `@vue/eslint-config-typescript` config, this package ships with the `@vue/prettier` and `@vue/prettier/@typescript-eslint` configs.

### TypeScript Unit Testing

#### Jest

Jest provides developers with a unit testing framework including built-in support for Javascript files.

- `jest`: The javascript unit test framework. Configuration references can be found at [Configuring Jest](https://jestjs.io/docs/configuration).
- [@types/jest](https://www.npmjs.com/package/@types/jest): This package contains type definitions for Jest.

To run jest unit test files, Jest also provide a cli with a rich set ot options. Explore more at [Jest CLI Options](https://jestjs.io/docs/cli);

There are some commonly used options:

- `testRegex`: The regexp pattern or array of patterns that Jest uses to detect test files.
- `transform`: A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files.
  - [babel-jest](https://www.npmjs.com/package/babel-jest): If you are already using `jest-cli`, add `babel-jest` and it will automatically compile JavaScript code using Babel.
  - [ts-jest](https://www.npmjs.com/package/ts-jest): A TypeScript preprocessor with source map support for Jest that lets you use Jest to test projects written in TypeScript. The transformer used to handle `.ts` or `.tsx` files.
  - [jest-transform-stub](https://www.npmjs.com/package/jest-transform-stub): Jest doesn't handle non JavaScript assets by default. You can use this module to avoid errors when importing non JavaScript assets.
  - [vue-jest](https://www.npmjs.com/package/vue-jest): Jest Vue transformer with source map support. The transformer used to handle `.vue` file.
- `moduleNameMapper`: A map from regular expressions to module names or to arrays of module names that allow to stub out resources, like images or styles with a single module. Modules that are mapped to an alias are unmocked by default, regardless of whether automocking is enabled or not.

## Debugging Typescript in VSCode

### Debug nodejs files

Pure Typescript files debugging is pretty simple:

1. In `tsconfig.json` file, set `compilerOptions.sourceMap` to `true`
2. In `.vscode` folder, add a new configuration, follow the steps at [Debugging Typescript](https://code.visualstudio.com/docs/typescript/typescript-debugging). Or see more details at [Debugging](https://code.visualstudio.com/Docs/editor/debugging) page.
3. Press `F5`.

### Debug web front-end files

Let TypeScript generate source maps. Add the following to the `compilerOptions` section of the `tsconfig.json`:

```JSON
"sourceMap": true
```

A VSCode debugger launch configuration needs to be created, find it in `.vscode/launch.json` file. See more details at [Launch.json attributes](https://code.visualstudio.com/docs/editor/debugging#_launchjson-attributes) and [Debugger for Chrome](https://github.com/microsoft/vscode-chrome-debug/blob/master/README.md#other-optional-launch-config-fields).

### Debug Unit Test Files from VSCode

In order to debug UT from VSCode, we need 2 more extensions:

- [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer): Provides an extensible user interface for running your tests in VS Code. It can be used with any testing framework if there is a corresponding [Test Adapter extension](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer#test-adapters).
- [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter): The Jest test adapter extension.
