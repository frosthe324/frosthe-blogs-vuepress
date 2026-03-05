---
title: Web Front-end Basics - Css/Css3
date: 2019-09-14 16:21:58
description: Fundamentals of Css/Css3
category:
  - WebFrontend
tag:
  - javascript
  - css
  - css-preprocessor
  - styles
---

- [3 Pillars of Writing Good HTML and CSS](#3-pillars-of-writing-good-html-and-css)
  - [Response Design](#response-design)
  - [Maintainable and Scalable Code](#maintainable-and-scalable-code)
  - [Web Performance](#web-performance)
- [How CSS works behind the scenes](#how-css-works-behind-the-scenes)
  - [Cascade(Resolving conflicting CSS declarations)](#cascaderesolving-conflicting-css-declarations)
  - [CSS Parsing Phases(Process final CSS values)](#css-parsing-phasesprocess-final-css-values)
    - [How CSS Engine Calculate Relative Units in Detail](#how-css-engine-calculate-relative-units-in-detail)
    - [CSS Inheritance](#css-inheritance)
  - [Visual Formating Model](#visual-formating-model)
    - [Dimensions of boxes: the box model](#dimensions-of-boxes-the-box-model)
    - [Box Type](#box-type)
    - [Positioning Schemes](#positioning-schemes)
    - [Stacking Contexts](#stacking-contexts)
- [Sass & NPM](#sass--npm)
  - [Sass & SCSS](#sass--scss)
    - [Nesting](#nesting)
    - [Mix-ins](#mix-ins)
    - [Functions](#functions)
    - [Extends](#extends)
  - [Install Sass Locally](#install-sass-locally)
  - [7-1 Pattern](#7-1-pattern)
- [SCSS/CSS Reminders](#scsscss-reminders)
  - [CSS Reminders](#css-reminders)
    - [Global Reset](#global-reset)
    - [box-sizing: border-box](#box-sizing-border-box)
    - [Selectors](#selectors)
    - [Pseudo Class/Elements](#pseudo-classelements)
    - [CSS Native Functions](#css-native-functions)
    - [How the clearfix come and Why we need it](#how-the-clearfix-come-and-why-we-need-it)
- [Browser Supports](#browser-supports)
- [Others](#others)

## 3 Pillars of Writing Good HTML and CSS

### Response Design

- Fluid layout:
  - Float Layout
  - Flex Box Layout
  - Grid Box Layout
- Media queries
- Responsive images
- Correct units
- Desktop-first vs. mobile-first

### Maintainable and Scalable Code

- Clean
- Easy-to-understand
- Growth
- Reusable
- How to organize files
- How to name classes
- How to structure HTML

### Web Performance

- Less HTTP requests
- Less code
- Compress code
- Use a CSS preprocessor
- Less images
- Compress images

---

## How CSS works behind the scenes

### Cascade(Resolving conflicting CSS declarations)

Cascade is the process of combining different stylesheets and resolving conflicts between different CSS rules and declarations when more than one rule applies to a certain element.

CSS styles can come from different sources:

- Author: writen by developers
- User: customized by user, like font-size and font-family
- Browser(user agent): browsers have default styles for some certain elements.

How does the cascade resolve conflicts of different sources? It goes from 1-3 phases and each of them takes some aspects for precedence.

1. First, decide `Importance`:
   1. User `!important` declarations
   2. Author `!important` declarations
   3. Author declarations
   4. User declarations
   5. Default browser declarations
2. If `Importance` is a tie, consider `Specificity`:
   1. Inline styles: writen in HTML
   2. IDs
   3. Classes, pseudo-classes, attribute
   4. Element, pseudo-elements
3. If `Specificity` is also a tie, consider `Source Order`: The last declaration in the code will override all other declarations and will be applied.

To summarize:

- CSS declarations marked with `!important` have the highest priority;
- But, only use `!important` as a last resource. It's better to use correct specificities
- Inline styles will always have priority over styles in external stylesheets;
- A selector that contains 1 `ID` is more specific than one with 1000 `classes`;
- A selector that contains 1 `class` is more specific than one with 1000 `elements`;
- The universal select `*` has no specificity value (0, 0, 0, 0);
- Rely more on `Specificity` than on the `order` of selectors;
- But, rely on order when using 3rd-party stylesheets - always put your author stylesheets last.

### CSS Parsing Phases(Process final CSS values)

1. Declared value(author declarations): Gathering all declaration values for a single CSS property.
   1. For `font-size`, browsers usually have a default value of 16 pixels. This is the `user-agent` declaration, not a CSS `initial value`.
2. Cascaded value(after the cascade): Determine a final value that will take precedence.
3. Specified value(defaulting if there is no cascaded value): In each element of the page, every CSS property needs to have value even if there's no declaration at all. Each CSS property has something called an `inital value`.
4. Computed value(converting relative values to absolute):Value with relative units like **rem**, **em** are computed to pixels, and CSS key words like **orange**, **oral**, **boulder** will be computed and replaced here in this step.
   1. `rem` is calculated in this step by multiplying `16`. `rem` is **always relative to the root font-size**.
   2. Some properties like the ones related to text, such as font-size inherit the computed value of their parent elements.
5. Used value(final calculations, based on layout): The css engines uses the rendered layout to figure out some of the remaining values like **percentage** values that depend on the layout. Because percentage value is in relation to its parent element and the parser needs to know that width in order to calculate a pixel width.
6. Actual value(browser and device restrictions): Browsers usually cannot really display like `184.8` pixels, a value with a comma is simply rounded.

#### How CSS Engine Calculate Relative Units in Detail

Percentage-based units:

- `%(fonts)`: Percentage on fonts are explained by `x% * parent's computed font-size`
- `%(lengths)`: Percentage on lengths(such as width, height, padding, margin) always reference their parent's computed **width** property value. `x% * parent's computed width`

Font-based units:

- `em(font)`: For fonts, use the **parent** element as the reference. `x * parent computed font-size`
- `em(lengths)`: For lengths, use the **current** element as the reference. `x * current element computed font-size`
- `rem`: Works the same way for both fonts and length. Uses the root font-size as the reference. `x * root element computed font-size`. Root font-size is defined in `HTML` element.

> By changing font-sizes, we will automatically change length since it depend on a font-size and that gives us a lot of flexibility.

Viewport-based units:

- `vh`: Percentage of viewport **height**. `x * 1% of viewport height`.
- `vw`: Percentage of viewport **width**. `x * 1% of viewport width`.

#### CSS Inheritance

- Inheritance passes the values for some specific properties from parents to children - more maintainable code
- Properties related to text are inherited: `font-family`, `font-size`, `color`, etc;
- The **computed value** of a property is what gets inherited, **NOT** the declared value.
- Inheritance of a property only works if no one declares a value for that property.
- The `inherit` keyword forces inheritance on a certain property.
- The `initial` keyword forces to reset a property to its initial value.

### Visual Formating Model

**Visual Formating Model** is an algorithm that calculates boxes and determines the layout of these boxes, for each element in the render tree, in order to determine the final layout of the page.

#### Dimensions of boxes: the box model

- Content: text, image, etc;
- Padding: transparent area around the content, inside of the box;
- Border: goes around the padding and the content;
- Margin: space between boes;
- Fill area: area that gets filled with background color or background image. The fill area does not include **Margin**.

For a default block level box, the visual formating model calculates:

- total width = right border + right padding + specified width + left padding + left border
- total height = top border + top padding + specified height + bottom padding + bottom border
  To fix this problem, we use `box-sizing: border-box` property for box level boxes.

#### Box Type

The type of a box is always defined by `display` property. Usually by specifying `display: block`, but

- `display: flex`
- `display: list-item`
- `display: table`

also produce block-level boxes; Elements such as `<p>`, `<div>` which are usually formatted visually as blocks have their `display` property set to `block` by default. Box level elements will occupy as much as possible of their parent element like 100% width and create line breaks after and before it.

Inline elements(like `<span>`, `<img>`) which have `display: inline` by default only occupy the space that its **content** actually needs. They don't create line breaks before or after them. Inline elements work a bit different:

1. `width` and `height` properties **DO NOT** apply, meaning we are not able to use these properties for inline elements.
2. We can only specify horizontal(left and right) `padding` and `margin` on inline elements.

Inline block boxes(`display: inline-block`) is there to apply block level box modelling to inline elements.

#### Positioning Schemes

- Normal flow:
  - Default positioning scheme;
  - **NOT** floated;
  - **NOT** absolutely positioned;
  - Elements laid out according to their source order;
  - `position: relative`
- Floats:
  - **Element is removed from the normal flow;**
  - Text and inline elements will wrap around the floated element;
  - The container will not adjust its height to the element;
  - `float: left/right`;
- Absolute positioning:
  - **Element is removed from the normal flow;**
  - No impact on surrounding content or elements, they can even overlap them
  - We use `top`, `bottom`, `left` and `right` to offset the element from its relatively positioned container;
  - `position: absolute/fixed`

#### Stacking Contexts

Stacking contexts are what determine in which order elements are rendered on the page. With `z-index`, `opacity` and `transform` properties they will create new stacking contexts.

---

## Sass & NPM

Sass is CSS preprocessor.

> Sass Source Code -> Compiled CSS Code

Sass provides:

- `Variables`: for reusable values such as colors, font-size, spacing, etc;
- `Nesting`: to nest selectors inside of one another, allowing us to write less code;
- `Operations`: for mathematical operations right inside of CSS;
- `Partials and imports`: to write CSS in different files and importing them all into one single file;
- `Mixins`: to write reusable pieces of CSS code;
- `Functions`: similar to mixins, with difference that they produce a value that can be used later;
- `Extends`: to make different selectors inherit declarations that are common to all of them;
- `Control directives`: for writing complex code using conditionals and loops;

### Sass & SCSS

SCSS stands for Sassy CSS. Sass is indentation sensitive and doesn't use any curly braces and semicolons.

#### Nesting

```scss
// SCSS
.navigation {
  list-style: none;

  li {
    display: inline-block;
    margin-left: 30px;

    &:first-child {
      margin: 0;
    }
  }
}

// CSS
.navigation li:first-child {
  margin: 0;
}
```

The `&` basically writes out the selector at this current point here.

#### Mix-ins

Mix-ins are a bunch of codes that can be applied in many places. Typically, a `mix-in` looks like below:

```scss
@mixin clearfix {
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}

// use the mix-in
@include clearfix;
```

We could also pass arguments to a `mix-in`:

```scss
// declare min-xins
@mixin style-link-text($color) {
  text-decoration: none;
  text-transform: uppercase;
  color: $color;
}
// use mixins
@include style-link-text(#eee);
```

#### Functions

```scss
// declare functions
@function divide($a, $b) {
  @return $a / $b;
}
// use functions
margin: divide(60, 2) * 1px; // 30px
```

#### Extends

Bascially we write a placeholder and put a bunch of styles in there, then have other selectors extend that placeholder.

### Install Sass Locally

```bash
$ npm install node-sass --save-dev
```

### 7-1 Pattern

7 different folders for partial Sass files:

- `base/`: basic product definitions
- `components/`: 1 file for each component
- `layout/`: define the overall layout of the project
- `pages/`: styles for specific pages of the project
- `themes/`: to implement different visual themes
- `abstracts/`: code that doesn't output any CSS such as variables or mix-ins.
- `vendors/`: where all 3rd-party CSS goes

and 1 main Sass file to import all other files into a compiled CSS stylesheet.

> SCSS uses `@import` to import partial SCSS files, SCSS files named with `_` prefix are by convention recognised as partial SCSS files by SCSS compiler

---

## SCSS/CSS Reminders

### CSS Reminders

#### Global Reset

By default, browsers apply a certain `margin`, or `padding` to some elements like `<h1>`. We don't want that, so we usually have a `global reset` declaration, like:

```CSS
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
}
```

#### box-sizing: border-box

`box-sizing: border-box` is to change the box model so that the borders and the paddings are no longer added to the total width or height that we specify for a box. If you set an element's width to 100 pixels, that 100 pixels will include any border or padding you added, and the content box will shrink to absorb that extra width. This typically makes it much easier to size elements. By default the `box-sizing` property is not inherited, we can specify `box-sizing: inherit` in `*` selector to make better practice.

#### Selectors

**Atrribute Selector** `[class^="col-"]` means to select all elements where they have a class name starting with `col-`, there are also `*` and `$` symbols:

- `[{attribute}^="{value}"]` means to select elements which have `attribute` **start with** `value`.
- `[{attribute}*="{value}"]` means to select elements which have `attribute` **contains** `value`.
- `[{attribute}$="{value}"]` means to select elements which have `attribute` **end with** `value`.

**Sibling Selectors** is used to select elements adjusent to the element, we have:

- `div + p`: to select `p` element which is exact next to the `div` element.
- `div ~ p`: to select all `p` elements that are sibling of the `div` element.

#### Pseudo Class/Elements

Pseudo classes are special states of a selector. We use pseudo classes to select elements under a special condition. Pseudo elements with 2 `:` are elements that are actually on the web page.

- `::before`/`::after` pseudo element creates a pseudo-element that is the first/last child of the selected element. By using this we can fully control what to render in CSS instead of declaring elements in HTML.
- `::-webkit-input-placeholder` pseudo element is used to select the inputs' placeholder element. This class only works on Safari and Chrome currently.
- `:placeholder-shown` is the pseudo class to select a the state where the placeholder is shown.
- `:not(:last-child)` pseudo selector means to choose all elements except `:last-child`.
- `:checked` pseudo class is helpful for `radio` and `checkbox` element select the state when they are checked.
- `::selection` pseudo class is to select text that are selected by the cursor.

#### CSS Native Functions

- `calc` function can mix units. Different from `SASS`, it's evaluated during the webpage is rendered, which means it depends on the layout. To use a `SASS` variable, we need to wrap the variable with `#{}`. e.g, `calc((100% - #{$gutter-horizontal}))`

#### How the clearfix come and Why we need it

Since there are 3 different kinds of positioning, the `normal flow`, `floats`, and `absolute positioning`. `floats` and `absolute positioning` will take the element out of the natural flow. If all children elements are taken out of the natural flow, the parent element's width will collapse. To fix it, we have different solutions for `floats` and `absolute positioning`.

For `floats`, we can add a `clearfix` to `::after` pseudo element:

```css
&::after {
  content: "",
  clear: both,
  display: table;
}
```

Which means to append a child element with empty content and clear it for both sides.

For `absolute positioning`, we can not use the `clearfix` as we use for `floats`, what we can do is to add a same height of the tallest child element to make it work.

---

## Browser Supports

Feature query:

```css
@supports (-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px)) {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba($color-black, 0.3);
}
```

Use [Can I Use](https://caniuse.com) to check how a property is supported in different browsers.

---

## Others

- `line-height: 1.7` means 1.7 times bigger than the predefined line height.
- `height: 95vh`: `vh` means viewport height, at every point the height of this element should be 95% of the viewport height.
- `background-size: cover;` means whatever the width or height of the element is, it'll always try to fit.
- `object-fit: cover;` is to tell the element to fill the entire parent while still maintaining its aspect ratio. Unlike `background-size: cover`, this property works with HTML elements instead of just background images.
- `<img/>` is an in-line element by default. `alt` attribute is the description for SEO(search engine optimization). Also in case the image failed to load, the text will appear.
- only `background-image` property can be applied with `linear-gradient()`, not `background-color`. And `background-size: cover;` is to fit the content to the element's width and height. `background-size` also accepts values like `100%`, `25%` and `150%`, `100%` has the same effect with `cover` value;
- `background-blend-mode` describes how the element's background image should blend. We could specify a linear gradient and a background image together to `background-image` property, which looks like `background-image: linear-gradient(...) url(...);`. This is often useful to blend multiple background stuff while `<img>` can be applied only one element.
- `background-image: linear-gradient()` has further more functionality like gradient point, we can specify something like `background-image: linear-gradient( 105deg, rgba($color-white, 0.9) 0%, rgba($color-white, 0.9) 50%, transparent 50%, transparent 100% ), url(../img/nat-10.jpg);` to make a skewed splitter effect.
- `overflow` property tells what to do when the content is too big to fit in its block formating context. The `margin-top` pushes the outer element down, set `overflow:auto` to fix it. See [here](https://stackoverflow.com/questions/1394724/css-margin-top-when-parents-got-no-border). This is something called margin collapse, only happens to vertical margins.
- `position: absolute` needs to have a reference, the reference is the first element with the relative position that it can find. To make it easier, we often explicit specify the parent element `position: relative;` property. When an element is specified `position: absolute`, the width will fit its content, a `width: 100%` is often following the absolute positioning.
- `top: 40px` and `left: 40px` are in relation to the parent element.
- `transform: translate()` is in relation to the element itself.
- `<h1></h1>` is a single important to search engines to capture the website's title.
- `bakcface-visibility`: determines the back part of an element when we transform it is visible or hidden for the user. It can be used to fix animation shaking at some point.
- `display:inline-block` applies box model to inline elements, this will allow paddings, width or height to take the space as it worked as a block.
- `text-align: center;` is perfect for centralizing `inline` or `inline-block` elements for they are treated as texts. Sometimes, we need to wrap a `inline` element and give the wrapper parent element a utility class like `u-center-text` to center the child inline element.
- `margin: 0 auto;` is widely used to center block elements inside of another block element.
- Use `position: absolute; top:50%; left: 50%;` to vertically and horizontally center a block box within a block box.
- Use `transition` property to quickly apply animations between pseudo classes.
- `animation-fill-mode: backwards` is to keep the element state the same as the effect specifies before animation starts.
- `lorem` in vs code just enter some random text.
- Use percentage unit for images for responsive design purpose.
- We can use `outline-offset` property to give space between the element and outline, which makes outline different from `border` property.
- `.feature-box > *` means to select all the direct children of `.feature-box`. `>` is a selector that only picks direct child.
- `clip-path` property in Google Chrome would break the `overflow` property. This can be fixed by manually setting the `border-radius` property.
- In HTML5, we have `<figure>` element we can put an image and some caption with a `<figcaption>` element
- `shape-outside` property is to define a vectorized shape of the element. It is effective only when the element's width and height is set and floated.
- The best to move around with floated element is not mess with `margin` or `left` but using `transform: translate()`
- `opacity` to 0 just keep the element to be invisible, but the element still remains on the page. While `visibility: hidden` will move away the element. The reason why we set both of them sometimes is that we can not animate on `visibility` while we can for `opacity`.
- `display: table` and `display: table-cell` is used to make a elements like table cells in a table in order to use properties like `vertical-align: middle`
- `:target` pseudo class is triigered when a link is to trigger a target anchor. Then the element of that id becomes the anchor and the target.
- `input` elements DO NOT automatically inherit text-related properties like `font-family`, `font-size` and `color`, we need to explicitly specify thoese properties to `inherit` or other value we want.
- `transition` property receives multiple property settings seperated by `,`, e.g. `transition: transform .2s, width .4s .2s;` means `transform` property transition takes 0.2 seconds and with 0.2 seconds delay, `width` property transition begins and takes 0.4 seconds.
- `z-index` property only works with a specified `position` property
- `fill: currentColor` just references the current element or parent element's color.
