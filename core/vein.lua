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

exports('setNextWindowNoDrag', function(isNoDrag)
	_context:setNextWindowNoDrag(isNoDrag)
end)

exports('beginWindow', function(x, y)
	_context:beginWindow(x, y)
end)

exports('endWindow', function()
	return _context:endWindow()
end)

exports('isWidgetHovered', function()
	return _context:isWidgetHovered()
end)

exports('isWidgetClicked', function()
	return _context:isWidgetClicked()
end)

exports('beginRow', function()
	_painter:beginRow()
end)

exports('endRow', function()
	_painter:endRow()
end)

exports('setNextTextEntry', function(entry, ...)
	_context:setNextTextEntry(entry, ...)
end)

exports('pushTextEntry', function(entry, ...)
	_context:pushTextEntry(entry, ...)
end)

exports('popTextEntry', function()
	_context:popTextEntry()
end)

exports('setNextWidgetWidth', function(w)
	_context:setNextWidgetWidth(w)
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
