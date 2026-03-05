---
title: Web Front-end Notes - Vuejs 2
description: Notes of Vuejs 2
date: 2020-07-14 16:21:58
category:
  - WebFrontend
tag:
  - javascript
  - mvvm
  - framework
  - vuejs
---

- [Using VueJS to interact with the DOM](#using-vuejs-to-interact-with-the-dom)
- [Conditionals and Lists Rendereing](#conditionals-and-lists-rendereing)
- [Communications between Components](#communications-between-components)
- [Loading Dynamic Contents](#loading-dynamic-contents)
- [Handling User Inputs with Forms](#handling-user-inputs-with-forms)
- [Using and Creating Directives](#using-and-creating-directives)
- [Filters and Mixins](#filters-and-mixins)
- [Routing](#routing)
  - [Routing Modes](#routing-modes)
  - [Basic](#basic)
  - [Advanced](#advanced)
    - [Nested Routes](#nested-routes)
    - [Named Routes](#named-routes)
    - [Named Router Views](#named-router-views)
    - [Redirecting](#redirecting)
    - [Passing Hash Fragment](#passing-hash-fragment)
    - [Navigation Routes Guard](#navigation-routes-guard)
    - [Loading Routes Lazily](#loading-routes-lazily)
- [State Management](#state-management)
  - [State](#state)
  - [Getters](#getters)
    - [Basic Usage](#basic-usage)
    - [Map Getters to Properties](#map-getters-to-properties)
  - [Mutations](#mutations)
    - [Map Mutations to Methods](#map-mutations-to-methods)
  - [Actions](#actions)
    - [Map Actions to Methods](#map-actions-to-methods)

## Using VueJS to interact with the DOM

- Only something that can be converted to a string(including variables and functions that return a string) is allowed to be put in the curly braces`{}` in Vuejs templates
- We cannot use curly braces in any HTML element attribute. Instead, use `v-bind:{attribute}` to bind properties from vue instance.
- `v-once` will only render the value once and never update.
- Vuejs by default doesn't render HTML, use `v-html` to bind a HTML tag value
- `$event`(naming) is preserved for the automatically created event object in Vue event handling, pass own argument together with `$event` in Vue event handler functions, and the `$event` always go in the last place.
- Event modifiers, see more event modifiers at https://vuejs.org/v2/guide/events.html#Event-Modifiers
  - `.stop` means to call `$event.stopPropagation()` method
  - `.prevent` means to call `$event.preventDefault()` method
- See key modifiers at https://vuejs.org/v2/guide/events.html#Key-Modifiers
- Simple Javascript expressions are supported in Vue templates, e.g `n++`, `counter *2` and ternary expression `A ? B : C`
- Vue has the `computed` property, which is aware that it should be only executed when the data property it references changed. Keep in mind that only use the function way if you want it to be re-calculated everytime.
- Computed properties always need to run synchroniously, `watch` functions gives much more possibility when you want to do more complext tasks on property changed, like async tasks.
- `:class` is used to specify addional css class in the binding way, it receives an javascript object with css class name as key and the condition as the value, or we can also directly bind to a string or string array which indicate the css class names.
- `:style` is used to directly specifiy additional css styles in the binding way, it receives an javascript object with css property name as key and css property value as the value.

## Conditionals and Lists Rendereing

- `<template>` in HTML5 will not be rendered but act as a virtual container for multiple elements.
- `v-if` really attaches or detaches elements to the DOM(Not hidden).
- `v-show` just hide the elements in the DOM by setting the css property `display:none`.
- Use `v-for="(item, index) in items"` to get the index of the element. The order is important, the first of the parentheses is the current element, second is the index of that element.
- `v-for` can also be used to loop an object itself. Use `v-for="(value, key, index) in object"` to loop key and value for an object. Again, the order is important, the first of the parentheses is the property value, the second is the property name(key), the third is the index.
- `v-for="n in 10"` is supported to loop a range of numbers.
- When using `v-for`, by default VueJS keeps track of every element in the array using the element's position. If we'd make sure VueJS track the actual item, we can specifiy a `v-bind:key=""` to tell VueJS how to uniquely identifiy each element.

## Communications between Components

- Use `props` to pass variables from the parent components to child components.
  - pass object to `props` to define more detailed configuration like validation.
  - a property setup in `props` also get setup in the `data` object.
- Pass callback function to child component to communicate from parent component to child component.
- Vue component extends Vue instance and have access to `this.$emit()` method which is used to emit custom events.
  - Use another Vue instance to act as a global event bus object.

## Loading Dynamic Contents

- Use `slot` for components to preseve content placeholders.
  - Only styles in components which contain the slot will work.
  - `<slot></slot>` without a name is treated as default slot. We can use `name` attribute to define a named slot.
  - `slot` is a vuejs preseved attribute to specify name for a slot.
- Use `component` to dynamically load different components, `is` attribute is used to bind the target component tag.
  - By default, the component instance is destroyed once the dynamic component re-evaluates the bound component tag.
  - Use `keep-alive` to wrap a dynamic `component` to prevent a loaded component instance to be destroyed. E.g, routing view components.
  - For dynamic components, we have `activated` and `deactivated` lifecycle hook methods to use whenever navigating in and away under `kept-alive` wrapped.

## Handling User Inputs with Forms

- `@click.native` modifier means to fire the click event from the inner HTML element that really handles click event
- Vuejs provides some modifiers for `v-model`:
  - `v-model.lazy` to use `change` event instead of `input` event.
  - `v-model.trim` will trim all white spaces at the beginning and at the end.
  - `v-model.number` to convert the input to a number. By default the input value is a string.
- Use `white-space: pre` to output multi-line string from textarea. See it [here](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space) in MDN
- Binding 2 inputs(checkbox) to the same `v-model`, vuejs will automatically detect it and merge the 2 values into an array
- Also bind 2 radios inputs to the same `v-model`, vuejs will detect that both radio buttons belong to the same group, and set the value to the selected one.
- What `v-model` does behind the scenes:
  - use `v-bind:value` to the given property
  - use `v-on:input` or `v-on:change`(.lazy modifier) = "{property} = \$event.target.value"
  - the `v-model` actually gives the value of the bound property to the underlying component's props["value"].
  - `v-model` listens to `input` or `change` events, so we need to emit the event in custom component.
  - Use `model` property to map `prop` name and `event` in components.
- Use `v-on:[event]` to listen to dynamic events.

## Using and Creating Directives

Built-in directives:

- `v-text`
- `v-html`

Custom Directives

- Use `Vue.directive('name-of-directive', {})` to register a directive globally.
- Use `directives` property in component configuration object to register directive locally.
- The `-v` prefix is needed to inform vuejs that it is a directive when using a custom directive.
- Configure a directive by using 5 hooks:
  - bind(el, binding, vnode): fires once directive is attached, `binding` and `vnode` should be treated as readonly.
  - insert(el, binding, vnode): fires once inserted in parent node
  - update(el, binding, vnode, oldVnode): fires once Component is updated(without Children)
  - componentUpdated(el, binding, vnode, oldVnode): fires once Component is updated(with Children)
  - unbind(el, binding, vnode): fires once Directive is Removed
- Use `v-{directive}` to use the directive, use `binding.value` to get whatever the user enter between the quotation marks when passing it with the equal sign. It also supports complex object, since vuejs doesn't care what type it is.
- Use `v-{directive}:{argument}` to allow for directive arguments, use `binding.arg` to access the argument key.
- Use `v-{directive}:{argument}.{modifier}` to allow for modifiers, use `binding.modifiers['key']` to access certian modifier.

## Filters and Mixins

Filters:

- Use `Vue.filter('name-of-filter', function(value){})` to register a filter globally.
- Use `filters` property in component configuration object to register filters locally, and the function follows `function(value){ }` and return a transformed value.
- Use `{property} | {filter}` to apply filter to bound properties.
- Use `{property} | {filter1} | {filter2}` to applied multiple filters, the output of `{property} | {filter1}` will be the input of `{filter2}`.
- Vuejs is not able to detect when it should rerun the filter or not, actually it will rerun the filter upon each re-rendering of the DOM. This can be a limit for filter due to performance reasons when compared to `computed properties`.

Mixins:

- Use `mixins` property in component configuration object to register mixins locally, which is an array to receive all the code snippets as mixins.
- Use `Vue.mixins({})` to register global mixins, but keep in mind that global mixins always execute first.
- How Vuejs merge mixins:
  - The `data` in Vue component instance is always right, and it tries to add new things from the mixins to the existing instance
  - Lifecycle hooks from mixins will also be merged, and execution order is mixins first, thereafter the component.
- Data in mixins are not shared, it is created per Vue instance.

## Routing

### Routing Modes

- The hash mode(`#`) allows the segments after the `#` tag to be handled by the javascript application. It is the default mode.
- The history mode removes the `#` tag and the web server needs to be configured to return the index.html file in all circumstances. See the [HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)

### Basic

- Use `const router = new VueRouter({routes});` to define and construct the router in the very basic case.
- Use `router-view` tag to load the components coming from the router.
- Use `router-link` tag to render a link to other routes. By using `router-link` there is an implicit click event listener attached to it, which will not do the default behavor of sending a request, instead it simply listens to the click and loads the correct route.
- Use `<router-link tag="li">` to tell `router-link` to render the link in a `li` tag.
- Use `<router-link active-class="active">` to tell `router-link` to attach the active class name `active` to the element
- Use `<router-link exact>` to tell `router-link` to treat the element as active only when the path exactly match. Without the `exact` attribute, it will treat all elements starting with the path as active.
- In Vue instance code, use `this.$route` to access Route property.
- In Vue instance code, use `this.$router` to access the router instance, where we can call:
  - `.push('{path-string}')`: to navigate to certain routes.
- The route params does not get updated if 2 routes using the same component and gets loaded to `router-view`, this is because the page does not really reload. To solve this problem, use `watch` or `computed property` to update it.
- Reacting to Params Changes on same component: the lifecycle hooks of the component will not be called. To react to param changes in the same component, we can simply watch the `$route` object, or use the `beforeRouteUpdate` navigation guard. If you don't want the Vue-Router uses the same instance of the component, attach a `key` attribute to `<router-view>` to distinguish every instance it loads.

### Advanced

#### Nested Routes

```html
<User>
  <router-view>
</User>
```

```javascript
const routes = [
  { path: '/user', component: User, children:[
    { path: '', component: UserStart }
    { path: ':id', component: UserDetail }
    { path: ':id/edit', component: UserEdit }
  ]}
]
```

- Paths of children routes can start with `/` or without `/`. With `/` means the path goes directly after the domain, while without `/` means to inherit the parent path.
- The `''` path will get loaded to `router-view` by default.

#### Named Routes

```javascript
{ path: ':id/edit', component: UserEdit, name: 'userEdit' }
```

```html
<router-link
  tag="button"
  :to="{ name: 'userEdit', params: { id: $route.params.id }}"
/>
```

- When using a named route in `router-link`, the `to` attribute must be in `v-bind:to` form otherwise it would not recognise a javascript object.
- `params` property should be specified a javascript object, and can be recognised by `VueRouter` to extract the value by setting key-value pairs.
- Same mechanism when using `this.$router.push({})` method passing an object.

#### Named Router Views

```html
<router-view name="header-top" />
<router-view />
<router-view name="header-bottom" />
```

```javascript
{ path: '', name: 'home', components: {
  defaut: Home,
  `header-top`: Header,
  `header-bottom`: Header
} }
```

- The one without a name will be the default view.
- `components` property receive an object value.

#### Redirecting

```javascript
{ path: '*', redirect: { name : 'notfound' }}
```

#### Passing Hash Fragment

```javascript
// in router configuration:
const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    // navigate the user back to where he was from
    if(savedPostion){
      return savedPosition
    }
    // if there is a hash, scroll it down
    if(to.hash){
      return {
        select: to.hash
      };
    }
    // if not, scroll it to the top.
    return { x: 0, y: 0 };
  }
})

// in :to property, hash property stands for the anchor
{
  name: 'userEdit',
  params: {
    id: $route.params.id
  },
  hash: '#data'
}"
```

#### Navigation Routes Guard

- 3 places to set up if a user is allowed to enter certain routes:
  1. in `router.beforeEach((to, from, next)=>{})`, it gets executed all the time;
  2. `beforeEnter` property in route definition which only applies to certain routes.
  3. `beforeRouteEnter` hook inside component, which applies to certain components.
- `beforeRouteLeave` in the component is the only place to check if the user is allowed to leave. `this` is accessible in this hook.
- Remember to call `next()` to proceed, possible parameters to pass to `next()` function is:
  - Nothing: the navigation will proceed.
  - A `false` to abort the route.
  - A path or an object(including `params` and `redirect`) that defines the path you want to navigate to.
  - A callback function: `this` is not accessible in `beforeRouteEnter` hook, but we can pass a callback function `next(vm=>{vm.link})` to access Vue instance properties.

#### Loading Routes Lazily

```javascript
// The User component gets loaded on demand
const User = (resolve) => {
  require.ensure(["./components/user/User.vue"], () => {
    resolve(require("./components/user/User.vue"));
  });
};
```

## State Management

Use `npm install --save vuex` to install the vuex.

### State

```javascript
export const store = new Vuex.Store({
  state: {
    counter: 0,
  },
});

import { store } from "./store/store.js";
new Vue({
  el: "#app",
  store: store,
  render: (h) => h(App),
});
```

### Getters

#### Basic Usage

```javascript
export const store = new Vuex.Store({
  state: {
    counter: 0,
  },
  getters: {
    doubleCounter: (state) => {
      return state.counter * 2;
    },
  },
});
```

#### Map Getters to Properties

- `mapGetters` helper function:
- combine custom computed properties with mapGetters using `...` in ES6.

```javascript
import { mapGetters } from 'vuex';
export default {
  computed: mapGetters(["doubleCounter", "stringCounter"]),
};

// combine custom computed properties with mapGetters
export default {
  computed: {
    customProperty(),
    ...mapGetters(["doubleCounter", "stringCounter"]),
  },
};
```

### Mutations

- It's hard to track changes from multiple components when directly accessing `$state.counter`. Use mutations instead.

```javascript
export const store = new Vuex.Store({
  state: ...
  getters: ...
  mutations: {
    increment: state => state.counter++;
  }
});

// usage:
$store.commit('increment');
```

#### Map Mutations to Methods

- `mapMutations` helper function

```javascript
import { mapMutations } from "vuex";
export default {
  methods: {
    customMethod() {},
    ...mapMutations(["incrememt", "decrement"]),
  },
};
```

- Mutations is for the purpose of tracking changes, it must run synchronously, otherwise the order of changes will not match the order of mutation happens.

### Actions

```javascript
export const store = new Vuex.Store({
  state: ...
  getters: ...
  mutations: ...,
  actions: {
    increment: context => {
      context.commit('increment');
    }
  }
});

// usage:
$store.dispatch('increment');
```

#### Map Actions to Methods

- `mapActions` helper function

```javascript
import { mapActions } from "vuex";
export default {
  methods: {
    customMethod() {},
    ...mapActions(["incrememt", "decrement"]),
  },
};
```

