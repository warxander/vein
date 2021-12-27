local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('button', function(text)
	_painter:setText(text)
	_painter:setTextOpts()

	local w = _context:getWidgetWidth() or _painter:calculateTextWidth() + _style.button.spacing * 2
	local h = _style.widget.height

	_context:beginDraw(w, h)

	_painter:setColor(_context:isWidgetHovered() and _style.color.hover or _style.color.widget)
	_painter:drawRect(w, h)

	_painter:setColor(_style.color.primary)
	_painter:move(_style.button.spacing, 0)
	_painter:drawText()

	_context:endDraw()

	return _context:isWidgetClicked()
end)
