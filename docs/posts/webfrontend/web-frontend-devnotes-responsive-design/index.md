---
title: Web Front-end Basics - Responsive Design
description: Notes of responsive design
excerpt: Notes of responsive design
author: Frost He
date: 2019-10-21
lang: zh-CN
category:
- WebFrontend
tag:
- responsive-design
- css
- styles
---

## Responsive Design Stategies - Desktop-first or Mobile-first

![Responsive design strategies overview](./responsive-design-stategies-overview.png)

### Mobile-first Pros & Cons

PROS：

- 100% optimized for mobile experience;
- Reduces websites and apps to the absolute essentials;
- Results in smaller, faster and more efficient products;
- Prioritizes content over aesthetic design, which may be desirable

CONS:

- The desktop version might feel overly empty and simplistic;
- More difficult and counterintuitive to desktop;
- Less creative freedom, making it more difficult to create distinctive products;
- Clients are used to see a desktop version of the site as a prototype;
- Do your users even use the mobile internet? What's the purpose of your website?

---

## Media Queries

### Selecting breakpoints

There are 3 ways to identify these breakpoints:

- The bad way: Take apple devices as the reference and give out breakpoints.
- The good way: Group most popular devices and give breakpoints.
- The perfect way: Content driven, add new breakpoint whenever the content start to look werid.

According to stats from 2017, usualy we need

- 1 breakpoint for mobile phones(< 600px)
- 1 for portrait tablets(600px - 900px)
- 1 for landscape tablets(900px - 1200px)
- 1 for desktop(1200px - 1800px)
- 1 for big desktop(1800px +)

### Use media query together with mix-ins

Take advantage of SCSS mixin and `content` directive makes it easier for media queries.

```scss
// MEDIA QUERY MANAGER
/*
0 - 600px: 			Phone
600px - 900px: 		Tablet portrait
900px - 1200px: 	Tablet landscape
[1200px - 1800px]: 	is where our normal style apply
1800px +: 			Big desktop

$breakpoint argument choices:
- phone
- tab-port
- tab-land
- big-desktop

1em = 16px
*/
@mixin respond($breakpoint) {
  @if $breakpoint == phone {
    @media only screen and (max-width: 37.5em) {
      @content;
    } // 600px
  }
  @if $breakpoint == tab-port {
    @media only screen and (max-width: 56.25em), only screen and (hover: none) {
      @content;
    } // 900px
  }
  @if $breakpoint == tab-land {
    @media (max-width: 75em) {
      @content;
    } // 1200px
  }
  @if $breakpoint == big-desktop {
    @media (min-width: 112.5em) {
      @content;
    } // 1800px
  }
}

@include respond(phone) {
  // anything here will replace the `@content` defined in the mixin, and only happens when viewport width is less than 600px
}
```

- `rem` or `em` in media queries will **NOT** get affected by the root font-size but from the browser. Use `em` here instead of `rem` because it does not work in some of the browsers. `em` is the best option for media queries.
- `only screen` means to only apply media queries to screens. For example, if someone tries to print the page, the media query will not apply.
- `(hover:none)` or `(hover:hover)` can be used as a condition to decide whether the device can hover or not.

---

## Responsive images

Responsive images are not only an aspect of responsive design, but also crutial to web performance. The goal of responsive images is to serve the **right image** to the **right screen size** and device, in order to avoid downloading unnecessary large images on smaller screens.

3 Use Cases:

- Resolution Switching: Large image sent to large screen while small image sent to small screen
- Density Switching: Amount of pixels found in an inch or a centimeter
  - Low resolution screens: @1 x screen(low-res)
  - Hi resolution screens: @2 x screen(high-res)
- Art Direction: Art direction happens when you just don't want to serve the same image in smaller resolution, but a whole different image for a different screen size.

### Responsive images in HTML and CSS

Images in HTML basically means all the `<img>` tags with an `src` attribute. In CSS it's about the `background-image`.

#### Density Switching

Simply change the `src` attribute into `srcset` and give a density descriptor:

```html
// original
<img srcset="img/logo-green-2x.png" alt="Full log" class="footer__logo" />
// responsive design
<img
  srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x"
  alt="Full log"
  class="footer__logo"
/>
```

In this way, the browser will decide which image source to use according the current screen resolution.

#### Art Direction

Solution for art direciton is to use an HTML element called `<picture>`, in which we can specify multiple `<source>`s for one image, and in the `<source>` element, we can write a `media` attribute just like the media query in CSS, within each `source` element, the browser will decide to use which image source by `srcset` just like the desensity switching:

```html
<picture class="footer__logo">
  <source
    srcset="img/logo-green-small-1x.png 1x, img/logo-green-small-2x.png 2x"
    media="(max-width: 37.5em)"
  />
  <img
    srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x"
    alt="Full log"
  />
</picture>
```

#### Resolution Switching

Solution for resolutin switching in HTML is to use `srcset` with width descriptor and the `sizes` attribute to inform the browser about the appoximate width of the image at different viewport width.

- `srcset` defines the set of images we will allow the browser to choose between, and what size each image is.
- `sizes` defines a set of media conditions(e.g. screen width) and indicates what image size would be best to choose.

```html
<img
  srcset="img/nat-1.jpg 300w, img/nat-1-large.jpg 1000w"
  sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 300px"
  src="img/nat-1-large.jpg"
/>
```

With these attributes in place, the browser will:

- Look at its device width
- Work out which media condition in the `sizes` list is the first one to be true.
- Look at the slot size given to that media query
- Load the image referenced in the `srcset` list that most closely matches the chosen slot size.

The `src` attribute here is to tell the browser to display the img anyway in case it does not support the newer attributes. Visit [here](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for details.

### Responsive image in CSS

Media queries in CSS can have different condition propertis like resolution and width, and can be combined together to evaluate whether to apply or not:

```css
@media (min-resolution: 192dpi) and (min-width: 600px), (min-width: 2000px) {
  background-image: linear-gradient(
      to right bottom,
      rgba($color-secondary-light, 0.8),
      rgba($color-secondary-dark, 0.8)
    ), url(../img/hero.jpg);
}
```

We use `and` to perform && and use `,` to perform `or`

Finally, responsive design does not work without the HTML head tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

The `<meta>` tag is to describe that the website should be rendered with the width of the device, if we don't have this tag, the browser will zoom out the page. The largest possible version of the page will be rendered.
