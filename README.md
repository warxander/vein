# Vein: an easy-to-use GUI library for FiveM
Vein is an [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_GUI) GUI library for [FiveM](https://fivem.net/)

## Features
* Native-based input and rendering (custom fonts, textures, full control)
* Based on [FiveM exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) API (supports all languages)
* 16 built-in items (plus [custom item support](https://github.com/warxander/vein-demo/blob/master/inventoryitem.js))
* [CSS-based customization](src/style.css)

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)

## Quick Start
* Download and put into `resources/` directory
* Add `ensure vein` to `server.cfg`

## Immediate mode
```js
const vein = exports.vein;

vein.beginFrame();

if (vein.button('Click Me'))
    console.log('Hello World!');

vein.endFrame();
```

## Documentation
Visit [Vein website](https://warxander.github.io/vein/) for documentation

## Demo
Follow [Vein demo](https://github.com/warxander/vein-demo) as an example for your own GUI.\
Run it as FiveM server resource to see how Vein looks like in game (use `/veinDemo` command)
