local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('label', function(text)
	_painter:beginDraw()

	_painter:setText(text)
	_painter:setTextOpts()

	local w = _painter:getWidgetWidth() or _painter:getTextWidth()

	_painter:setColor(_style.color.secondary)
	_painter:drawText(_style.label.text.offset)

	_painter:endDraw(w, _style.widget.height)
end)
