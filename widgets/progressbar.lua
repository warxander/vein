local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('progressBar', function(min, value, max, w)
	_context:beginDraw()

	local w = w or _context:getWidgetWidth()
	local h = _style.progressBar.height

	_painter:setColor(_style.color.widget)
	_painter:move(0, (_style.widget.height - h) / 2)
	_painter:drawRect(w, h)

	if value ~= min then
		local pw = value == max and w or ((value - min) / (max - min) * w)

		_painter:setColor(_style.color.progress)
		_painter:drawRect(pw, h)
	end

	_context:endDraw(w, _style.widget.height)
end)
