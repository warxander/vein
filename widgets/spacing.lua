local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('spacing', function(count)
	local count = count or 1
	local isRowMode = _painter:isRowMode()

	local w = isRowMode and _style.window.spacing.h * count or 0
	local h = isRowMode and 0 or _style.window.spacing.v * count

	_context:beginDraw(w, h)

	_context:endDraw()
end)
