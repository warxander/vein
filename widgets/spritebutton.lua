local _context = getContext()
local _input = _context:getInput()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('spriteButton', function(dict, name, text)
	_context:beginDraw()

	_painter:setText(text)
	_painter:setTextOpts()

	local spriteButtonStyle = _style.spriteButton
	local sw = spriteButtonStyle.spriteWidth

	local w = _context:getWidgetWidth() or (_painter:calculateTextWidth() + _style.button.spacing * 2 + spriteButtonStyle.spacing + sw)
	local h = _style.widget.height

	local isHovered = _input:isRectHovered(_painter:getX(), _painter:getY(), w, h)

	_painter:setColor(isHovered and _style.color.hover or _style.color.widget)
	_painter:drawRect(w, h)

	local sh = sw * GetAspectRatio()
	local so = (h - sh) / 2

	_painter:setColor(_style.color.primary)

	_painter:move(_style.button.spacing, so)
	_painter:drawSprite(dict, name, sw, sh)

	_painter:move(sw + spriteButtonStyle.spacing, -so)
	_painter:drawText()

	_context:endDraw(w, h)

	return isHovered and _input:isMousePressed()
end)
