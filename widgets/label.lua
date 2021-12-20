local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('label', function(text)
	_context:beginDraw()

	_painter:setText(text)
	_painter:setTextOpts()

	local w = _context:getWidgetWidth() or _painter:calculateTextWidth()

	_painter:setColor(_style.color.primary)
	_painter:drawText(_style.label.text.offset)

	_context:endDraw(w, _style.widget.height)
end)
