local _context = getContext()
local _painter = _context:getPainter()
local _style = _painter:getStyle()

exports('textArea', function(text, w)
	_painter:setText(text)
	_painter:setTextOpts()

	local w = w or _context:getWidgetWidth()
	_painter:setTextMaxWidth(w)

	local lc = _painter:calculateTextLineCount()
	local h = lc == 1 and _style.widget.height or (_painter:calculateTextLineHeight() * (lc + 1) + math.abs(_style.textArea.text.offset) * 2)

	_context:beginDraw(w, h)

	_painter:setColor(_style.color.secondary)
	_painter:drawText(_style.textArea.text.offset)

	_context:endDraw()
end)
