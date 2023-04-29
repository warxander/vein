local _context = getContext()

exports('dummy', function(w, h)
	_context:beginDraw(w, h)
	_context:endDraw()
end)
