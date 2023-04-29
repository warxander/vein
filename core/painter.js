class Painter {
	#context
	#style
	#layout
	#drag
	#row
	#widget
	#window

	constructor(context) {
		this.#context = context
		this.#style = new Style()

		this.#layout = {
			w: 0,
			h: 0
		}

		this.#drag = {
			origin: {
				x: 0,
				y: 0
			}
		}

		this.#row = {
			w: 0,
			h: 0
		}

		this.#widget = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		}

		this.#window = {
			w: 0,
			h: 0
		}
	}

	beginWindow(x, y) {
		this.#window.x = x || 0.5
		this.#window.y = y || 0.5

		this._x = this.#window.x - (this.#window.w / 2)
		this._y = this.#window.y - (this.#window.h / 2)

		if (!this.#layout.isValid)
			return

		if (!this.#context.isWindowNoDrag())
			this.beginDrag()

		this.drawWindow()
	}

	endWindow() {
		if (!this.#context.isWindowNoDrag())
			this.endDrag()

		this.#window.w = this.#layout.isValid ? this.#layout.w + this.#style.window.margins.h * 2 : 0
		this.#window.h = this.#layout.isValid ? this.#layout.h + this.#style.window.margins.v * 2 : 0

		this.#layout.isValid = this.#layout.w != 0 && this.#layout.h != 0
		this.#layout.isFirstWidget = true

		this.#layout.w = 0
		this.#layout.h = 0

		return [this.#window.x, this.#window.y]
	}

	drawWindow() {
		const outlineWidth = this.#style.window.outlineWidth
		const outlineHeight = outlineWidth * GetAspectRatio()

		this.move(-outlineWidth, -outlineHeight)
		this.setColor(this.#style.color.widget)
		this.drawRect(this.#window.w + outlineWidth * 2, this.#window.h + outlineHeight * 2)
		this.move(outlineWidth, outlineHeight)

		this.setColor(this.#style.color.window)
		this.drawRect(this.#window.w, this.#window.h)
	}

	beginDrag() {
		if (this.#drag.isInProcess)
			return

		const input = this.#context.getInput()

		if (input.isRectHovered(this._x, this._y, this.#window.w, this.#style.window.margins.v) && input.isMousePressed()) {
			this.#drag.origin.x = input.getMousePosX()
			this.#drag.origin.y = input.getMousePosY()

			this.#drag.isInProcess = true
		}
	}

	endDrag() {
		if (!this.#drag.isInProcess)
			return

		const input = this.#context.getInput()

		if (input.isMouseDown()) {
			const x = input.getMousePosX()
			const y = input.getMousePosY()

			this.#window.x = this.#window.x + x - this.#drag.origin.x
			this.#window.y = this.#window.y + y - this.#drag.origin.y

			this.#drag.origin.x = x
			this.#drag.origin.y = y
		}
		else
			this.#drag.isInProcess = false
	}

	getX() {
		return this._x
	}

	getY() {
		return this._y
	}

	beginRow() {
		if (!this.#row.isActive) {
			this.#row.isActive = true
			this.#row.isFirstWidget = true
		}
	}

	endRow() {
		if (!this.#row.isActive)
			return

		this.#layout.w = Math.max(this.#layout.w, this.#row.w)
		this.#layout.h = this.#layout.h + this.#row.h

		this.setPos(this.#window.x - (this.#window.w / 2) + this.#style.window.margins.h, this._y + this.#row.h)

		this.#row.isActive = false
		this.#row.isFirstWidget = true

		this.#row.w = 0
		this.#row.h = 0
	}

	isRowMode() {
		return this.#row.isActive
	}

	beginDraw(w, h) {
		if (this.#layout.isFirstWidget)
			this.move(this.#style.window.margins.h, this.#style.window.margins.v)
		else {
			let ho = 0
			if (!this.#row.isFirstWidget)
				ho = this.#style.window.spacing.h

			if (this.#row.isActive)
				this.#row.w = this.#row.w + ho
			else
				this.#layout.w = this.#layout.w + ho

			let vo = 0
			if (!this.#row.isActive || this.#row.isFirstWidget)
				vo = this.#style.window.spacing.v

			this.#layout.h = this.#layout.h + vo

			this.move(ho, vo)
		}

		this.#widget.x = this._x
		this.#widget.y = this._y
		this.#widget.w = w
		this.#widget.h = h
	}

	endDraw() {
		const w = this.#widget.w
		const h = this.#widget.h

		this.drawDebug(w, h)

		if (this.#row.isActive) {
			this.#row.w = this.#row.w + w
			this.#row.h = Math.max(this.#row.h, h)
			this.#row.isFirstWidget = false

			this.setPos(this.#widget.x + w, this.#widget.y)
		} else {
			this.#layout.w = Math.max(w, this.#layout.w)
			this.#layout.h = this.#layout.h + h
			this.#row.isFirstWidget = true

			this.setPos(this.#widget.x, this.#widget.y + h)
		}

		this.#layout.isFirstWidget = false
	}

	getWidgetX() {
		return this.#widget.x
	}

	getWidgetY() {
		return this.#widget.y
	}

	getWidgetWidth() {
		return this.#widget.w
	}

	getWidgetHeight() {
		return this.#widget.h
	}

	setPos(x, y) {
		this._x = x
		this._y = y
	}

	move(x, y) {
		this._x = this._x + x
		this._y = this._y + y
	}

	getStyle() {
		return this.#style
	}

	setColor(color) {
		this._color = color
	}

	drawRect(w, h) {
		if (this.#layout.isValid)
			DrawRect(this._x + w / 2, this._y + h / 2, w, h, this._color[0], this._color[1], this._color[2], this._color[3])
	}

	drawSprite(dict, name, w, h) {
		if (this.#layout.isValid)
			DrawSprite(dict, name, this._x + w / 2, this._y + h / 2, w, h, 0., this._color[0], this._color[1], this._color[2], this._color[3])
	}

	calculateTextWidth() {
		const textEntry = this.#context.getTextEntry()
		if (!textEntry)
			return 0

		BeginTextCommandGetWidth(textEntry)

		const textComponents = this.#context.getTextComponents()
		if (textComponents)
			addTextComponents(textComponents)

		return EndTextCommandGetWidth(true)
	}

	calculateTextLineHeight(scale, font) {
		scale ??= this.#style.widget.text.scale
		font ??= this.#style.widget.text.font

		return GetRenderedCharacterHeight(scale, font)
	}

	calculateTextLineCount() {
		const textEntry = this.#context.getTextEntry()
		if (!textEntry)
			return 0

		BeginTextCommandLineCount(textEntry)

		const textComponents = this.#context.getTextComponents()
		if (textComponents)
			addTextComponents(textComponents)

		return EndTextCommandLineCount(this._x, this._y)
	}

	setText(text) {
		if (text)
			this.#context.setNextTextEntry('STRING', text)
	}

	setTextOpts(font, scale) {
		if (!this.#context.getTextEntry())
			return

		font ??= this.#style.widget.text.font
		SetTextFont(font)

		scale ??= this.#style.widget.text.scale
		SetTextScale(scale * GetAspectRatio(), scale)
	}

	setTextMaxWidth(w) {
		if (this.#context.getTextEntry())
			SetTextWrap(this._x, this._x + w)
	}

	drawText(offset) {
		const textEntry = this.#context.getTextEntry()
		if (!textEntry)
			return

		SetTextColour(this._color[0], this._color[1], this._color[2], this._color[3])

		BeginTextCommandDisplayText(textEntry)

		const textComponents = this.#context.getTextComponents()
		if (textComponents)
			addTextComponents(textComponents)

		offset ??= this.#style.widget.text.offset
		EndTextCommandDisplayText(this._x, this._y - offset)
	}

	drawDebug(w, h) {
		if (w != 0 && this.#context.isDebugEnabled()) {
			this.setPos(this.#widget.x, this.#widget.y)
			this.setColor(this.#style.color.debug)
			h ??= this.#style.widget.height
			this.drawRect(w, h)
		}
	}
}
