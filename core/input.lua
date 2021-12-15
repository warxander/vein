input = { }
input.__index = input

function input:beginWindow()
	DisableControlAction(0, 1, true)
	DisableControlAction(0, 2, true)
	DisableControlAction(0, 24, true)
	DisableControlAction(0, 25, true)
	DisableControlAction(0, 257, true)
	DisableControlAction(0, 263, true)

	SetMouseCursorActiveThisFrame()

	self._state = { }

	self._state.mousePos = { }
	self._state.mousePos.x = GetControlNormal(2, 239)
	self._state.mousePos.y = GetControlNormal(2, 240)

	self._state.isMousePressed = IsControlJustPressed(2, 237)
	self._state.isMouseReleased = not self._state.isMousePressed and IsControlJustReleased(2, 237)
	self._state.isMouseDown = not self._state.isMouseReleased and IsControlPressed(2, 237)
end

function input:endWindow()
	self._state = nil
end

function input:getMousePosX()
	return self._state.mousePos.x
end

function input:getMousePosY()
	return self._state.mousePos.y
end

function input:isMouseDown()
	return self._state.isMouseDown
end

function input:isMousePressed()
	return self._state.isMousePressed
end

function input:isMouseReleased()
	return self._state.isMouseReleased
end

function input:isMouseInRect(x, y, w, h)
	return not (self._state.mousePos.x < x or self._state.mousePos.x > x + w or self._state.mousePos.y < y or self._state.mousePos.y > y + h)
end

function input.new(context)
	local self = { }
	setmetatable(self, input)

	self._context = context

	return self
end
