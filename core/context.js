function setTextEntry(state, entry, ...args) {
	state.textEntry = entry;
	state.textComponents = args;
}

function setWidgetWidth(state, w) {
	state.widgetWidth = w;
}

class Context {
	#input;
	#painter;
	#isDebug;
	#state;
	#nextState;

	constructor() {
		this.#input = new Input();
		this.#painter = new Painter(this);

		this.#isDebug = false;
		this.#state = {};
		this.#nextState = {};
	}

	setNextWindowNoDrag(isNoDrag) {
		this.#state.isNoDrag = isNoDrag;
	}

	isWindowNoDrag() {
		return this.#state.isNoDrag;
	}

	beginWindow(windowPos) {
		this.#input.beginWindow();
		this.#painter.beginWindow(windowPos);
	}

	endWindow() {
		const windowPos = this.#painter.endWindow();

		this.#input.endWindow();

		this.#state = {};

		return windowPos;
	}

	isWidgetHovered() {
		return this.#input.isRectHovered(
			this.#painter.getWidgetX(),
			this.#painter.getWidgetY(),
			this.#painter.getWidgetWidth(),
			this.#painter.getWidgetHeight()
		);
	}

	isWidgetClicked() {
		return this.#input.isMousePressed() && this.isWidgetHovered();
	}

	beginDraw(w, h) {
		this.#painter.beginDraw(w, h);
	}

	endDraw() {
		this.#painter.endDraw();

		this.#nextState = {};
	}

	setDebugEnabled(enabled) {
		this.#isDebug = enabled;
	}

	isDebugEnabled() {
		return this.#isDebug;
	}

	setNextTextEntry(entry, ...args) {
		setTextEntry(this.#nextState, entry, ...args);
	}

	pushTextEntry(entry, ...args) {
		setTextEntry(this.#state, entry, ...args);
	}

	popTextEntry() {
		this.#state.textEntry = null;
		this.#state.textComponents = null;
	}

	getTextEntry() {
		return this.#nextState.textEntry || this.#state.textEntry;
	}

	getTextComponents() {
		return this.#nextState.textComponents || this.#state.textComponents;
	}

	setNextWidgetWidth(w) {
		setWidgetWidth(this.#nextState, w);
	}

	pushWidgetWidth(w) {
		setWidgetWidth(this.#state, w);
	}

	popWidgetWidth() {
		this.#state.widgetWidth = nil;
	}

	getWidgetWidth() {
		return this.#nextState.widgetWidth || this.#state.widgetWidth;
	}

	getInput() {
		return this.#input;
	}

	getPainter() {
		return this.#painter;
	}
}
