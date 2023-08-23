# Vein
Vein is a FiveM [IMGUI](https://en.wikipedia.org/wiki/Immediate_mode_GUI) framework.\
It's written on TypeScript and uses [exports](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/#using-exports) to be available from other resources.\
Vein is using GTA V natives for rendering and most of UI customization can be done via CSS stylesheet.

![alt text](https://raw.githubusercontent.com/warxander/vein-demo/master/demo.png)
# Table of Contents
1. [Getting Started](#getting-started)
	1. [Usage](#usage)
	2. [Limitations](#limitations)
2. [API](#api)
	1. [General](#general)
	2. [Layout](#layout)
	3. [Style](#style)
		1. [Selectors](#selectors)
		2. [Properties](#properties)
	4. [Items](#items)
## Getting Started
* Download and put into `resources/` directory
* Add `ensure vein` to `server.cfg`
### Usage
```lua
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
These features are not supported due to GTA V API limitations:
* Clipping
* Rotation
* Circle drawing

These features are not supported by design (maybe subject to change):
* Custom item sizes
* Nested rows

## API
### General
```lua
--! @brief setDebugEnabled
--! @comment False by default
--! @param enabled: boolean
setDebugEnabled(enabled)

--! @brief isDebugEnabled
--! @return isEnabled: boolean
local isEnabled = isDebugEnabled()

--! @brief setNextWindowNoDrag
--! @comment False by default
--! @param isNoDrag: boolean
setNextWindowNoDrag(isNoDrag)

--! @brief setNextWindowNoBackground
--! @comment False by default
--! @param isNoBackground: boolean
setNextWindowNoBackground(isNoBackground)

--! @brief setNextWindowSpacing
--! @param x: number
--! @param y: number
setNextWindowSpacing(x, y)

--! @brief beginWindow
--! @param x: number
--! @param y: number
beginWindow([x, y])

--! @brief endWindow
--! @return windowPos.x: number
--! @return windowPos.y: number
local windowPos = endWindow()

--! @brief isItemHovered
--! @comment Returns true if the last drawn item was hovered
--! @return isHovered: boolean
local isHovered = isItemHovered()

--! @brief isItemClicked
--! @comment Returns true if the last drawn item was clicked
--! @return isClicked: boolean
local isClicked = isItemClicked()
```
### Layout
```lua
--! @brief setWindowSkipNextDrawing
--! @comment Eliminates visual redrawing artifacts if the item layout was drastically changed
setWindowSkipNextDrawing()

--! @brief beginRow
beginRow()

--! @brief endRow
endRow()

--! @brief spacing
--! @comment Horizontal if in row mode, vertical otherwise
--! @param count: number
spacing([count])
```
### Style
```lua
--! @brief setStyleSheet
--! @comment CSS-like format
--! @param styleSheet: string
setStyleSheet(styleSheet)

--! @brief useDefaultStyle
useDefaultStyle()

--! @brief setNextItemId
--! @comment Used as a selector name
--! @param id: string
setNextItemId(id)

--! @brief pushItemId
--! @comment Used as a selector name
--! @param id: string
pushItemId(id)

--! @brief setNextWindowId
--! @comment Used as a selector name
--! @param id: string
setNextWindowId(id)
```
#### Selectors
`button`, `button:hover`, `check-box`, `check-box:hover`, `heading`, `label`, `progress-bar`, `selectable`,
`selectable:hover`, `separator`, `slider`, `slider:hover`, `sprite-button`, `sprite-button:hover`, `text-area`, `text-edit`,
`text-edit:hover`, `window`\
Examples:
* `button { }`
* `#myButton.button { }`
* `#mySlider:hover.slider:hover { }`
#### Properties
* `accent-color` (`#FEFEFE` or `rgba(254, 254, 254, 1.0)`)
* `background-color` (`#FEFEFE` or `rgba(254, 254, 254, 1.0)`)
* `background-image` (`url('textureDict', 'textureName')`, use `CreateRuntimeTextureFromImage` FiveM API for custom images)
* `color` (`#FEFEFE` or `rgba(254, 254, 254, 1.0)`)
* `font-family` (`0`, use `RegisterFontId` FiveM API for custom fonts)
* `font-size` (`0.15em`, equals `SetTextScale(1., 0.15)`)
### Items
```lua
--! @brief setNextTextEntry
--! @param entry: string
setNextTextEntry(entry [, ...])

--! @brief pushTextEntry
--! @param entry: string
pushTextEntry(entry [, ...])

--! @brief popTextEntry
popTextEntry()

--! @brief setNextItemWidth
--! @param w: number
setNextItemWidth(w)

--! @brief pushItemWidth
--! @param w: number
pushItemWidth(w)

--! @brief popItemWidth
popItemWidth()

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

--! @brief selectable
--! @param isSelected: boolean
--! @param text: string
--! @return hasSelected: boolean
local hasSelected = selectable(isSelected [, text])

--! @brief separator
--! @param w: number
separator([w])

--! @brief slider
--! @comment Width is required
--! @param min: number
--! @param value: number
--! @param max: number
--! @param w: number
--! @return sliderResult.isValueChanged: boolean
--! @return sliderResult.value: number
local sliderResult = slider(min, value, max [, w])

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
--! @comment Pass both parameters or use both SetNextTextEntry/SetNextItemWidth
--! @param text: string
--! @param w: number
textArea([text, w])

--! @brief textEdit
--! @param text: string
--! @param keyboardTitle: string
--! @param maxTextLength: number
--! @param isSecretMode: boolean
--! @return textEditResult.isTextChanged: boolean
--! @return textEditResult.text: string
local textEditResult = textEdit(text, keyboardTitle, maxTextLength [, isSecretMode])
```
