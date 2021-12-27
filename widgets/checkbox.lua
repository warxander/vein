local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('checkBox', function(isChecked, text)
	_painter:setText(text)
	_painter:setTextOpts()

	local aspectRatio = GetAspectRatio()
	local checkboxStyle = _style.checkbox
	local cw = checkboxStyle.height / aspectRatio

	local w = _context:getWidgetWidth() or (cw + checkboxStyle.spacing + _painter:calculateTextWidth())
	local h = _style.widget.height

	_context:beginDraw(w, h)

	if _context:isWidgetClicked() then
		isChecked = not isChecked
	end

	local vo = (h - checkboxStyle.height) / 2

	_painter:setColor(_context:isWidgetHovered() and _style.color.hover or _style.color.primary)
	_painter:move(0, vo)
	_painter:drawRect(cw, checkboxStyle.height)

	local outlineWidth = checkboxStyle.outlineHeight / aspectRatio
	cw = cw - outlineWidth * 2

	_painter:setColor(_style.color.window)
	_painter:move(outlineWidth, checkboxStyle.outlineHeight)
	_painter:drawRect(cw, cw * aspectRatio)

	local inlineWidth = checkboxStyle.inlineHeight / aspectRatio
	cw = cw - inlineWidth * 2

	_painter:setColor(isChecked and _style.color.primary or _style.color.window)
	_painter:move(inlineWidth, checkboxStyle.inlineHeight)
	_painter:drawRect(cw, cw * aspectRatio)
	_painter:move(-inlineWidth, -checkboxStyle.inlineHeight)

	_painter:move(-outlineWidth, -checkboxStyle.outlineHeight)
	_painter:move(0, -vo)

	_painter:setColor(_style.color.primary)
	_painter:move(checkboxStyle.height / aspectRatio + checkboxStyle.spacing * 2, 0)
	_painter:drawText()

	_context:endDraw()

	return isChecked
end)
