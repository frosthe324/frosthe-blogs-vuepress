---
title: Web Front-end Notes - Css tricks
date: 2019-11-03 18:21:58
description: Notes of Css tricks
category:
  - WebFrontend
tag:
  - javascript
  - css
  - styles
---

- [SASS variables vs. Custom CSS properties](#sass-variables-vs-custom-css-properties)
  - [Icon Fonts vs. Svg Icons](#icon-fonts-vs-svg-icons)
- [Normal Document Flow](#normal-document-flow)
- [Block Formatting Context](#block-formatting-context)
- [Inline Formatting Context](#inline-formatting-context)
- [Display property](#display-property)
- [In-flow and out-of-flow](#in-flow-and-out-of-flow)
  - [Explicitly creating a BFC using display: flow-root](#explicitly-creating-a-bfc-using-display-flow-root)
- [Margin Collapse](#margin-collapse)

---

## SASS variables vs. Custom CSS properties

With Custom CSS properties, we have the following advantages over SASS variables:

- No need for CSS pre-processors when only using SASS for variables
- Custom CSS properties can be munipulated in Javascript
- Custom CSS properties can be edited in DevTools
- Custom CSS properties cascade and they are inherited

Custom CSS properties have to be defined inside a scope, then they are available to that element and its children. We usually define a custom CSS property in `:root` pseudo class:

```css
:root {
  --color-primary: red;
}

body {
  background-color: var(--color-primary);
}
```

`:root` is basically the same with `HTML` selector but with a higher specificity, custom properties defined here can be available to all HTML elements and its children. We use `var()` to resolve the property.

### Icon Fonts vs. Svg Icons

```css
<svg class="search__icon">
    <use xlink:href="img/sprite.svg#icon-magnifying-glass"></use>
</svg>
```

> `<use xlink:href>` only works on a web server.

---

## Normal Document Flow

- Any boxes in normal flow will be part of a formatting context.

---

## Block Formatting Context

In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block. The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context collapse.

In a block formatting context, each box's left outer edge touches the left edge of the containing block (for right-to-left formatting, right edges touch).

---

## Inline Formatting Context

In an inline formatting context, boxes are laid out horizontally, one after the other, beginning at the top of a containing block. Horizontal margins, borders, and padding are respected between these boxes. The boxes may be aligned vertically in different ways: their bottoms or tops may be aligned, or the baselines of text within them may be aligned. The rectangular area that contains the boxes that form a line is called a line box.

- Boxes around words before the `<strong>` element and after the `<strong>` element are referred to as anonymous boxes, boxes introduced to ensure that everything is wrapped in a box, but ones that we cannot target directly.
- The line box the height is defined by the tallest box inside it.

---

## Display property

The display type of an element defines the outer display type; this dictates how the box displays alongside other elements in the same formatting context. It also defines the inner display type, which dictates how boxes inside this element behave. We can see this very clearly when considering a flex layout.

Therefore you can think of every box in CSS working in this way. The box itself has an outer display type, so it knows how to behave alongside other boxes. It then has an inner display type which changes the way its children behave. Those children then have an outer and inner display type too. This concept of the outer and inner display type is important as this tells us that a container using a layout method such as Flexbox (`display: flex`) and Grid Layout (`display: grid`) is still participating in block and inline layout, due to the outer display type of those methods being `block`.

---

## In-flow and out-of-flow

Browsers display items as part of a block or inline formatting context in terms of what normally makes sense for that element.

An element is called out of flow if it is

- floated
- absolutely positioned(including `position: fixed`)
- or is the root element.

Out of flow items create a new Block Formatting Context (BFC) and therefore everything inside them can be seen as a mini layout, separate from the rest of the page. The root element therefore is out of flow, as the container for everything in our document, and establishes the Block Formatting Context for the document.

A new BFC is created in the following situations:

- elements made to float using `float`
- absolutely positioned elements (including `position: fixed` or `position: sticky`)
- elements with `display: inline-block`
- table cells or elements with `display: table-cell`, including anonymous table cells created when using the `display: table-*` properties
- table captions or elements with `display: table-caption`
- block elements where `overflow` has a value other than `visible`
- elements with `display: flow-root` or `display: flow-root list-item`
- elements with `contain: layout`, `content`, or `strict`
- flex items
- grid items
- multicol containers
- elements with `column-span` set to all

> `float` and `clear` only apply to items inside the same formatting context, and margins only collapse between elements in the same formatting context.

### Explicitly creating a BFC using display: flow-root

Using `display: flow-root` (or `display: flow-root list-item`) on the containing block will create a new BFC without any other potentially problematic side-effects.

---

## Margin Collapse

If you have an element with a top margin immediately after an element with a bottom margin, rather than the total space being the sum of these two margins, the margin collapses, and so will essentially become as large as the larger of the two margins.

Margin collapsing occurs in 3 basic cases:

1. Adjacent siblings:
2. No content separating parent and descendants: The collapsed margin ends up outside the parent.
3. Empty blocks:
