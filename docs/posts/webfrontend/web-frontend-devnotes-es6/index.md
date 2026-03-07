---
title: Web Front-end Basics - ES6
date: 2019-08-16 09:21:58
description: Points of ES6
excerpt: Points of ES6
category:
  - WebFrontend
tag:
  - javascript
  - es
---

## let & const

Variables declared with `var` are function-scoped while those declared with `let/const` are block-scoped.

> ES6 does not perform type check, which means a value of type `number` can be assigned to a variable of original type `string`, even if using `let` in ES6.

---

## blcoks & IIFEs

A block:

```javascript
{
  const a = 1;
  let b = 2;
}
console.log(a, b); // error because a and b are not defined.
```

---

## Strings in ES6 / ES2015

```javascript
let firstName = 'John';
let lastName = 'Smith';
const yearOfBirth = 1990;
// ES5:
let outputStr = 'This is ' + firstName + ' ' + lastName + '. He was born in ' + yearOfBirth.
// ES6:
let outputStr = `This is ${firstName} ${lastName}. He was born in ${yearOfBirth}.`;
```

New methods included in string objects:

```javascript
const n = "John Smith";
let result = n.startWith("J");
let result = n.endWith("Sm");
let result = n.includes(" ");
let result = n.repeat(5);
```

---

## Arrorw Functions

Compared with traditional declared functions, Arrow functions **DO NOT** have their own `this` keyword, when accessing `this` keyword in arrow functions, it references its parent function(s)' `this` keyword. This is called lexical `this` keyword.

Arrow functions basics:

```javascript
const years = [1990, 1965, 1982, 1937];

// ES5
var ages5 = years.map(function (el) {
  return 2016 - el;
});

// ES6
let ages6 = years.map((el) => 2016 - el);
// multiple parameters
ages6 = year.map((el, index) => `Age element ${index + 1}: ${2016 - el}.`);
// multiple lines
ages6 = year.map((el, index) => {
  const now = new Date().getFullYear();
  const age = now - el;
  return `Age element ${index + 1}: ${2016 - el}.`;
});
```

```javascript
// ES5
var box5 = {
  color: "green",
  position: 1,
  clickMe: function () {
    var self = this;
    document.querySelector(".green").addEventListener("click", function () {
      var str =
        "This is box number " + self.position + " and it is " + self.color;
      alert(str);
    });
  },
};
box5.clickMe();

// ES6
const box6 = {
  color: "green",
  position: 1,
  clickMe: function () {
    document.querySelector(".green").addEventListener("click", () => {
      let str =
        "This is box number " + this.position + " and it is " + this.color;
      alert(str);
    });
  },
};
box6.clickMe();
```

---

## Destructuring

```javascript
// ES5
var john = ["John", 26];
var name = john[0];
var age = john[1];

// ES6
// arrays
const [name, age] = ["John", 26];
// objects
const obj = {
  firstName: "John",
  lastName: "Smith",
};
const { firstName, lastName } = obj;
// give different variable names
const { firstName: a, lastName: b } = obj;

// use destructuring to receive multiple values.
function calcAgeRetirement(year) {
  const age = new Date().getFullYear() - year;
  return [age, 65 - age];
}
const [age, retirement] = calcAgeRetirement(1990);
```

---

## Arrays in ES6 / ES2016

```javascript
// Array.from method.
const boxes = document.querySelectorAll(".box");
Array.from(boxes).forEach((cur) => (cur.style.backgroundColor = "dodgerblue"));

// findIndex & find
var ages = [12, 17, 8, 21, 14, 11];
ages.findIndex((el) => el >= 18);
ages.find((el) => el >= 18);

// for of loop
for (const cur of boxesArr6) {
  // ...
}
```

---

## The Spread Operator

`...` is the spread operator.

```javascript
function addFourAges(a, b, c, d) {
  return a + b + c + d;
}

var sum1 = addFourAges(18, 30, 12, 21);

//ES5
var ages = [18, 30, 12, 21];
var sum2 = addFourAges.apply(null, ages);

//ES6
const sum3 = addFourAges(...ages);

// merge arrays
const familySmith = ["John", "Jane", "Mark"];
const familyMiller = ["Mary", "Bob", "Ann"];
const bigFamily = [...familySmith, "Lily", ...familyMiller];

// works on node list
const h = document.querySelector("h1");
const boxes = document.querySelectorAll(".box");
const all = [h, ...boxes];

Array.from(all).forEach((cur) => (cur.style.color = "purple"));
```

---

## Maps

A map is new key-value data structure in ES6, we can uses anything as keys instead of strings for objects.

```javascript
const question = new Map();
question.set(
  "question",
  "What is the official name of the latest major javascript version?"
);
question.set(1, "ES5");
question.set(2, "ES6");
question.set(3, "ES2015");
question.set(4, "ES7");
question.set("correct", 3);
question.set(true, "Correct answer:D");
question.set(false, "Wrong, please try again!");

question.get("question");
question.size;

if (question.has(4)) {
  question.delete(4);
}

question.clear();

for (let [key, value] of question.entries()) {
  // ...
}
```

---

## Classes & Inheritance

Class is a sugar sytax that still uses prototype under the hood. A class declaration has to include a `constuctor` method.

```javascript
// ES5
var Person5 = function (name, yearOfBirth, job) {
  this.name = name;
  this.yearOfBirth = yearOfBirth;
  this.job = job;
};
Person5.prototype.calculateAge = function () {
  var age = new Date().getFullYear() - this.yearOfBirth;
  console.log(age);
};

// ES6
class Person6 {
  constructor(name, yearOfBirth, job) {
    this.name = name;
    this.yearOfBirth = yearOfBirth;
    this.job = job;
  }

  calculateAge() {
    let age = new Date().getFullYear() - this.yearOfBirth;
    console.log(age);
  }
}

const john6 = new Person("John", "1990", "teacher");
```

### Static methods

Static method in ES6 is actually a function attached to the class function object itself.

```javascript
// ES5
function Person5() {
  // ...
}
Person5.greetings = function () {
  console.log("Hello there!");
};

// ES6
class Person6 {
  constructor() {}
  static greetings() {
    console.log("Hello there!");
  }
}
```

We can only add **Static Methods** to classes but **NOT Static Properties**. Anyways adding a property to a function object in ES5 is not a best practice.

### Subclasses

Sub classes using prototype is kind of tricky like below.

```javascript
//ES5
var Person5 = function (name, yearOfBirth, job) {
  this.name = name;
  //...
};
// add a method to the prototype
Person5.prototype.calculateAge = function () {
  var age = new Date().getFullYear() - this.yearOfBirth;
};
// inheritance begins
var Athlete5 = function (name, yearOfBirth, job, olymicGames, medals) {
  // We don't use `new` keyword here because constructing Athelete5 object will use `new` keyword, while `new` keyword will create an empty object and calls the function constructor of Athelete5 and set `this` keyword to the newly created empty object.
  Person5.call(this, name, yearOfBirth, job);
  this.olymicGames = olymicGames;
  this.medals = medals;
};
// use object.create() to create a new object with the prototype same as Person5, and assign it to prototyoe of Athelete5. That's the way how inherited classes' prototype gets correctly connected to super classes' prototype.
Athlete5.prototype = Object.create(Person5.prototype);

Athlete5.prototype.wonMedal = function () {
  this.medals++;
  console.log(this.medals);
};

var johnAthlete5 = new Athlete5("John", 1990, "swimmer", 3, 10);
johnAthlete5.calculateAge();
johnAthlete5.wonMedal();
```

Inheritance in ES6 is way easier to do:

```javascript
class Person6 {
  constructor(name, yearOfBirth, job) {
    this.name = name;
    //...
  }
  calculateAge() {
    //...
  }
}
class Athelete6 extends Person6 {
  constructor(name, yearOfBirth, job, olympicGames, medals) {
    super(name, yearOfBirth, job);
    this.olympicGames = olympicGames;
    this.medals = medals;
  }
  wonMedal() {
    //...
  }
}
const johnAthlete6 = new Athlete5("John", 1990, "swimmer", 3, 10);
johnAthlete6.calculateAge();
johnAthlete6.wonMedal();
```

> Sub class constructor functions need to always first call `super()` method.

---

## Asynchronous Javascript & Promises

WEB APIs live outside of the javascript engine. They are apis provideded by Javascript runtime.

- setTimeout()
- DOM events
- XMLHttpRequest()
- ...

### Promise

A promise is:

- An object that keeps track about whether a certain event has happened already or not.
- Determines what happens after the event has happened.
- Implements the concept of a future value that we're expecting.

```javascript
// produce a Promise
const getIds = new Promise((resolve, reject) => {
  setTimeout(() => {
    // mark the promise as `Fulfilled` and return the given data
    resolve([523, 883, 432, 974]);
  }, 1500);
});
// consume a Promise
getIds
  .then((IDs) => {
    // correspond to `fulfilled`
    //...
    return new Promise((resolve, reject) => {});
  })
  .then((recipe) => {
    console.log(recipe);
  })
  .catch((error) => {
    // correspond to `reject`
    //...
  });
```

Core promises methods from `bluebird`:

- `Promise.promisify`: Wrap an `Async` method for the given function to that object.
- `Promise.promisifyAll`: Wrap `Async` methods for all functions to the given object.
- `Promise.fromCallback`: Returns a promise that is resolved by a node style callback funnction.
- `Promise.resolve`: Create a promise that is resolved with the given value.
- `Promise.reject`: Create a promise that is rejected with the given `error`.
- `.catch`: A catch-all variant similar to `catch(e) {}` block. A filtered variant that lets you only handle specific errors. This one is usually preferable.
- `.error`: Like `.catch` but instead of catching all types of exceptions, it only catches operational errors.

Reference [here](http://bluebirdjs.com/docs/api-reference.html) for more details.

### Async/Await

Async/Await was introduced in ES8 / ES2017. They are mainly for consuming promises.

```javascript
async function getRecipesAW() {
  const IDs = await getIDs();
  const recipe = await getRecipe(IDs[2]);
  const related = await getRelated("John");
}
```

`async function` always runs on the background, `await` keyword will stop the execution until the promise is marked as `Fulfilled`. For `Rejected` state we need to surround a catch block. Async function always return a Promise.

---

## ES6 Modules

### Exports

- `export` can be followed up with expressions of any type in javascript.
- Default Export: works when you only want to export one thing from a module. The sytax is `export default`.
- Named Export: works when you want to export multiple things from one module. When importing things from such a module, we need to use `{ }` with the exact names(or use `as {alias}`) of that exported in the module. For example: `import { add, multiply } from '...'`
- Import everything: `import * as searchView from '...'`

## Misc Notes

- `element.insertAdjacentHTML()` see more [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML).
- `element.closest()`, see more [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest).
- `data-{customize}` attributes allows to store customized data in HTML5 element, and it will wrap the `{customize}` as a property of `element.dataset`, thus access it by using `element.dataset.customize`. See more [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset)
- TypeScript uses declaration files to understand the types and function signatures of a module. To take advantage of Typescript's static type checker. We'll need to start adding type annotations to our code, including code from 3rd-party npm modules.
- use `multipart/form-data` when your form includes any `<input type="file">` elements, otherwise you can use `multipart/form-data` or `application/x-www-form-urlencoded` but `application/x-www-form-urlencoded` will be more efficient