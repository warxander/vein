local _context = getContext()
local _input = _context:getInput()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('button', function(text)
	_painter:beginDraw()

	_painter:setText(text)
	_painter:setTextOpts()

	local w = _painter:getWidgetWidth() or _painter:getTextWidth() + _style.button.spacing * 2
	local h = _style.widget.height

	local isHovered = _input:isMouseInRect(_painter:getX(), _painter:getY(), w, h)

	_painter:setColor(isHovered and _style.color.hover or _style.color.widget)
	_painter:drawRect(w, h)

	_painter:setColor(_style.color.primary)
	_painter:move(_style.button.spacing, 0)
	_painter:drawText()

	_painter:endDraw(w, h)

	return isHovered and _input:isMousePressed()
end)
