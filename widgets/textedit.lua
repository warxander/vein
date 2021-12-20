local _context = getContext()
local _input = _context:getInput()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

local _keyboardTitleEntry = 'VEIN_EDIT_KEYBOARD_TITLE'

exports('textEdit', function(text, keyboardTitle, maxTextLength, isSecretMode)
	_context:beginDraw()

	local w = _context:getWidgetWidth() or maxTextLength * _style.textEdit.symbolWidth
	local h = _style.widget.height

	local newText = text

	local isHovered = _input:isRectHovered(_painter:getX(), _painter:getY(), w, h)

	if isHovered and _input:isMousePressed() then
		AddTextEntry(_keyboardTitleEntry, keyboardTitle)
		DisplayOnscreenKeyboard(1, _keyboardTitleEntry, '', text, '', '', '', maxTextLength)

		while true do
			Citizen.Wait(0)

			DisableAllControlActions(0)

			local status = UpdateOnscreenKeyboard()
			if status == 1 then
				newText = GetOnscreenKeyboardResult()
				break
			elseif status == 2 then
				break
			end
		end
	end

	_painter:setColor(_style.color.widget)
	_painter:drawRect(w, h)

	local lineOffset = h - _style.textEdit.lineHeight
	_painter:move(0, lineOffset)

	_painter:setColor(isHovered and _style.color.hover or _style.color.primary)
	_painter:drawRect(w, _style.textEdit.lineHeight)

	_painter:move(0, -lineOffset)

	_painter:setText(isSecretMode and string.rep('\u{2022}', string.len(text)) or text)
	_painter:setTextOpts()
	_painter:setColor(_style.color.primary)
	_painter:drawText()

	_context:endDraw(w, h)

	return newText ~= text, newText
end)
