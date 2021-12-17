local _context = context.new()

local _painter = _context:getPainter()

function getContext()
	return _context
end

exports('setDebugEnabled', function(enabled)
	_context:setDebugEnabled(enabled)
end)

exports('isDebugEnabled', function()
	return _context:isDebugEnabled()
end)

exports('beginWindow', function()
	_context:beginWindow()
end)

exports('endWindow', function()
	_context:endWindow()
end)

exports('beginRow', function()
	_painter:beginRow()
end)

exports('endRow', function()
	_painter:endRow()
end)

exports('pushTextEntry', function(entry, ...)
	_context:pushTextEntry(entry, ...)
end)

exports('popTextEntry', function()
	_context:popTextEntry()
end)

exports('pushWidgetWidth', function(w)
	_context:pushWidgetWidth(w)
end)

exports('popWidgetWidth', function()
	_context:popWidgetWidth()
end)

exports('setDarkColorTheme', function()
	_painter:getStyle():setDarkColorTheme()
end)

exports('setLightColorTheme', function()
	_painter:getStyle():setLightColorTheme()
end)
