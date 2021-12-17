context = { }
context.__index = context

function context.new()
	local self = { }
	setmetatable(self, context)

	self._isDebug = false

	self._input = input.new(self)
	self._painter = painter.new(self)

	return self
end

function context:beginWindow()
	self._state = { }

	self._input:beginWindow()
	self._painter:beginWindow()
end

function context:endWindow()
	self._painter:endWindow()
	self._input:endWindow()

	self._state = nil
end

function context:beginDraw()
	self._nextState = { }

	self._painter:beginDraw()
end

function context:endDraw(w, h)
	self._painter:endDraw(w, h)

	self._nextState = nil
end

function context:setDebugEnabled(enabled)
	self._isDebug = enabled
end

function context:isDebugEnabled()
	return self._isDebug
end

function context:__setTextEntry(state, entry, ...)
	if not state.text then
		state.text = { }
	end

	state.text.entry = entry
	state.text.components = { ... }
end

function context:setNextTextEntry(entry, ...)
	self:__setTextEntry(self._nextState, entry, ...)
end

function context:pushTextEntry(entry, ...)
	self:__setTextEntry(self._state, entry, ...)
end

function context:popTextEntry()
	self._state.text = nil
end

function context:getTextEntry()
	return self._nextState.text or self._state.text
end

function context:pushWidgetWidth(w)
	if not self._state.widget then
		self._state.widget = { }
	end

	self._state.widget.w = w
end

function context:popWidgetWidth()
	if self._state.widget then
		self._state.widget.w = nil
	end
end

function context:getWidgetWidth()
	return self._state.widget and self._state.widget.w
end

function context:getInput()
	return self._input
end

function context:getPainter()
	return self._painter
end
