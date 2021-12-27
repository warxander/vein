local _context = getContext()
local _input = _context:getInput()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('slider', function(min, value, max, w)
	local w = w or _context:getWidgetWidth()
	local h = _style.widget.height

	_context:beginDraw(w, h)

	local sliderStyle = _style.slider
	local newValue = value

	local isHovered = _input:isRectHovered(_painter:getX() - sliderStyle.tickMark.width / 2, _painter:getY(), w + sliderStyle.tickMark.width, h)
	if isHovered and (_input:isMouseDown() or _input:isMousePressed()) then
		newValue = math.min(max, math.max(min, min + ((_input:getMousePosX() - _painter:getX()) / w * (max + min))))
	end

	local sh = (h - sliderStyle.height) / 2

	_painter:setColor(_style.color.widget)
	_painter:move(0, sh)
	_painter:drawRect(w, sliderStyle.height)

	local sx = w * (returnValue or value) / (max + min)
	local tx = sx - sliderStyle.tickMark.width / 2
	local ty = -sliderStyle.tickMark.height / 4

	_painter:setColor(isHovered and _style.color.hover or _style.color.primary)
	_painter:move(tx, ty)
	_painter:drawRect(sliderStyle.tickMark.width, sliderStyle.tickMark.height)

	_context:endDraw()

	return newValue ~= value, newValue
end)
