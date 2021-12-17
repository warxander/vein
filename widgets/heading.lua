local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('heading', function(text)
	_context:beginDraw()

	local headingStyle = _style.heading

	_painter:setText(text)
	_painter:setTextOpts(headingStyle.text.font, headingStyle.text.scale)

	local w = _context:getWidgetWidth() or _painter:calculateTextWidth()
	local h = headingStyle.height

	_painter:setColor(_style.color.primary)
	_painter:drawText(headingStyle.text.offset)

	_context:endDraw(w, h)
end)
