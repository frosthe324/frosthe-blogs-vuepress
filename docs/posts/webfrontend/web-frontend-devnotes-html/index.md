---
title: Web Front-end Basics - HTML/HTML5
date: 2019-09-02 19:21:58
description: Notes of HTML/HTML5
excerpt: Notes of HTML/HTML5
category:
    - WebFrontend
tag:
    - javascript
    - html
    - css
---

## Misc Notes
- input[type="time"] always return the value with UTC time.
- input[type="datetime-local"] returns a local date and time.

## Phases of Page Rendering

What phases it goes through from a user entering urls in the address bar to getting a rendered page? 

- DNS lookups
- TCP handshakes/TLS handshakes for HTTPS 
- Initial HTTP GET request for the index/home HTML page 
- Critical rendering path:
  1. Building the DOM tree: Contains all the content of the page.
      - DOM construction is incremental
      - HTML response -> Tokens -> Nodes -> DOM Tree.
      - Preload scanner does its job simultaneously.
      - Blocked when encountering script tag.
      - Obtaining CSS doesn’t block HTML parsing, but it does block scripts 
  2. Building the CSSOM tree: Contains all the styles of the page.
      - CSSOM construction is not incremental, the browser blocks page rendering until it receives and processes all of the CSS(CSS rules can be overwritten).
      - JavaScript Compilation: Abstract syntax trees -> Interpreter 
      - Building the Accessibility Tree
  3. Render Tree: Combining the DOM and CSSOM into a render tree. To construct the render tree, the browser checks every node, starting from root of the DOM tree, and determine which CSS rules are attached.
  4. Layout: 
     - The viewport meta tag defines the width of the layout viewport, impacting the layout. Without it, the browser uses the default viewport width, which on by-default full screen browsers is generally `960px`. On by-default full screen browsers, like your phone's browser, by setting `<meta name="viewport" content="width=device-width">`, the width will be the width of the device instead of the default viewport width. The device-width changes when a user rotates their phone between landscape and portrait mode. Layout happens every time a device is rotated or browser is otherwise resized.
     - Running the layout on the render tree to compute the geometry of each node.
     - The first time the size and position of nodes are determined is called *layout*. Subsequent recalculations of node size and locations are called *reflows*. A image without a size will trigger a reflow when the image is obtained.
     - To reduce the frequency and duration of layout events, batch updates and avoid animating box model properties.
  5. Paint: The browser converts each box calculated in the layout phase to actual pixels on the screen.
     - To ensure smooth scrolling and animation, everything occupying the main thread, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish.
     - Painting can break the elements in the layout tree into layers. Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance.
     - `<video>` and `<canvas>` and any element which has the CSS property of opacity, `transform`, `will-change` will be broken into layers for GPU rendering.


- TTFB(Time to First Byte): is the time between when the user made the request—say by clicking on a link—and the receipt of this first packet of HTML. The first chunk of content is usually 14kb of data.
- TTI(Time to Interactive): is the measurement of how long it took from that first request which led to the DNS lookup and SSL connection to when the page is interactive.

 