---
title: Web Front-end Notes - Modern CSS Layouts
description: Notes of modern CSS layouts
excerpt: Notes of modern CSS layouts
author: Frost He
date: 2019-11-03
lang: zh-CN
category:
- WebFrontend
tag:
- javascript
- css
- styles
---

## Flex Layout

Flex container properties, first candidate value is also the initial value:

- `flex-direction: row | row-reverse | column | column-reverse`: controls the main and cross axis direction
  - `row`: **Initial value**, main axis from left to right, cross axis from top to bottom.
  - `row-reverse`: main axis from right to left, cross axis from top to bottom.
  - `column`: main axis from top to bottom, cross axis from left to right.
  - `column-reverse`: main axis from bottom to top, cross axis from left to right.
- `flex-wrap: nowrap | wrap | wrap-reverse`:
  - `nowrap`: **Initial value**, all items will be placed in one row.
  - `wrap`: wrap items into multiple rows where there's not enough space for one row.
- `justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly`: controls how the items are aligned along the main axis.
  - `flex-start`: **Initial value**, stack all items to the start point of the main axis and give no space between them.
  - `flex-end`: stack all items to the end point of the main axis and give no space between them.
  - `space-between`: distributes flex items evenly in the main axis.
  - `space-around`: puts the same amount of space on both the left and the right side of each item.
  - `space-evenly`: distribute items and put always the same space between each item and the edge.
- `align-items: stretch | flex-start | flex-end | center | baseline`: controls how the items are aligned along the cross axis.
  - `stretch`: **Initial value**, stretch all items to the height of the highest item unless their individual height property is set.
  - `flex-start`: align all items to the start point of the cross axis.
  - `flex-end`: align all items to the end point of the cross axis.
  - `center`: align all items to the center of the cross axis.
  - `baseline`: align the text on each item along a line.
- `align-content: stretch | flex-start | flex-end | center | space-between | space-around`: controls how multiple rows align along the cross axis
  - `stretch`: **Initial value**, stretch all the rows(not visible) to the same height of the highest row.
  - `flex-start`: stack all the rows to the start point of the cross axis
  - `flex-end`: stack all the rows to the end point of the cross axis
  - `center`: center all the rows along the cross axis
  - `space-between`: distribute the rows along the across axis
  - `space-around`: same logic for `align-items` value.

Flex item properties:

- `align-self: auto | stretch | flex-start | flex-end | center | baseline`: overrides the `align-items` property for one individual item.
- `order: 0 | <integer>`: change the source order of each item. Lower order value gets closer to the start point of the main axis.
- `flex-grow: 0 | <integer>`: defines how the item grow, it only matters in relation to other numbers. If one item's `flex-grow` is set to 1(or other number other than 0) and the rest of items are set to 0, then this item will occupy all the remaining space as it can.
- `flex-shrink: 1 | <integer>`: value `1` means the item is allowed to shrink, while value `0` means not allow the item to shrink.
- `flex-basis: auto | <integer>`: specify a percentage of the width of one item in relation to other items, not using `width` property. However, even if we set the property to a specific value, it will shrink when the view port width is not enough to fit the width. To avoid that, we can set `flex-shrink` value to `0`.
- `flex: <flex-grow> <flex-shrink> <flex-basis>`: short-hand for the 3 properties.

### Tricks

- `display:flex` does not only works for container and items, but also works for text element. e.g, align a text in `span` element.
- `margin-right(left): auto` set to a flex item element will occupy as much space as it can adjacent to its previous or next element. It's a powerful trick to layout items in flex box.
- `-webkit-mask-image` and `-webkit-mask-size` helps to define a mask in CSS

---

## Grid Layout(TBD)

