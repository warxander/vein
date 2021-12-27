context = { }
context.__index = context

function context.new()
	local self = { }
	setmetatable(self, context)

	self._input = input.new(self)
	self._painter = painter.new(self)

	self._isDebug = false
	self._state = { }
	self._nextState = { }

	return self
end

function context:setNextWindowNoDrag(isNoDrag)
	self._state.isNoDrag = isNoDrag
end

function context:isWindowNoDrag()
	return self._state.isNoDrag
end

function context:beginWindow(x, y)
	self._input:beginWindow()
	self._painter:beginWindow(x, y)
end

function context:endWindow()
	local x, y = self._painter:endWindow()

	self._input:endWindow()

	self._state = { }

	return x, y
end

function context:isWidgetHovered()
	return self._input:isRectHovered(self._painter:getWidgetX(), self._painter:getWidgetY(), self._painter:getWidgetWidth(), self._painter:getWidgetHeight())
end

function context:isWidgetClicked()
	return self._input:isMousePressed() and self:isWidgetHovered()
end

function context:beginDraw(w, h)
	self._painter:beginDraw(w, h)
end

function context:endDraw()
	self._painter:endDraw()

	self._nextState = { }
end

function context:setDebugEnabled(enabled)
	self._isDebug = enabled
end

function context:isDebugEnabled()
	return self._isDebug
end

function context:__setTextEntry(state, entry, ...)
	state.textEntry = entry
	state.textComponents = { ... }
end

function context:setNextTextEntry(entry, ...)
	self:__setTextEntry(self._nextState, entry, ...)
end

function context:pushTextEntry(entry, ...)
	self:__setTextEntry(self._state, entry, ...)
end

function context:popTextEntry()
	self._state.textEntry = nil
	self._state.textComponents = nil
end

function context:getTextEntry()
	return self._nextState.textEntry or self._state.textEntry
end

function context:getTextComponents()
	return self._nextState.textComponents or self._state.textComponents
end

function context:__setWidgetWidth(state, w)
	state.widgetWidth = w
end

function context:setNextWidgetWidth(w)
	self:__setWidgetWidth(self._nextState, w)
end

function context:pushWidgetWidth(w)
	self:__setWidgetWidth(self._state, w)
end

function context:popWidgetWidth()
	self._state.widgetWidth = nil
end

function context:getWidgetWidth()
	return self._nextState.widgetWidth or self._state.widgetWidth
end

function context:getInput()
	return self._input
end

function context:getPainter()
	return self._painter
end
