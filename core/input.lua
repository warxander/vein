input = { }
input.__index = input

local _disabledControls = {
	1, 2, 22, 24, 25, 36, 37,
	44, 47, 53, 54, 68, 69, 70,
	74, 81, 82, 83, 84, 85, 91,
	92, 99, 100, 101, 102, 114, 140,
	141, 142, 143, 157, 158, 159, 160,
	161, 162, 163, 164, 165, 257, 263,
}

local _disabledControlsInVehicle = {
	80, 106, 122, 135, 282, 283, 284, 285,
}

function input:beginWindow()
	for _, control in ipairs(_disabledControls) do
		DisableControlAction(0, control, true)
	end

	if IsPedInAnyVehicle(PlayerPedId()) then
		for _, control in ipairs(_disabledControlsInVehicle) do
			DisableControlAction(0, control, true)
		end
	end

	SetMouseCursorActiveThisFrame()

	self._state.mousePosX = GetControlNormal(2, 239)
	self._state.mousePosY = GetControlNormal(2, 240)

	self._state.isMousePressed = IsControlJustPressed(2, 237)
	self._state.isMouseReleased = not self._state.isMousePressed and IsControlJustReleased(2, 237)
	self._state.isMouseDown = not self._state.isMouseReleased and IsControlPressed(2, 237)
end

function input:endWindow()
	self._state = { }
end

function input:getMousePosX()
	return self._state.mousePosX
end

function input:getMousePosY()
	return self._state.mousePosY
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

function input:isRectHovered(x, y, w, h)
	return not (self._state.mousePosX < x or self._state.mousePosX > x + w or self._state.mousePosY < y or self._state.mousePosY > y + h)
end

function input.new(context)
	local self = { }
	setmetatable(self, input)

	self._context = context
	self._state = { }

	return self
end
