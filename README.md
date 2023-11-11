# Vein: an easy-to-use GUI library for FiveM
Vein is an [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_GUI) GUI library for [FiveM](https://fivem.net/).\
The main goal was to create a newbie-friendly and fun-to-use GUI library without Web technologies.\
Vein uses GTA V graphics API for input handling and rendering.\
It is written on TypeScript, but you can use it with your favourite programming language, thanks to FiveM [exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) mechanism.\
Vein provides a decent built-in item library, which you can [customize](src/style.css) with a CSS subset or even [extend with your own ones](https://github.com/warxander/vein-demo/blob/master/inventoryitem.js).

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)
## Quick Start
* Download and put into `resources/` directory
* Add `ensure vein` to `server.cfg`
## Immediate mode
```js
const vein = exports.vein;

vein.beginWindow();

if (vein.button('Click Me'))
    console.log('Hello World!');

vein.endWindow();
```
## Documentation
Visit [Vein website](https://warxander.github.io/vein/) for documentation.
## Demo
Follow [Vein demo](https://github.com/warxander/vein-demo) as an example for your own GUI.\
Run it as FiveM server resource to see how Vein looks like in game (use `/veinDemo` command).
