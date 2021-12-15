local _context = getContext()
local _painter = _context:getPainter()

exports('dummy', function(w, h)
	_painter:beginDraw()
	_painter:endDraw(w, h)
end)
