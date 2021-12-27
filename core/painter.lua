painter = { }
painter.__index = painter

function painter:beginWindow(x, y)
	self._window.x = x or 0.5
	self._window.y = y or 0.5

	self._x = self._window.x - (self._window.w / 2)
	self._y = self._window.y - (self._window.h / 2)

	if not self._layout.isValid then
		return
	end

	if not self._context:isWindowNoDrag() then
		self:beginDrag()
	end

	self:drawWindow()
end

function painter:endWindow()
	if not self._context:isWindowNoDrag() then
		self:endDrag()
	end

	self._window.w = self._layout.isValid and self._layout.w + self._style.window.margins.h * 2 or 0
	self._window.h = self._layout.isValid and self._layout.h + self._style.window.margins.v * 2 or 0

	self._layout.isValid = self._layout.w ~= 0 and self._layout.h ~= 0
	self._layout.isFirstWidget = true

	self._layout.w = 0
	self._layout.h = 0

	return self._window.x, self._window.y
end

function painter:drawWindow()
	local outlineWidth = self._style.window.outlineWidth
	local outlineHeight = outlineWidth * GetAspectRatio()

	self:move(-outlineWidth, -outlineHeight)
	self:setColor(self._style.color.widget)
	self:drawRect(self._window.w + outlineWidth * 2, self._window.h + outlineHeight * 2)
	self:move(outlineWidth, outlineHeight)

	self:setColor(self._style.color.window)
	self:drawRect(self._window.w, self._window.h)
end

function painter:beginDrag()
	if self._drag.isInProcess then
		return
	end

	local input = self._context:getInput()

	if input:isRectHovered(self._x, self._y, self._window.w, self._style.window.margins.v) and input:isMousePressed() then
		self._drag.origin.x = input:getMousePosX()
		self._drag.origin.y = input:getMousePosY()

		self._drag.isInProcess = true
	end
end

function painter:endDrag()
	if not self._drag.isInProcess then
		return
	end

	local input = self._context:getInput()

	if input:isMouseDown() then
		local x = input:getMousePosX()
		local y = input:getMousePosY()

		self._window.x = self._window.x + x - self._drag.origin.x
		self._window.y = self._window.y + y - self._drag.origin.y

		self._drag.origin.x = x
		self._drag.origin.y = y
	else
		self._drag.isInProcess = false
	end
end

function painter:getX()
	return self._x
end

function painter:getY()
	return self._y
end

function painter:beginRow()
	if not self._row.isActive then
		self._row.isActive = true
		self._row.isFirstWidget = true
	end
end

function painter:endRow()
	if not self._row.isActive then
		return
	end

	self._layout.w = math.max(self._layout.w, self._row.w)
	self._layout.h = self._layout.h + self._row.h

	self:setPos(self._window.x - (self._window.w / 2) + self._style.window.margins.h, self._y + self._row.h)

	self._row.isActive = false
	self._row.isFirstWidget = true

	self._row.w = 0
	self._row.h = 0
end

function painter:isRowMode()
	return self._row.isActive
end

function painter:beginDraw(w, h)
	if self._layout.isFirstWidget then
		self:move(self._style.window.margins.h, self._style.window.margins.v)
	else
		local ho = 0
		if not self._row.isFirstWidget then ho = self._style.window.spacing.h end

		if self._row.isActive then
			self._row.w = self._row.w + ho
		else
			self._layout.w = self._layout.w + ho
		end

		local vo = 0
		if not self._row.isActive or self._row.isFirstWidget then vo = self._style.window.spacing.v end
		self._layout.h = self._layout.h + vo

		self:move(ho, vo)
	end

	self._widget.x = self._x
	self._widget.y = self._y
	self._widget.w = w
	self._widget.h = h
end

function painter:endDraw()
	local w = self._widget.w
	local h = self._widget.h

	self:drawDebug(w, h)

	if self._row.isActive then
		self._row.w = self._row.w + w
		self._row.h = math.max(self._row.h, h)
		self._row.isFirstWidget = false

		self:setPos(self._widget.x + w, self._widget.y)
	else
		self._layout.w = math.max(w, self._layout.w)
		self._layout.h = self._layout.h + h
		self._row.isFirstWidget = true

		self:setPos(self._widget.x, self._widget.y + h)
	end

	self._layout.isFirstWidget = false
end

function painter:getWidgetX()
	return self._widget.x
end

function painter:getWidgetY()
	return self._widget.y
end

function painter:getWidgetWidth()
	return self._widget.w
end

function painter:getWidgetHeight()
	return self._widget.h
end

function painter:setPos(x, y)
	self._x = x
	self._y = y
end

function painter:move(x, y)
	self._x = self._x + x
	self._y = self._y + y
end

function painter:getStyle()
	return self._style
end

function painter:setColor(color)
	self._color = color
end

function painter:drawRect(w, h)
	if self._layout.isValid then
		DrawRect(self._x + w / 2, self._y + h / 2, w, h, table.unpack(self._color))
	end
end

function painter:drawSprite(dict, name, w, h)
	if self._layout.isValid then
		DrawSprite(dict, name, self._x + w / 2, self._y + h / 2, w, h, 0., table.unpack(self._color))
	end
end

function painter:calculateTextWidth()
	local textEntry = self._context:getTextEntry()
	if not textEntry then
		return 0
	end

	BeginTextCommandGetWidth(textEntry)
	local textComponents = self._context:getTextComponents()
	if textComponents then utils.addTextComponents(textComponents) end
	return EndTextCommandGetWidth(true)
end

function painter:calculateTextLineHeight(scale, font)
	scale = scale or self._style.widget.text.scale
	font = font or self._style.widget.text.font

	return GetRenderedCharacterHeight(scale, font)
end

function painter:calculateTextLineCount()
	local textEntry = self._context:getTextEntry()
	if not textEntry then
		return 0
	end

	BeginTextCommandLineCount(textEntry)
	local textComponents = self._context:getTextComponents()
	if textComponents then utils.addTextComponents(textComponents) end
	return EndTextCommandLineCount(self._x, self._y)
end

function painter:setText(text)
	if text then
		self._context:setNextTextEntry('STRING', text)
	end
end

function painter:setTextOpts(font, scale)
	if not self._context:getTextEntry() then
		return
	end

	SetTextFont(font or self._style.widget.text.font)

	scale = scale or self._style.widget.text.scale
	SetTextScale(scale * GetAspectRatio(), scale)
end

function painter:setTextMaxWidth(w)
	if self._context:getTextEntry() then
		SetTextWrap(self._x, self._x + w)
	end
end

function painter:drawText(offset)
	local textEntry = self._context:getTextEntry()
	if not textEntry then
		return
	end

	SetTextColour(table.unpack(self._color))
	BeginTextCommandDisplayText(textEntry)
	local textComponents = self._context:getTextComponents()
	if textComponents then utils.addTextComponents(textComponents) end
	EndTextCommandDisplayText(self._x, self._y - (offset or self._style.widget.text.offset))
end

function painter:drawDebug(w, h)
	if w ~= 0 and h ~= 0 and self._context:isDebugEnabled() then
		self:setPos(self._widget.x, self._widget.y)
		self:setColor(self._style.color.debug)
		self:drawRect(w, h or self._style.widget.height)
	end
end

function painter.new(context)
	local self = { }
	setmetatable(self, painter)

	self._context = context
	self._style = style.new()

	self._layout = {
		w = 0,
		h = 0,
	}

	self._drag = {
		origin = {
			x = 0,
			y = 0,
		},
	}

	self._row = {
		w = 0,
		h = 0,
	}

	self._widget = {
		x = 0,
		y = 0,
		w = 0,
		h = 0,
	}

	self._window = {
		w = 0,
		h = 0,
	}

	return self
end
