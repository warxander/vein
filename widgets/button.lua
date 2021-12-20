local _context = getContext()
local _input = _context:getInput()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('button', function(text)
	_context:beginDraw()

	_painter:setText(text)
	_painter:setTextOpts()

	local w = _context:getWidgetWidth() or _painter:calculateTextWidth() + _style.button.spacing * 2
	local h = _style.widget.height

	local isHovered = _input:isRectHovered(_painter:getX(), _painter:getY(), w, h)

	_painter:setColor(isHovered and _style.color.hover or _style.color.widget)
	_painter:drawRect(w, h)

	_painter:setColor(_style.color.primary)
	_painter:move(_style.button.spacing, 0)
	_painter:drawText()

	_context:endDraw(w, h)

	return isHovered and _input:isMousePressed()
end)
