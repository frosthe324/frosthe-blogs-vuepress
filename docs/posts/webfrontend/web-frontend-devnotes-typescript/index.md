---
title: Web Front-end Notes - Typescript
date: 2020-09-07 09:21:58
description: Basics of Typescript
category:
  - WebFrontend
tag:
  - typescript
  - javascript
---

- [Types](#types)
  - [Core Types](#core-types)
  - [Object Type](#object-type)
  - [Union & Intersection Types](#union--intersection-types)
  - [Literal Types](#literal-types)
  - [Discriminated Unions](#discriminated-unions)
  - [Type Aliases](#type-aliases)
  - [Void Type & Never Type](#void-type--never-type)
  - [Functions as Types](#functions-as-types)
  - [Unknown Type](#unknown-type)
- [Classes & Interfaces](#classes--interfaces)
  - [Classes](#classes)
  - [Interfaces](#interfaces)
  - [Type Alias vs. Interfaces](#type-alias-vs-interfaces)
    - [Declaration Merging](#declaration-merging)
    - [Extends and Implements](#extends-and-implements)
    - [What should I use?](#what-should-i-use)
- [Type Guards](#type-guards)
  - ["typeof" keyword](#typeof-keyword)
  - ["in" keyword](#in-keyword)
  - ["instanceof" keyword](#instanceof-keyword)
  - [Type Casting](#type-casting)
    - [<TType> before the variable](#ttype-before-the-variable)
    - ["as" keyword after the variable](#as-keyword-after-the-variable)
- [Index Properties](#index-properties)
- [Function Overloads](#function-overloads)
- [Optional Chaining](#optional-chaining)
  - [Nullish Coalescing](#nullish-coalescing)
- [Generic Types](#generic-types)
  - [Constraints](#constraints)
    - ["keyof" Constraint](#keyof-constraint)
  - [Typescript built-in generic utility types](#typescript-built-in-generic-utility-types)
- [Decorators](#decorators)
  - [Class Decorators](#class-decorators)
  - [Property Decorators](#property-decorators)
  - [Accessor Decorators](#accessor-decorators)
  - [Methods Decorators](#methods-decorators)
  - [Parameter Decorators](#parameter-decorators)
- [Typescript Compiler](#typescript-compiler)
  - [Watch mode:](#watch-mode)
  - [Compile entire project:](#compile-entire-project)
  - [tsconfig.json](#tsconfigjson)
    - [compilerOptions section](#compileroptions-section)
  - [Debugging with Visual Studio Code](#debugging-with-visual-studio-code)
  - [Declaration Files](#declaration-files)

## Types

`typeof` returns the type value in string.

### Core Types

The core primitive types in TypeScript are all lowercase!

- `number`: numbers are by default floats in both JS and TS, `+input` is equal to `parseFloat(input)`
- `string`
- `boolean`
- `object`: object types are written almost like objects, but with key/type pairs.
- `Array`:
- `Tuple`(introduced in TS): `[number, string]` is a tuple type definition. `push` method is allowed for Tuple.
- `Enum`(introduced in TS): `enum { NEW, OLD }`, default is number type starting with 0 and automatically increment.
- `Any`(introduced in TS): takes away all the benefits that typescript gives you. Used as fallback.

> When assigned `null` to variables of primitive types, the Typescript compiler will not complain.

### Object Type

```typescript
// typescript type inference for object type:
const person = {
    name: 'Frost';
    age: 30;
}

// object type definition:
const person: {
    name: string;
    age: number;
 } = {
    name: 'Frost';
    age: 30;
}
```

### Union & Intersection Types

Union types are types that accept more than 1 type:

```typescript
let input1: number | string;
```

Intersection types allow us to combine types.

```typescript
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;
```

- In the case of union types, intersection types output the members in common
- In the case of object types, intersection types output the combination.

### Literal Types

Literal types are based on core types, like `string` or `number`, but with poticular value of those types, and often used together with union types:

```typescript
let resultConversion: "as-number" | "as-text";

// this will popup compile errors.
if(resultConversion === 'as-numbe')
```

### Discriminated Unions

Build discriminated union by giving every interface an extra property(whatever name you want, typically "kind" or "type"),

```typescript
interface Bird {
  type: "bird"; // literal type in fact
  flyingSpeed: number;
}

interface Horse {
  type: "horse"; // literal type in fact
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
  }
  console.log("Moving with speed: " + speed);
}
moveAnimal({ type: "bird", flyingSpeed: 10 });
```

### Type Aliases

`type` keyword in Typescript is used to set type aliases:

```typescript
// use with union types
type Combinable = number | string;
// use with literal types
type ConversionDescriptor = "as-number" | "as-text";
// use with object type
type User = {
  name: string;
  age: number;
};
```

### Void Type & Never Type

`undefined` is not valid return type for functions in Typescript, because Typescript would expect the function to have a `return` statement, just not return a value. `void` means the function does not return anything, it is allowed that the function does not have a `return` statement.

`never` type can be used as another return type for functions that never return anything, essentially throw errors or in a infinite loop.

### Functions as Types

`Function` type allows to assign a function signature to variables, which is quite simular to delegates in C#.

```typescript
// define a function type that takes 2 number type parameters and return a number
let combineValues: (a: number, b: number) => number;
// used together with type alias
type AddFunction = (a: number, b: number) => number;
// used together with callback functions
function(a: number, b: number, cb: (num: number) => void);
```

> When function type is used with a callback function, the `void` means the function will not use the returned value, it does not restrict that the function cannot have a `return` statement.

### Unknown Type

`Any` is the most flexible type in Typescript which basically disables all type checking. `unknown` is a bit more restrictive than `Any` type, Typescript will have type checkings on it before assign it to another variable with clear type:

```typescript
let userInput: unknown;
let userName: string;

userInput = 5;
userName = userInput; // tsc will complain
```

## Classes & Interfaces

### Classes

Class exists since ES6, typescript supports it and extends a few use cases.

- Consturctor: `constructor` is the syntax sugar which is called when you call the `new SimpleClass()` to create class instance.
- `this` keyword: refers to the concrete instance of the class in methods. However, `this` typically refers to the object that is responsible to call methods. We can declare `this:Department` in method parameters, so that Typescript ensures that `this` keyword inside a method should always refer to an instance of type `Department`.
- `public` is the default modifer for class members.
- Shorthand Initialization: `constructor(private id: string, private name: string){};`: declare class fields as constructor parameters.
- `readonly` modifier: it makes sure the field can be only written during initialization.
- `extends` keyword allows class to inherit from another class. One class can only inherit from one parent class.
  - Always call `super()` first in the inherited class's own constructors.
  - With `es7`, we can directly use property definition in class, no need to call `super`.
- Override:
  - Define the same method signature in derived class to override the implementation of that method in base class.
  - use `protected` keyword to allow derived classes to have access.
- Getters & Setters:
  - `get` keyword is used to create a getter. Getters are defined in method signature, while it is accessed like properties. Getter is by default public.
  - `set` keyword is used to create a setter, but it takes a `value` argument.
- Abstract Class: `abstract` keyword can only be used in abstract class to define abstract members.

### Interfaces

- `interface` only exists in Typescript
- Interfaces define a structure of objects.
- Typically used as a custom type
- A class can implement an interface by using `implements` keyword, while it can not implement a custom type in the early days due to historical reasons.
- Interface can also be used to define a function type: `interface AddFn { (a: number, b: number): number; }`, but it is more common to use custom type to define function types.
- Specify optional properties/parameters/methods by adding `?` after the property name. Default value of optional properties is `undefined`.
- Interface is purely a development feature for writing better codes.

### Type Alias vs. Interfaces

- Interfaces are basically a way to describe data shapes, for example, an object.
- Type is a definition of a type of data, for example, a union, primitive, intersection, tuple, or any other type.

#### Declaration Merging

One thing that’s possible to do with interfaces but are not with types is declaration merging.

```typescript
interface Song {
  artistName: string;
}

interface Song {
  songName: string;
}

const song: Song = {
  artistName: "Freddie",
  songName: "The Chain",
};
```

#### Extends and Implements

In TypeScript, we can easily extend and implement interfaces. This is not possible with types though.

#### What should I use?

- Interfaces are better when you need to define a new object or method of an object.
- Types are better when you need to create function types.


## Type Guards

### "typeof" keyword

`typeof` is used to check primitive types. However, using `typeof` to check custom types always return `Object`.

### "in" keyword

Instead, we use `in` keyword for type guards of custom types.

```typescript
// The way to check if a property exsits in an object at runtime.
if ("privileges" in emp) {
  console.log("Privileges: " + emp.privileges);
}
```

### "instanceof" keyword

Another type guard method is to use `instanceof` keyword:

```typescript
type Vehicle = Car | Truck;
const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}
```

> `instanceof` can be used for `class`. However, `instanceof` can not be used to check `interface`, because interfaces are not translated into any javascript code.

### Type Casting

Typescript has no idea what type of the `element` is:

```typescript
const element = document.getElementById("user-input");
element.value = "Hi there!";
```

#### <TType> before the variable

```typescript
const element = <HTMLInputElement>document.getElementById("user-input");
element.value = "Hi there!";
```

#### "as" keyword after the variable

```typescript
const element = document.getElementById("user-input") as HTMLInputElement;
element.value = "Hi there!";
```

## Index Properties

Index types allow us to create objects which are more flexible regarding the properties they might hold.

```typescript
interface ErrorContainer {
  // { email: 'Not a valid email', user: 'X' }
  [key: string]: string;
}
```

Every property added the key must be a string and the value must be a string.

## Function Overloads

To define function overloads:

- Same function name
- Different parameter amount, types and return type.

## Optional Chaining

In Javascript. we often do something like `fetchedUserData.job && fetchedUserData.job.title` to securely access `job.title` in case it does exist. In typescript, we can use `fetchedUserData.job?.title` as the equivalent.

### Nullish Coalescing

`const storeData = userInput ?? 'DEFAULT';`: means only return "DEFAULT" only when `userInput` is `null` or `undefined`.

## Generic Types

```typescript
function merge<T, U>(objA: T, objB: B);
```

### Constraints

Use `extends` to set constraints for type arguments.

```typescript
function merge<T extends object, U extends object>(objA: T, objB: B);
```

#### "keyof" Constraint

Type argument `U` should be one of existing key of type `T`:

```typescript
function extractAndConvert<T extends object, U extends keyof T>();
```

### Typescript built-in generic utility types

These types only exsits in typescript world.

- `Partial<T>`
- `Readonly<T>`
- ...

## Decorators

- Decorators execute when defining classes. It does not execute at runtime.
- Use `@` to use the decorators
- Decorator factories runs in top-bottom order, while decorators run in bottom-top order.

### Class Decorators

- Class decorators are functions with one argument of target constructor.
- Class decorators can return a new class to extend the original class with extra logic.

### Property Decorators

Property decorator receives 2 arguments:

- target: **prototype of the object** if attached to an instance property, or **the constructor function** if attached to a static property
- property name: property name of `string` or `symbol` type.

### Accessor Decorators

Accessor decorator receives 3 arguments:

- target: **prototype of the object** if attached to an instance accessor, or **the constructor function** if attached to a static accessor
- name: name of the accessor itself of type `string` or `symbol`.
- property descriptor: of Typescript built-in type `PropertyDescriptor`.

### Methods Decorators

Method decorator receives 3 arguments:

- target: **prototype of the object** if attached to an instance method, or **the constructor function** if attached to a static method
- name: name of the method of type `string` or `symbol`.
- property descriptor: of Typescript built-in type `PropertyDescriptor`.

Accessor and methods decorators can return a new `PropertyDescriptor` to replace the original one.

### Parameter Decorators

Parameter decorator receives 3 arguments:

- target: **prototype of the object** if attached to an instance method, or **the constructor function** if attached to a static method
- name: name of the method in which the parameter is used, of type `string` or `symbol`.
- position of the parameter: of type `number`, index starting with 0.

## Typescript Compiler

### Watch mode:

Use `tsc app.ts --watch/-w` to watch changes for a single file.

### Compile entire project:

`tsc --init` creates a `tsconfig.json` file for the working directory and considers it as a typescript project, run `tsc` will compile all the files under the folder/sub-folders.

### tsconfig.json

`tsconfig.json` tells typescript how the compiler behaves.

- `"exclude": ["node_modules"]`: accept an array of files and folders to be excluded. It accepts wildcard pattern. `node_modules` is excluded by default.
- `"include": []`: accept an array of files and folders to be included. If it is set, everything not covered by `include` will not get compiled.
- `"files": []`: allows to point the individual files of specific paths.

#### compilerOptions section

- `"target": "es5"`: tells typescript in which ES version you want to compile the code to. `"es5"` is the default value.
- `"lib": ["dom", "es6", "dom.iterable", "scripthost"]`: allows to specify which default objects and features typescript knows. Typescript does not know anything about `DOM` objects by default. However the default value depends on the `target` option. For example, for `es6`, it by default includes all the features that are globally available in ES6, and it assumes that all DOM APIs are available. Basically the default libs allow your compiled javascript run in the browser.
- `"allowJs": false`: allow to include javascript files in the complaination
- `"checkJs": false`: will not compile javascript files but will check syntax and report errors.
- `"sourceMap": false`: helps with debugging. If set to `true`, the compiler will also generate `.js.map` file as well, which acts as a bridge between javascript and typescript. The browser will also load the typescript file and allow debugging.
- `"outDir": "./"`: tell the typescript compiler where the created javascript files should be stored.
- `"rootDir": "./"`: make sure typescript does not look into others folders.
- `"removeComments": false`: will remove any comments after compilation.
- `"noEmit": false`: does not generate any javascript files, like dry run.
- `"noEmitOnError": false`: if set to `true`, typescript will stop generating any outputs if any error detected.
- `"strict": false`: If set to `true`, it enables all following strict type-checking options:
  - `"noImplictAny": false`: If set to `true`, it ensures that we have to be clear about the types of the parameters that in no way can be inferred.
  - `"strictNullChecks": false`: If set to `false`, the compiler will not complain a potential null value variable.
  - `"strictFunctionTypes":`:
  - `"strictBindCallApply":`: If set to `true`, it checks if it makes sense(match arguments) of the arguments you passed to `bind`, `call` and `apply` functions.
  - `"strictPropertyInitialization": `:
  - `"noImplicitThis": `:
  - `"alwaysStrict": `: If set to `true`, it controls that the generated javascript code always use "strict" mode.
- `"noUnusedLocals": false`: If set to `true`, the compiler will give warnings on unused **local**(like within functions) variables, stops compiling.
- `"noUnusedParameters": false`: If set to `true`, the compiler will give warnings on unused function **parameters**, stops compiling.
- `"noImplicitReturns": false`: If set to `true`, every path of a function is forced to have a `return` statement, otherwise it will be considered as errors.

### Debugging with Visual Studio Code

1. Install `Debugger for Chrome` extension in VS Code.
2. Enable `"sourceMap": true` option in `tsconfig.ts` file.
3. In your project, click debug and select "Chrome" as the environment.
4. In `.vscode/launch.json` file, make sure the `url` value points to the right local url for you local web server.
5. Set some break points, and click Start Debugging.

### Declaration Files

Use `declare module` to define type definitions for packages that do not come with built-in types. See details [here](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).