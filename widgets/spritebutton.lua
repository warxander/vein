local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('spriteButton', function(dict, name, text)
	_painter:setText(text)
	_painter:setTextOpts()

	local spriteButtonStyle = _style.spriteButton
	local sw = spriteButtonStyle.spriteWidth

	local w = _context:getWidgetWidth() or (_painter:calculateTextWidth() + _style.button.spacing * 2 + spriteButtonStyle.spacing + sw)
	local h = _style.widget.height

	_context:beginDraw(w, h)

	_painter:setColor(_context:isWidgetHovered() and _style.color.hover or _style.color.widget)
	_painter:drawRect(w, h)

	local sh = sw * GetAspectRatio()
	local so = (h - sh) / 2

	_painter:setColor(_style.color.primary)

	_painter:move(_style.button.spacing, so)
	_painter:drawSprite(dict, name, sw, sh)

	_painter:move(sw + spriteButtonStyle.spacing, -so)
	_painter:drawText()

	_context:endDraw()

	return _context:isWidgetClicked()
end)
