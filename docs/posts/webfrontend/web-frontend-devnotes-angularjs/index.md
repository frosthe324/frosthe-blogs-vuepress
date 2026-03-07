---
title: Web Front-end Notes - AngularJs
date: 2020-01-02 16:21:58
description: Notes of Angularjs
excerpt: Notes of Angularjs
category:
  - WebFrontend
tag:
  - javascript
  - angularjs
  - mvvm
  - frameworks
---

## Bootstrap

### Automatic Initialization

- Angularjs looks for `ngApp` directive at `document.readyState` is set to `'complete'`:
  - Load the module associated with the directive
  - Create the application injector
  - Compile the DOM treating the `ngApp` directive as the root of the compilation

### Manual Initialization

`angular.bootstrap(document, [moduleArray])` is used to bootstrap an application. Before calling this method, the module should be well defined and configured using `angular.module()` and `ngModule.config()`.

## Dependency Injection

### Factory Methods

The way you define a `directive`, `service`, or `filter` is with a `factory` function. The factory methods are registered with modules. The recommended way of declaring factories is:

```javascript
angular
  .module("myModule", [])
  .factory("serviceId", [
    "depService",
    function (depService) {
      return {
        someFunction: function () {},
      };
    },
  ])
  .service("serviceId", [
    "depService",
    function (depService) {
      this.someFunction = function () {};
    },
  ])
  .directive("directiveName", [
    "depService",
    function (depService) {
      // ...
    },
  ])
  .filter("filterName", [
    "depService",
    function (depService) {
      // ...
    },
  ]);
```

- `Services`, `directives`, `filters`, and `animations` are defined by an injectable factory method or constructor function, and can be injected with `services`, `values`, and `constants` as dependencies.
- `.factory` is very much simular to `.service`, they both result in singleton objects. `service` is just a constructor function that will be called with `new` while `factory` returns an object you can run some code before

### Module methods

We can specify functions to run at configuration and run time for a module by calling the `config` and `run` methods. These functions are injectable with dependencies just like the factory functions:

```javascript
angular
  .module("myModule", [])
  .config([
    "depProvider",
    function (depProvider) {
      // ...
    },
  ])
  .run([
    "depService",
    function (depService) {
      // ...
    },
  ]);
```

- The `config` method accepts a function, which can be injected with `providers` and `constants` as dependencies. Note that you **CANNOT** inject `services` or `values` into configuration.
- The `run` method accepts a function, which can be injected with `services`, `values` and, `constants` as dependencies. Note that you **CANNOT** inject `providers` into `run` blocks.

### Controllers

Controllers are `classes` or `constructor functions` that are responsible for providing the application behavior that supports the declarative markup in the template. The recommended way of declaring Controllers is using the array notation:

```javascript
someModule.controller('MyController', ['$scope', 'dep1', 'dep2', function($scope, dep1, dep2) {
  ...
  $scope.aMethod = function() {
    ...
  }
  ...
}]);
```

There can be many instances of the same type of `controller` in an application. Moreover, additional dependencies are made available to Controllers:

- `$scope`: Controllers are associated with an element in the DOM and so are provided with access to the `scope`. Other components(like services) only have access to the `$rootScope` service.
- `resolves`: If a controller is instantiated as part of a route, then any values that are resolved as part of the route are made available for injection into the controller.

### Providers

The injector creates two types of objects, **services** and **specialized objects**.

Services are objects whose API is defined by the developer writing the service. Specialized objects are one of `controllers`, `directives`, `filters` or `animations`. The injector needs to know how to create these objects. You tell it by registering a "recipe" for creating your object with the injector. There are five recipe types

- `Provider`: The most verbose, but also the most comprehensive one. The remaining four recipe types are just syntactic sugar on top of a provider recipe.
- `Value`:
- `Factory`:
- `Service`:
- `Constant`

The Provider recipe is syntactically defined as a custom type that implements a `$get` method. This method is a factory function just like the one we use in the Factory recipe:

```javascript
.provider('unicornLauncher', function UnicornLauncherProvider() {
  var useTinfoilShielding = false;

  this.useTinfoilShielding = function(value) {
    useTinfoilShielding = !!value;
  };

  this.$get = ["apiToken", function unicornLauncherFactory(apiToken) {
    return new UnicornLauncher(apiToken, useTinfoilShielding);
  }];
});
// we need to create a config function via the module API and have the UnicornLauncherProvider injected into it:
.config(["unicornLauncherProvider", function(unicornLauncherProvider) {
  unicornLauncherProvider.useTinfoilShielding(true);
}]);
```

#### Life Cycle Phases

- **Configuration Phase**: During application bootstrap, before AngularJS create all services, it configures and instantiates all providers. We call this `the configuration phase` of the application life-cycle. During this phase, services aren't accessible because they haven't been created yet.
- **Run phase**: Once the configuration phase is over, interaction with providers is disallowed and the process of creating services starts. We call this part of the application life-cycle the run phase.

#### Value vs. Constant

`Value` recipe is still considered as a service, it will not be available in configuration phases. Simple values, like URL prefixes, don't have dependencies or configuration, it's often handy to make them available in both the configuration and run phases. This is what the `Constant` recipe is for.

```javascript
constant("planetName", "Greasy Giant");
```

## Dependency Annotation

3 ways of annotating code with service name information:

### Inline Array Annotation

```javascript
someModule.controller("MyController", [
  "$scope",
  "greeter",
  function ($scope, greeter) {
    // ...
  },
]);
```

### \$inject Property Annotation

```javascript
var MyController = function ($scope, greeter) {
  // ...
};
MyController.$inject = ["$scope", "greeter"];
someModule.controller("MyController", MyController);
```

> Values in the \$inject array must match the ordering of the parameters in `MyController`

### Implicit Annotation

```javascript
someModule.controller("MyController", function ($scope, greeter) {
  // ...
});
```

> Given a function, the injector can infer the names of the services. However this method will not work with JavaScript minifiers/obfuscators because of how they rename parameters.

## Directives

Nowadays, angular directives are mainly restricted to attributes. For elements, we have components.

To create a new directive, we call `module.directive('{directiveName}, factoryFunction(){}')`, factory function returns an javascript object with options:

- `restrict`: one or more among EACM(Element(E), Attribute(A), Class names(C) and Comments(M)).
- `scope`:
- `require`: specify an array of controllers from required directives, like `[^^myRequiredDirective]`
  - `^^`: prefix means searching for directives on its parents
  - `^`: prefix means searching for directives on its own element or its parents
  - no `^` prefix means to look on its own element only
- `priority`: When the DOM is ready, angular walks the DOM to identify all registered directives and compile the directives one by one based on `priority` if these directives are on the same element.
- `terminal`: If set to `true`, the other directives(including child ones) will be skipped after this directive is compiled. See [here](https://stackoverflow.com/questions%2F19224028%2Fadd-directives-from-directive-in-angularjs%2F19228302%2319228302%2F) for more details.
- `link` can take an object with `pre` and `post` properties that each of them receives a `function(scope, element, attrs, controller)`. `preLink` functions get executed from parent to child of the DOM tree, and `postLink` works the other way around. However, it is not safe to do DOM transformation since the compiler linking function will fail to locate the correct elements for linking.
- `link`: actually equal to `postLink`, takes a `function link(scope, element, attrs, controller, transcludeFn){...}` function as a DOM listeners in order to munipulate the DOM:
  - scope: an angular scope object.
  - element: the element where the directive is attached.
  - attrs: a hash object with key-value pairs of normalized attribute names and their values
  - controller: is the directive's required controller instance(s) or its own controller (if any). The exact value depends on the directive's require property.
  - transcludeFn: is a transclude linking function pre-bound to the correct transclusion scope.

The basic difference between `controller` and `link` is that `controller` can expose an API, and `link` functions can interact with `controllers` using `require`. Use `controller` when you want to expose an API to other directives. Otherwise use `link`.

Directive Notes:

- `ng-attr-{attribute}` will decide to render that attribute on element or not, while `{attribute}` will not do this.
- `::`: `one-time` binding

## Misc notes

- sometimes, the `$scope.$watch()` function only works for nested object properties, which means `$scope.$watch('datetime', function())` does not fire. Instead, it works when `$scope.$watch('myModel.datetime', function())`. This is still under investigation.
- `$scope.$watch('controller.scheduled', function())` can apply watch function to a controller's property.
