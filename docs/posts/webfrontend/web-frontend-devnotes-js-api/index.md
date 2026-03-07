---
title: Web Front-end Basics - Javascript API
description: Javascript API Handbook
excerpt: Javascript API Handbook
author: Frost He
date: 2019-12-22
lang: zh-CN
category:
- WebFrontend
tag:
- javascript
- modern-javascript
---

## Object API

- `Object.entries()` returns an array of a given object's own enumerable string-keyed property `[key, value]` pairs.
- `Object.fromEntries()` method transforms a list of key-value pairs into an object.
- `Object.prototype.valueOf()` method returns the primitive value of the specified object. The operator `+`, `-`, `*`, `/` with objects are acutally calling the `valueOf()` method under the hood to first convert objects into primitive values.

### Property Descriptor

- value: current value of the property
- writable: boolean, decides whether the property can be assigned with a new value.
- enumerable: boolean, whether this property will show up in enumerations like `for in` loop or `for of` loop or `Object.keys`, `Object.assign()` etc.
- configurable: boolean, whether it is allowed to change the property descriptor such as to change the value of `writable` and `enumerable` settings.

Using `Object.defineProperty(myObj, 'myProp', {})` gets a default property descriptor of:

```javascript
{
    value: undefined,
    writable: true,
    enumerable: false,
    configurable: false
}
```

---

## Web APIs

`eval()`: evaluates JavaScript code represented as a string.

### Location Interface

`window.location` or `document.location` refers to the same interface.

- `location.href` represents the current url, it navigates to the new page if changed.
- `location = "https://foo.bar"` is equal to `location.href = "https://foo.bar"` and is equal to `location.assign("https://foo.bar")`
- `location.pathname` a USV string presents the path of the URL containing `'/'`.
- `location.search` a USV string represents the query string params containing `'?'`. 
  - [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) defines the interface for the parameters.
  - [URL.searchParams](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) returns a `URLSearchParams` object allowing access to the GET decoded query arguments contained in the URL.
- `location.hash` a USV string represents the fragment identifier of the URL containing `'#'`.
- `location.replace()` will not be saved in session history, meaning the user won't be able to use the *back* button to navigate it.
- `location.toString()` returns a USV string containing the whole URL.
- `location.reload(forceReload?: boolean)`: reloads the current URL, true to always load it from server.

### Working with the History API

- `history.state` returns an `any` value representing the state at the top of the history stack.
- `history.back()`
- `history.forward()`
- `history.go(n: number)`: 
- `history.pushState(state: any, title?: string, URL?: string)`: pushes the given data onto the session history stack
  - `state`: any Javasvript object that can be serialized, associated with the new history entry.
  - `title`: 
  - `URL`: The new history entry's URL, can be relative or absolute. The new URL must be of the same origin as the current URL, otherwise `pushState()` will throw an exception. The browser won't attempt to load this URL after a call to `pushState()`
  - `pushState()` never causes a `hashchange` event to be fired, even if the new URL differs from the old URL only in its hash.
- `history.replaceState()`: updates the most recent entry on the history stack, it operates exactly like `history.pushState()`, except that replaceState() modifies the current history entry instead of creating a new one.

A `popstate` event is dispatched to the window every time the active history entry changes between two history entries for the same document.. If the history entry being activated was created by a call to `pushState()` or affected by a call to `replaceState()`, the `popstate` event's `state` property contains a copy of the history entry's state object.