import { PositionObject, TextEntryComponents } from '../common/types';
import { Input } from './input';
import { Painter } from './painter';

class TextDrawState {
	entry: string;
	components: TextEntryComponents;

	constructor(entry: string, components: TextEntryComponents) {
		this.entry = entry;
		this.components = components;
	}
}

class DrawState {
	text?: TextDrawState;
	widgetWidth?: number;

	reset(): void {
		this.text = undefined;
		this.widgetWidth = undefined;
	}
}

class WindowState {
	text?: TextDrawState;
	widgetWidth?: number;
	isNoDrag: boolean;

	constructor() {
		this.isNoDrag = false;
	}

	reset(): void {
		this.text = undefined;
		this.widgetWidth = undefined;
		this.isNoDrag = false;
	}
}

export class Context {
	#input: Input;
	#painter: Painter;
	#isDebugEnabled: boolean;
	#state: WindowState;
	#nextState: DrawState;

	constructor() {
		this.#input = new Input();
		this.#painter = new Painter(this);

		this.#isDebugEnabled = false;

		this.#state = new WindowState();
		this.#nextState = new DrawState();
	}

	setNextWindowNoDrag(isNoDrag: boolean): void {
		this.#state.isNoDrag = isNoDrag;
	}

	isWindowNoDrag(): boolean {
		return this.#state.isNoDrag;
	}

	beginWindow(x?: number, y?: number): void {
		this.#input.beginWindow();
		this.#painter.beginWindow(x ?? 0.5, y ?? 0.5);
	}

	endWindow(): PositionObject {
		const windowPos = this.#painter.endWindow();

		this.#input.endWindow();

		this.#state.reset();

		return windowPos;
	}

	isWidgetHovered(): boolean {
		return this.#input.isRectHovered(
			this.#painter.getWidgetX(),
			this.#painter.getWidgetY(),
			this.#painter.getWidgetWidth(),
			this.#painter.getWidgetHeight()
		);
	}

	isWidgetClicked(): boolean {
		return this.#input.getIsLmbPressed() && this.isWidgetHovered();
	}

	beginDraw(w: number, h: number): void {
		this.#painter.beginDraw(w, h);
	}

	endDraw(): void {
		this.#painter.endDraw();

		this.#nextState.reset();
	}

	setDebugEnabled(enabled: boolean): void {
		this.#isDebugEnabled = enabled;
	}

	isDebugEnabled(): boolean {
		return this.#isDebugEnabled;
	}

	setNextTextEntry(entry: string, ...components: TextEntryComponents): void {
		this.#nextState.text = {
			entry: entry,
			components: components
		};
	}

	pushTextEntry(entry: string, ...components: TextEntryComponents): void {
		this.#state.text = {
			entry: entry,
			components: components
		};
	}

	popTextEntry(): void {
		this.#state.text = undefined;
	}

	getTextEntry(): string | undefined {
		if (this.#nextState.text) return this.#nextState.text.entry;
		if (this.#state.text) return this.#state.text.entry;
		return undefined;
	}

	getTextComponents(): TextEntryComponents | undefined {
		if (this.#nextState.text) return this.#nextState.text.components;
		if (this.#state.text) return this.#state.text.components;
		return undefined;
	}

	setNextWidgetWidth(w: number): void {
		this.#nextState.widgetWidth = w;
	}

	pushWidgetWidth(w: number): void {
		this.#state.widgetWidth = w;
	}

	popWidgetWidth(): void {
		this.#state.widgetWidth = undefined;
	}

	getWidgetWidth(): number | undefined {
		return this.#nextState.widgetWidth ?? this.#state.widgetWidth;
	}

	getInput(): Input {
		return this.#input;
	}

	getPainter(): Painter {
		return this.#painter;
	}
}
