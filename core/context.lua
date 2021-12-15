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

function context:setDebugEnabled(enabled)
	self._isDebug = enabled
end

function context:isDebugEnabled()
	return self._isDebug
end

function context:pushTextEntry(entry, ...)
	if not self._state.text then
		self._state.text = { }
	end
	self._state.text.entry = entry
	self._state.text.components = { ... }
end

function context:popTextEntry()
	if self._state.text then
		self._state.text.entry = nil
		self._state.text.components = nil
	end
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

function context:getState()
	return self._state
end

function context:getInput()
	return self._input
end

function context:getPainter()
	return self._painter
end
