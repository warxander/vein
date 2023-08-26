# Vein: an easy-to-use GUI library for FiveM
Vein is an [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_GUI) GUI library for [FiveM](https://fivem.net/).\
The main goal was to create a newbie-friendly and fun-to-use GUI library without Web technologies.\
Vein uses GTA V graphics API for input handling and rendering.\
It is written on [TypeScript](https://www.typescriptlang.org/), but you can use it with your favourite programming language, thanks to FiveM [exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) mechanism.\
Vein provides a decent built-in items library, which you can customize or extend with your own items.

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)
## Quick Start
* Download and put into `resources/` directory
* Add `ensure vein` to `server.cfg`
## Features
### Immediate mode
```lua
local vein = exports.vein
vein:beginWindow()
if vein:button('Click Me') then
  print('Hello World!')
end
vein:endWindow()
```
### Documentation
Visit [Vein website](https://warxander.github.io/vein/) for documentation.
### Extensibility
Vein provides an API to write your own items.\
_TODO: Example_
### Customization
Vein supports a CSS subset for customizing built-in and your own items.\
Use default [style.css](src/style.css) as a template.
### Demo
Follow [Vein demo](https://github.com/warxander/vein-demo) as an example for your own GUI.\
Run it as FiveM server resource to see how Vein looks like in game (use `/veinDemo` command).
