local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('label', function(text)
	_painter:setText(text)
	_painter:setTextOpts()

	local w = _context:getWidgetWidth() or _painter:calculateTextWidth()
	local h = _style.widget.height

	_context:beginDraw(w, h)

	_painter:setColor(_style.color.secondary)
	_painter:drawText(_style.label.text.offset)

	_context:endDraw()
end)
