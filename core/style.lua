style = { }
style.__index = style

local function createDarkColorTheme()
	return {
		debug = { 105, 255, 89, 32 },
		default = { 0, 0, 0, 255 },
		hover = { 244, 5, 82, 255 },
		primary = { 255, 255, 240, 255 },
		progress = { 0, 155, 103, 255 },
		secondary = { 181, 181, 173, 255 },
		widget = { 22, 25, 35, 255 },
		window = { 34, 37, 45, 255 },
	}
end

local function createLightColorTheme()
	return {
		debug = { 85, 235, 69, 48 },
		default = { 0, 0, 0, 255 },
		hover = { 244, 5, 82, 255 },
		primary = { 22, 25, 35, 255 },
		progress = { 0, 155, 103, 255 },
		secondary = { 135, 137, 136, 255 },
		widget = { 248, 248, 236, 255 },
		window = { 230, 230, 223, 255 },
	}
end

function style:setDarkColorTheme()
	self.color = createDarkColorTheme()
end

function style:setLightColorTheme()
	self.color = createLightColorTheme()
end

function style.new()
	local self = {
		button = {
			spacing = 0.005,
		},
		checkbox = {
			height = 0.02,
			spacing = 0.0025,
			inlineHeight = 0.002,
			outlineHeight = 0.002,
		},
		heading = {
			height = 0.045,
			lineHeight = 0.001,
			text = {
				font = 4,
				scale = 0.725,
				offset = 0.003,
			},
		},
		label = {
			text = {
				offset = -0.005,
			},
		},
		progressBar = {
			height = 0.004,
		},
		separator = {
			height = 0.001,
		},
		slider = {
			height = 0.004,
			tickMark = {
				width = 0.012,
				height = 0.007,
			},
		},
		spriteButton = {
			spriteWidth = 0.016,
			spacing = 0.001,
		},
		sprite = {
			color = { 254, 254, 254, 255 },
		},
		textArea = {
			text = {
				offset = -0.005,
			},
		},
		textEdit = {
			lineHeight = 0.002,
			symbolWidth = 0.01,
		},
		widget = {
			height = 0.035,
			text = {
				font = 0,
				offset = -0.0035,
				scale = 0.325,
			},
		},
		window = {
			outlineWidth = 0.0005,
			margins = { h = 0.01, v = 0.018 },
			spacing = { h = 0.005, v = 0.01 },
		},
	}
	setmetatable(self, style)

	self:setDarkColorTheme()

	return self
end
