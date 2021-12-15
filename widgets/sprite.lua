local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('sprite', function(dict, name, w, h)
	_painter:beginDraw()

	_painter:setColor(_style.sprite.color)
	_painter:drawSprite(dict, name, w, h)

	_painter:endDraw(w, h)
end)
