# Vein
Vein is a FiveM [IMGUI](https://en.wikipedia.org/wiki/Immediate_mode_GUI) framework.\
It's written on TypeScript and uses [exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) to be available from other resources.\
Vein is using GTA V graphics API for rendering and most of UI customization can be done via CSS stylesheet.

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)
## Getting Started
* Download and put into `resources/` directory
* Add `ensure vein` to `server.cfg`
### Example
```lua
-- Lua

local vein = exports.vein

local windowPos = { }
local isWindowOpened = true

while isWindowOpened do
	Citizen.Wait(0)

	-- Call setNextWindow* methods

	vein:beginWindow(windowPos.x, windowPos.y)

	-- Call items API to draw them in a column

	vein:beginRow()
		-- Call items API to draw them in a row
	vein:endRow()

	if vein:button('Close') then -- Draw 'Close' button and check if it is clicked
		isWindowOpened = false
	end

	vein:label('Hello Vein')
	if vein:isItemHovered() then -- Check if the last drawn item is hovered
		if vein:isItemClicked() then
			-- Check if the last drawn item is clicked
		end
	end

	windowPos = vein:endWindow()
end
```
Check this [demo](https://github.com/warxander/vein-demo) to learn more.
### Limitations
These features are not supported due to GTA V graphics API limitations:
* Clipping
* Rotation
* Circles

These features are not supported by design (maybe subject to change):
* Nested rows
## API
Visit [docs website](docs/index.html) for documentation.
