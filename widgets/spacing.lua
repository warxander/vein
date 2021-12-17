local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('spacing', function(count)
	count = count or 1

	_context:beginDraw()

	local isRowMode = _painter:isRowMode()
	local w = isRowMode and _style.window.spacing.h * count or 0
	local h = isRowMode and 0 or _style.window.spacing.v * count

	_context:endDraw(w, h)
end)
