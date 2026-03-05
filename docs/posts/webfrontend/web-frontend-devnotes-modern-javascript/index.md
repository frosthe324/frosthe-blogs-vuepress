---
title: Web Front-end Basics - Modern Javascript
date: 2019-11-28 10:11:21
description: Modern Javascript Setup
category:
  - WebFrontend
tag:
  - javascript
  - modern-javascript
  - toolset
  - nodejs
---

- [SPA Engineering Methodology](#spa-engineering-methodology)
- [Toolsets](#toolsets)
  - [NPM](#npm)
    - [Package Versioning](#package-versioning)
    - [NPM commands notes:](#npm-commands-notes)
    - [NPM scripts](#npm-scripts)
- [ES6 Modules](#es6-modules)
- [Grunt - Javascript Task Runner](#grunt---javascript-task-runner)
  - [Installation](#installation)
  - [Gruntfile](#gruntfile)
  - [Grunt plugins and tasks](#grunt-plugins-and-tasks)
  - [Default tasks](#default-tasks)
  - [Custom tasks](#custom-tasks)
- [Webpack - Assets Bundler](#webpack---assets-bundler)
- [Babel - ES Compiler](#babel---es-compiler)
  - [Polyfill](#polyfill)
- [Regular Expressions in Javascript](#regular-expressions-in-javascript)
  - [Advanced searching with flags.](#advanced-searching-with-flags)

---

## SPA Engineering Methodology

- Source file compiling:
  - Typescript files compiling
  - SASS file compiling
- Compiled file polyfill
  - javascript polyfill to support backward compitable for ES version earlier than ES5
  - CSS prefixing to support in multiple browsers
- Bundling: scan all files from entry point and bundle them into one single file of different type.
- Minify: Compress the bundled file into a minion size for better performance

---

## Toolsets

### NPM

`npm init` will initiate a npm project and create a `package.json` file.

2 types of npm packages:

- Dependency package: `--save`, optional for newer npm versions.
- Development tools: `--save-dev`

2 types of intallation:

- Regular installs:
- Global installs: a package should be installed globally when it has commandline interface. And this requires the admin permissions.
  - For example: `nodemon`

Local dev dependency package do not work the way as global installed package do. We can specify npm scripts in `scripts` in `package.json` file.

> Usually we require core modules first, then 3rd-party modules and last our own modules.

#### Package Versioning

Take version `^1.18.11` in `package.json` for example:

- Major version: `1` is the majar version. Should expects breaking changes, it might impact the codes we already have.
- Minor version: `18` is the minor version here. It introduces some new features but no breaking changes, it should always be backward compatitle.
- Patch version: `11` only for bug fixes.
- Symbol comes in front of the version number specifies what releases we accept:
  - `^` symbol is specified by npm by default means we accept `minor` and `patch` releases for update.
  - `~` symbol means we only accept `patch` releases.
  - `*` symbol accepts all version releases.

`package-lock.json` describes detailed information including `exact version`, `source`, `integrity` for each direct and indirect dependency in order to make sure you are getting the exact same dependency tree if you're using the same `package-lock.json` file. This file is generated for any operations where npm modifies either `node_modules` tree or `package.json` file, such as `npm install`. This file is intended to be committed into source control.

- babel: Convert ES6/ESNext back to ES5
- webpack: module bundler, bundle all modules into a single file

#### NPM commands notes:

- `npm install/uninstall (--save)`: save the package/tool as dependency.
  - use `@{version-number}` to install a package with certain number.
- `npm install/uninstall --save-dev`: save the package/tool as development dependency.
- `npm install/uninstall --global`: install the package as cli and accessible everywhere.
- `npm run {script-name}`: execute the pre-defined script in `package.json` file. `start` is the standard name that keeps running in the background and update the browser as soons as we change our code. With `start`, we don't need to specify `run` before it.
- `npm outdated` will list out all packages that are outdated.
- `npm update {package-name}` will update the package according to what symbols specified in front of the version number.

#### NPM scripts

- `dev`
- `build`
- `babel-polyfill`: add codes for functions or sytax which are not present in ES5 in order to make sure it works in ES5.

---

## ES6 Modules

- `export default` works together with `import x from 'xxxxx'`;
- `export` multiple things works together with `import {x, y, z} from 'xxxxx'`

---

## Grunt - Javascript Task Runner

### Installation

```bash
$ npm install -g grunt-cli
```

> Note that grunt-cli is just the command line interface to control grunt. To get grunt actually work, we need to install `grunt`, `gruntplugins` and other modules to be installed.

For example, we install `grunt` and the JSHint task module:

```bash
$ npm install grunt --save-dev
$ npm install grunt-contrib-jshint --save-dev
```

We can checkout available gruntplugins at [plugins](https://gruntjs.com/plugins) page.

### Gruntfile

The `Gruntfile.js` file is a valid JavaScript or CoffeeScript file that belongs in the root directory of your project, next to the `package.json` file, and should be committed with your project source. A `Gruntfile` is comprised of the following parts:

- The `wrapper` function
- Project and task configuration
- Loading Grunt plugins and tasks
- Custom tasks

Let's see an example gruntfile:

```javascript
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        src: "src/<%= pkg.name %>.js",
        dest: "build/<%= pkg.name %>.min.js",
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default task(s).
  grunt.registerTask("default", ["uglify"]);
};
```

Every `Gruntfile` (and gruntplugin) uses this basic format, and all of your Grunt code must be specified inside this function:

```javascript
module.exports = function (grunt) {
  // Do grunt-related things in here
};
```

- `<% %>` template strings may reference any config properties.
- You may store any arbitrary data inside of the configuration object, and as long as it doesn't conflict with properties your tasks require

### Grunt plugins and tasks

`grunt-contrib-uglify` plugin's `uglify` task expects its configuration to be specified in a property of the same name in config object:

```javascript
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON("package.json"),
  uglify: {
    build: {
      src: "src/<%= pkg.name %>.js",
      dest: "build/<%= pkg.name %>.min.js",
    },
  },
});

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks("grunt-contrib-uglify");
```

Many commonly used tasks like `concatenation`, `minification` and `linting` are available as `grunt plugins`. As long as a plugin is specified in `package.json` as a dependency, and has been installed via `npm install`, it may be enabled inside your `Gruntfile` with a simple command like `uglify` above.

### Default tasks

You can configure Grunt to run one or more tasks by default by defining a `default` task. In the following example, running `grunt` at the command line without specifying a task will run the `uglify` task:

```javascript
// Default task(s).
grunt.registerTask("default", ["uglify"]);
```

This is functionally the same as explicitly running `grunt uglify` or even `grunt default`. Any number of tasks (with or without arguments) may be specified in the array.

### Custom tasks

If your project requires tasks not provided by a Grunt plugin, you may define custom tasks right inside the `Gruntfile`. For example, this `Gruntfile` defines a completely custom `default` task that doesn't even utilize task configuration:

```javascript
module.exports = function (grunt) {
  // A very basic default task.
  grunt.registerTask("default", "Log some stuff.", function () {
    grunt.log.write("Logging some stuff...").ok();
  });
};
```

Custom project-specific tasks don't need to be defined in the `Gruntfile`; they may be defined in external `.js` files and loaded via the `grunt.loadTasks` method.

See a list of gruntplugins at [npm package](https://www.npmjs.com/search?q=grunt-contrib).

---

## Webpack - Assets Bundler

Firstly, we need to have a `webpack.config.js` file created under the project root directory which uses nodejs sytax to export an object:

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    port: 8091,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
};
```

Webpack 4 core concepts:

- `entry point`: we use `entry` property of the config file to tell webpack the starting point of the bundling. Multiple entry files are supported.
- `output`: we use `output` property in the config object to tell webpack where to save the bundle file. `output` property receives an object value where we specify `path` and `filename`, value of `path` needs to be an absolute path.
- `loaders`: allow us to import or load all kinds of files and to also process them. Like converting SASS to CSS code or converting ES6 code to ES5 javascript. For babel, we need `babel-loader` because `babel` is the one that coverts ES6 back to ES5.
- `plugins`: plug-ins allow us to do complex processing of input files like `html-webpack-plugin` allows us to take an html template file and inject the bundled file automatically into that html file.

Packages around webpack to use:

- `webpack-cli`: the commandline interface for webpack, we can use various arguments to specify options at npm scritps, such as `--mode development/production`
- `webpack`: the webpack core package
- `webpack-dev-server`: a seperated package that will automatically bundle all our javascript files and reload the app in the browser whenever we change a file. To use it, we need to config the `devServer` property which receives an object value in the `webpack.config.js` file:
  - `contentBase`: the folder from which webpack should serve our files
  - `port`: the port to listen.
  - `--mode`: the mode taken from `webpack-cli` and apply it to `webpack-dev-server`
  - `--open`: to open the browser when the script gets executed.
  - 1 thing to note for `webpack-dev-server` is that when we're running `webpack-dev-server`, webpack will bundle our modules together but it will actually not write it to a file on disk, instead it will automatically inject it into the html. `webpack-dev-server` actually takes the `path` field of `output` to look for the html file to inject. To fix it, we need to make sure a `index.html` file exists under the target folder.
- `html-webpack-plugin`: plugins that simplifies creation of HTML files to serve your bundles. To use it, we need to configure it in `webpack.config.js` file and construct it in `plugins`, where we also pass in an config object in the constructor function.
  - `filename`: path of the final created html file which is relative to the `output.path` property
  - `template`: path of the source html file, if not providing `template` value, the plugin will try to create the html file from scrath.

---

## Babel - ES Compiler

Babel is a javascript compiler in order to use next generation javascript. To use babel, we need:

- `babel-core`: contains core functionality of the compiler.
- `babel-preset-env`: babel preset that will take care all modern javascript features are converted back to ES5.
- `babel-loader`: needed for webpack in order to actually load babel files.

To use it with `webpack`, first we need to specify the `babel-loader` for `webpack` in `webpack.config.js`, under the `module` property:

```javascript
module: {
  rules: [
    {
      test: /\.js&/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ];
}
```

`module.rules` receives a bunch of `loaders` config object, for each of the `loader`:

- `test`: property which receves a regex object.
- `exclude`: property receives a regex object to exclude the matched files or folders.
- `use` property:
  - `loader`: to specify which loader to use, in this case is the `babel-loader` installed earlier.

This whole section of `webpack.config.js` means to use `babel-loader` package to process all `.js` files outside of `node_modules` folder. Next, we need to configure `babel` itself in a seperated `.babelrc` file where includes a JSON object:

```json
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 5 versions", "ie >= 8"]
        }
      }
    ]
  ]
}
```

Here we use the `env` preset. This will let babel automatically figure out which ES6 features need to be converted in order to work on the last five versions of all the browsers.

### Polyfill

However, there are some features that can not really be converted because they were simply not present in the ES5 language, and so there is no way to simply convert them back from ES6 to ES5. These need to be polyfilled, which basically adds this to the code. For example, the `promise` object is not present in ES5, but we can write some ES5 code that basically implements the `promise` in ES5. To use pollyfill, we need to install `babel-polyfill`, and this is not a development tool because it will finally go to the code. With `babel-polyfill` in place, we should include it in `webpack.config.js` entry point in order to bundle it together with other code:

```javascript
entry: ["babel-polyfill", "./src/js/index.js"],
```

---

## Regular Expressions in Javascript

Regular expressions are objects in javascript, we can create regular expression objects in one of the 2 ways:

1. Using a regular expression literal: which consists of a pattern enclosed between slashes `let re = /ab+c/;`. Regular expression literals provide compilation of the regular expression when the script is loaded. If the regular expression remains constant, using this can improve performance.
2. Or calling the constructor function of the `RegExp` object `let re = new RegExp('ab+c');`. Using the constructor function provides runtime compilation of the regular expression. Use the constructor function when you know the regular expression pattern will be changing.

### Advanced searching with flags.

Regular expressions have six optional flags that allow for functionality like global and case insensitive searching. These flags can be used separately or together in any order, and are included as part of the regular expression.

| Flag | Description                                                                                   |
| ---- | --------------------------------------------------------------------------------------------- |
| g    | Global search                                                                                 |
| i    | Case-insensitive search                                                                       |
| m    | Multi-line search                                                                             |
| s    | Allows `.` to match newline characters                                                        |
| u    | "unicode"; treat a pattern as a sequence of unicode code points                               |
| y    | Perform a "sticky" search that matches starting at the current position in the target string. |

To include a flag with the regular expression, use this syntax:

```javascript
let re = /pattern/afgls;
```

or

```javascript
let re = new RegExp("pattern", "flags");
```

Notes when parsing string values to regex objects:

- When using `pattern` or `ng-pattern` to receive a string value for regex, no need to add the `^` and `$` sign. However, it is required to add `^` and `&` sign to be added when using literal string to create regex objects.
- Compared with regex object in javascript: `/^[^\\/:*?\"]$/`, in string value it needs to use quadra `\` to escape the `\` char 2 times. Finally it looks like `"[^\\\\/:*?\"<>|]+"`.
- HTML5 `<textarea>` does not support `pattern` attribute. `ng-pattern` can be used to `<textarea>`
