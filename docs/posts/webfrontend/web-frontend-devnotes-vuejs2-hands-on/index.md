---
title: Web Front-end Notes - Vuejs 2 Practice
description: Notes of Vuejs 2 Practice
excerpt: Notes of Vuejs 2 Practice
date: 2020-08-05 16:21:58
category:
  - WebFrontend
tag:
  - javascript
  - mvvm
  - framework
  - vuejs
---

## Vue CLI

There are several components included in Vue CLI:

### CLI

The CLI: `@vue/cli`, provides `vue` command in terminal.

### CLI Service

The CLI Service: `@vue/cli-service`, a development dependency, built on top of `webpack` adn `webpack-dev-server`, it contains:

- The core service that loads other CLI plugins
- An internal webpack config that is optimized for most apps
- The `vue-cli-service` binary inside the project, which comes with the basic `serve`, `build` and `inspect` commands

See more detailed usage on (CLI Service)[https://cli.vuejs.org/guide/cli-service.html]

### CLI Plugins

CLI Plugins are npm packages that provide optional features to your Vue CLI projects, such as Babel/TypeScript transpilation, ESLint integration, unit testing, and end-to-end testing. It's easy to spot a Vue CLI plugin as their names start with either `@vue/cli-plugin-`(for built-in plugins) or `vue-cli-plugin-`(for community plugins).

When you run the `vue-cli-service` binary inside your project, it automatically resolves and loads all CLI Plugins listed in your project's `package.json`. See more details in [Plugins and Presets](https://cli.vuejs.org/guide/plugins-and-presets.html).

### CLI Presets

A Vue CLI preset is a JSON object that contains pre-defined options and plugins for creating a new project so that the user doesn't have to go through the prompts to select them. Presets saved during `vue create` are stored in a configuration file in your user home directory `(~/.vuerc)`. You can directly edit this file to tweak / add / delete the saved presets. See more details in [CLI Presets](https://cli.vuejs.org/guide/plugins-and-presets.html#presets).

---

## Setup a Vue CLI project

Install `vue cli` via npm:

```
npm install -g @vue/cli @vue/cli-service-global
```

### Integrate with Webpack

Create a `vue.config.js` file and specify a `configureWebpack` function property, where a `config` parameter is passed and return an object of webpack. We can play around with all webpack configurations inside this object.

### Debug typescript and vuejs in vs code

Let TypeScript generate source maps. To this end, add the following to the "compilerOptions" section of your "tsconfig.json":

```json
"sourceMap": true
```

Let's say we'd like to debug our code for chrome browser. Install `Debugger for Chrome` extension in vscode. Switch to Debug View(Ctrl + Shift + D), here are the profiles of the debug configuration, click `Run and Debug` will create a `.vscode/launch.json` file under the project root folder.

When debugging a Vue project, vs code works together with webpack source map, go to `vue.config.js` file, add `devtool: 'source-map'` to `configureWebpack` section, see more details about webpack devtool [here](https://webpack.js.org/configuration/devtool/).

---

## Vue Caveats

The original [Vuejs documentation](https://vuejs.org/v2/guide/instance.html#Data-and-Methods) mentioned:

> It should be noted that properties in `data` are only reactive if they existed when the instance was created.

Same thing mentioned at the [Vue Class Componenet documentation](https://class-component.vuejs.org/guide/class-component.html#class-component)

> Note that if the initial value is `undefined`, the class property will not be reactive, which means the changes for the properties will not be detected

We should always give an initial value on defining a property in `data` object if we want to keep it reactive.

For Vuex, it is stated as well in their [documentation](https://vuex.vuejs.org/guide/state.html#state):

> The data you store in Vuex follows the same rules as the data in a Vue instance

When working with the `vue-class-component` lib, fields in a Vue component class and a Vuex module class, will be considered as data properties/state properties. Keep in mind that defining a class field without giving a initial value will not keep it reactive after it's translated into Vue components/store.

### Array properties

For array properties, it is mentioned [here](https://vuejs.org/v2/guide/list.html#Replacing-an-Array) that replacing an array is fine.

Vue cannot detect the following changes to an array:

- When you directly set an item with the index, e.g. `vm.items[indexOfItem] = newValue`
  - To overcome this, use `$vm.set | Vue.set(vm.items, indexOfItem, newValue)` or `vm.items.splice(indexOfItem, 1, newValue)` instead.
- When you modify the length of the array, e.g. `vm.items.length = newLength`
  - To overcome this, use `vm.items.splice(newLength)` instead

### Object properties

- Vue cannot detect property addition or deletion, a property must be present in the data object in order for Vue to convert it and make it reactive
- Vue does not allow dynamically adding new root-level reactive properties to an already created instance. However, it’s possible to add reactive properties to a nested object using the `this.$set | Vue.set(vm.someObject, 'b', 2)`
- To assign a number of properties to an existing object, new properties added to the object will not trigger changes.
  - To overcome this, use `this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })` instead.

See more details at [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html).

### Vue Component/Vue Instance

Every Vue component is an individual instance of Vue, when calling `new Vue({})` or `Vue.Component("<component-name>", {})` to create a new Vue instace, the object argument include the following options configurable:

- `el`: The CSS selector of the Vue app root element
- `data`: receive an object and adds all properties found in the object to Vue's **reactivity system**. **NOTE: You may see data receives an object in root Vue instance while a function which returns an object in components. This is because root Vue instance only orrcurs once, while components could have multiple instances, this makes sure that each component instance can maintain an independent copy of the returned data object.**
- `props`:
- `propsData`:
- `computed`: See below
- `methods`: See below
- `watch`:

> Properties prefixed with a `$` are the native VueJS properties or methods.

#### How VueJS manages Data and Methods

Vue instance will only creates watchers for everything passed in the object upon creation with Vue constructor. Properties attached to Vue instance thereafter are not reactive.

- `$el`: It refers to the HTML template, the HTML code of that instance.
- `$data`: It refers to the data block we passed on Vue instance creation and made accessible from outside, it points to the same reference of the data object, `data === vm.$data` returns true.
- `refs`: VueJS adds an HTML attribute `ref` used to register the HTML element to `vm.$refs` property, which makes it easy to manipulate DOM from Vue instance Javascript code. However, `vm.$refs.heading.innerText = 'something else'` does not overwrite the Vue template code, whenever VueJS re-renders the DOM, it takes its old template and re-renders the DOM based on the old template. Be aware any changes via `$refs` property directly interact with the DOM, it is not reactive.

#### Mounting a template

We can use `vm.$mount('#app')` method to mount the Vue intance to a specific HTML element with a CSS selector. This makes it possible to mount the HTML template programmatically.

Or we can set value to `template` property in the constructor argument.

#### VueJS Intance Lifecycle

Lifecycle methods are not inside `methods` property, they are all registered directly on the root object.

- `beforeCreate()`: occurred before Vue instance creation.
- `created()`: occurred after Vue instance creation.
- `beforeMount()`:
- `mounted()`: The instance is attached to the real DOM.
- `beforeUpdate()`: Data change detected, before updating the DOM.
- `updated()`:
- `beforeDestroy()`:
- `destroyed()`: Vue instance is dead, do some clean up.

#### Computed Properties

This is how a computed property is defined:

```javascript
var vm = new Vue({
  el: "#example",
  data: {
    message: "Hello",
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split("").reverse().join("");
    },
  },
});
```

#### Computed Property vs. Methods

Instead of using a computed property, we can define the same function as a method. For the end result, the two approaches are indeed exactly the same. However, the difference is that **computed properties are cached based on their reactive dependencies**. A computed property will only re-evaluate when some of its reactive dependencies have changed. In comparison, a method invocation will **always** run the function whenever a re-render happens.

#### Computed Property vs. Watch

When you have some data that needs to be changed based on some other data, it falls easily to abuse `watch`. However, it is often a better idea to use a computed property rather than an imperative `watch` callback:

```javascript
// The Watch approach
var vm = new Vue({
  watch: {
    firstName: function (val) {
      this.fullName = val + " " + this.lastName;
    },
    lastName: function (val) {
      this.fullName = this.firstName + " " + val;
    },
  },
});
// The computed property approach
var vm = new Vue({
  computed: {
    fullName: function () {
      return this.firstName + " " + this.lastName;
    },
  },
});
```

### Plugins

In addition to vue components, there might be other types of logic blocks(services, utilities) that handle specific parts of the application. In order to expose the feature of those blocks, we can use plugins to act as the glue.

### Define a plugin class in typescript

```typescript
interface SomePluginOptions {
  // ...
}

class SomePlugin implements PluginObject<SomePluginOptions> {
  install(Vue: typeof _Vue, options?: SomePluginOptions): void {
    // ...
    Vue.$someService = someService;
    Vue.prototype.$someService = someService;
  }
}
Vue.use(SomePlugin, SomePluginOptions);
```

Plugin attach the service instance to either Vue global property or Vue instance property, `install` method signature is a must to define a plugin. To make the service typescript friendly, we also extend the vue definition file:

```typescript
declare module "vue/types/vue" {
  interface Vue {
    $someService: SomeService;
  }

  interface VueConstructor {
    $someService: SomeService;
  }
}
```

### Use Functional Components

Functional component is a stateless component without states and `this` keyword, it acts as a wrapper of its children in most cases. To get started with functional component, the `functional:true` property of the component option object is required:

```typescript
const options: FunctionalComponentOptions<
  DefaultProps,
  RecordPropsDefinition<DefaultProps>
> = {
  functional: true,
  render: function (
    createElement: CreateElement,
    context: RenderContext<DefaultProps>
  ): VNode | VNode[] {
    return createElement();
  },
};

Vue.component("some-component", options);
```

### The "key" Attribute

The `key` special attribute is primarily used as a hint for Vue’s virtual DOM algorithm to identify VNodes when diffing the new list of nodes against the old list. Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed/destroyed.

---
