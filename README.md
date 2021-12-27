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

local windowX, windowY
local isWindowOpened = true

while isWindowOpened do
	Citizen.Wait(0)

	-- Call setNextWindow* methods

	vein:beginWindow(windowX, windowY) -- Mandatory

	-- Draw widgets in column

	vein:beginRow()
		-- Draw widgets in row
	vein:endRow()

	vein:label('Hello Vein')
	if vein:isWidgetHovered() then
		--
		if vein:isWidgetClicked() then
			--
		end
	end

	if vein:button('Close Window') then -- Draw button and check if it were pressed
		isWindowOpened = false
	end

	windowX, windowY = vein:endWindow() -- Mandatory
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
--! @brief setDebugEnabled
--! @param enabled: boolean
setDebugEnabled([enabled])

--! @brief isDebugEnabled
--! @return isEnabled: boolean
local isEnabled = isDebugEnabled()

--! @brief setNextWindowNoDrag
--! @comment False by default
--! @param isNoDrag: boolean
setNextWindowNoDrag(isNoDrag)

--! @brief beginWindow
--! @param x: number
--! @param y: number
beginWindow([x, y])

--! @brief endWindow
--! @return x: number
--! @return y: number
local x, y = endWindow()

--! @brief isWidgetHovered
--! @comment Returns true is last drawn widget was hovered
--! @return isWidgetHovered: boolean
local isWidgetHovered = isWidgetHovered()

--! @brief isWidgetClicked
--! @comment Returns true is last drawn widget was clicked
--! @return isWidgetClicked: boolean
local isWidgetClicked = isWidgetClicked()
```
### Layout
```lua
--! @brief beginRow
beginRow()

--! @brief endRow
endRow()

--! @brief spacing
--! @comment Horizontal if in row mode, otherwise vertical
--! @param count: number
spacing([count])
```
### Color Themes
```lua
--! @brief setDarkColorTheme
setDarkColorTheme()

--! @brief setLightColorTheme
setLightColorTheme()
```
### Widgets
```lua
--! @brief setNextTextEntry
--! @comment Applies specified text entry for next drawn widget
--! @param entry: string
setNextTextEntry(entry [, ...])

--! @brief pushTextEntry
--! @comment Applies specified text entry until popTextEntry() will be called
--! @param entry: string
pushTextEntry(entry [, ...])

--! @brief popTextEntry
popTextEntry()

--! @brief setNextWidgetWidth
--! @comment Applies specified width for next drawn widget
--! @param w: number
setNextWidgetWidth(w)

--! @brief pushWidgetWidth
--! @comment Applies specified width until popWidgetWidth() will be called
--! @param w: number
pushWidgetWidth(w)

--! @brief popWidgetWidth
popWidgetWidth()

--! @brief button
--! @param text: string
--! @return hasChecked: boolean
local hasPressed = button([text])

--! @brief checkBox
--! @param isChecked: boolean
--! @param text: string
--! @return hasChecked: boolean
local hasChecked = checkBox(isChecked [, text])

--! @brief dummy
--! @param w: number
--! @param h: number
dummy(w, h)

--! @brief heading
--! @param text: string
heading([text])

--! @brief label
--! @param text: string
label([text])

--! @brief progressBar
--! @comment Width is required
--! @param min: number
--! @param value: number
--! @param max: number
--! @param w: number
progressBar(min, value, max [, w])

--! @brief separator
--! @param w: number
separator([w])

--! @brief slider
--! @comment Width is required
--! @param min: number
--! @param value: number
--! @param max: number
--! @param w: number
--! @return hasValueChanged: boolean
--! @return value: number
local hasValueChanged, value = slider(min, value, max [, w])

--! @brief sprite
--! @param dict: string
--! @param name: string
--! @param w: number
--! @param h: number
sprite(dict, name, w, h)

--! @brief spriteButton
--! @param dict: string
--! @param name: string
--! @param text: string
--! @return hasPressed: boolean
local hasPressed = spriteButton(dict, name [, text])

--! @brief textArea
--! @comment Displays multiline text
--! @comment Width is required
--! @param text: string
--! @param w: number
textArea([text, w])

--! @brief textEdit
--! @param text: string
--! @param keyboardTitle: string
--! @param maxTextLength: number
--! @param isSecretMode: boolean
--! @return hasTextChanged: boolean
--! @return text: string
local hasTextChanged, text = textEdit(text, keyboardTitle, maxTextLength [, isSecretMode])
```
