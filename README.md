# Vein
Vein is a FiveM [IMGUI](https://en.wikipedia.org/wiki/Immediate_mode_GUI) framework.

It's written on Lua and uses [exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) to be available for other resources.

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)

## Getting Started
* Download it and put into `resources/` directory
* Add `ensure vein` to `server.cfg`
### Usage
Vein is responsible for layouting/drawing UI and input handling only.

Organizing and managing data for it is user task as a programmer.

Here is the example to illustrate IMGUI concepts:
```lua
local vein = exports.vein -- Store it in local variable for performance reasons

while true do
	Citizen.Wait(0)

	vein:beginWindow() -- Mandatory

	-- Draw widgets in column
	if vein:button('Press Me Carefully!') then -- Draw button and check if it were pressed
		break
	end

	vein:beginRow()
		-- Draw widgets in row
	vein:endRow()

	vein:endWindow() -- Mandatory
end
```
Check this [repository](https://github.com/warxander/vein-demo) to learn more from Vein demo.
### Limitations
These features are not supported due to RAGE API limitations:
* Clipping
* Rotation
* Circle drawing

These features are not supported by design (can be a subject to change though):
* Custom widget sizes (Vein is out-of-box solution)
* Custom widget colors (Vein tries to be close to FiveM color style and provides dark/light color themes)
* Nested rows

## API
### General
```lua
setDebugEnabled([enabled])
local isEnabled --[[boolean]] = isDebugEnabled()

beginWindow()
endWindow()
```
### Layout
```lua
beginRow()
endRow()

spacing([count]) -- Horizontal if in row mode, otherwise vertical
```
### Color Themes
```lua
setDarkColorTheme()
setLightColorTheme()
```
### Widgets
```lua
pushTextEntry(entry, ...) -- Apply specified text entry until popTextEntry() will be called
popTextEntry()

pushWidgetWidth(w) -- Apply specified width until popWidgetWidth() will be called
popWidgetWidth()

local hasPressed --[[boolean]] = button([text])
local hasChecked --[[boolean]] = checkBox(isChecked [, text])
dummy(w, h)
heading([text])
label([text])
progressBar(min, value, max [, w]) -- Requires to specify width or use pushWidgetWidth(w)
separator([w])
local hasValueChanged --[[boolean]], value --[[number]] = slider(min, value, max [, w]) -- Requires to specify width or use pushWidgetWidth(w)
sprite(dict, name, w, h)
local hasPressed --[[boolean]] = spriteButton(dict, name [, text])
local hasTextChanged --[[boolean]], text --[[string]] = textEdit(text, keyboardTitle, maxTextLength [, isSecretMode])
```
