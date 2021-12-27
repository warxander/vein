local _context = getContext()
local _painter = _context:getPainter()

exports('dummy', function(w, h)
	_context:beginDraw(w, h)
	_context:endDraw()
end)
