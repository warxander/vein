local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('heading', function(text)
	_painter:beginDraw()

	local headingStyle = _style.heading

	_painter:setText(text)
	_painter:setTextOpts(headingStyle.text.font, headingStyle.text.scale)

	local w = _painter:getWidgetWidth() or _painter:getTextWidth()
	local h = headingStyle.height

	_painter:setColor(_style.color.primary)
	_painter:drawText(headingStyle.text.offset)

	_painter:endDraw(w, h)
end)
