import { PositionInterface, TextEntryComponents } from '../common/types';
import { Input } from './input';
import { Painter } from './painter';

class TextDrawState {
	constructor(public entry: string, public components: TextEntryComponents) {}
}

class DrawState {
	text?: TextDrawState;
	widgetWidth?: number;

	endDraw() {
		this.text = undefined;
		this.widgetWidth = undefined;
	}
}

enum WindowFlags {
	None,
	NoDrag = 1 << 1,
	NoBackground = 1 << 2
}

class WindowState {
	text?: TextDrawState;
	widgetWidth?: number;
	windowFlags: WindowFlags = WindowFlags.None;
	skipDrawingNumber = 1;

	endWindow() {
		this.text = undefined;
		this.widgetWidth = undefined;
		this.windowFlags = WindowFlags.None;
		if (this.skipDrawingNumber != 0) --this.skipDrawingNumber;
	}
}

export class Context {
	private input = new Input();
	private painter = new Painter(this);
	private state = new WindowState();
	private nextState = new DrawState();

	setWindowNoDrag(isNoDrag: boolean) {
		if (isNoDrag) this.state.windowFlags |= WindowFlags.NoDrag;
		else this.state.windowFlags &= ~WindowFlags.NoDrag;
	}

	setWindowNoBackground(isNoBackground: boolean) {
		if (isNoBackground) this.state.windowFlags |= WindowFlags.NoBackground;
		else this.state.windowFlags &= ~WindowFlags.NoBackground;
	}

	isWindowNoDrag(): boolean {
		return !!(this.state.windowFlags & WindowFlags.NoDrag);
	}

	isWindowNoBackground(): boolean {
		return !!(this.state.windowFlags & WindowFlags.NoBackground);
	}

	beginWindow(x?: number, y?: number) {
		this.input.beginWindow();
		this.painter.beginWindow(x ?? 0.5, y ?? 0.5);
	}

	endWindow(): PositionInterface {
		const windowPos = this.painter.endWindow();

		this.input.endWindow();

		this.state.endWindow();

		return windowPos;
	}

	isWidgetHovered(): boolean {
		return this.input.isRectHovered(
			this.painter.getWidgetX(),
			this.painter.getWidgetY(),
			this.painter.getWidgetWidth(),
			this.painter.getWidgetHeight()
		);
	}

	isWidgetClicked(): boolean {
		return this.input.getIsLmbPressed() && this.isWidgetHovered();
	}

	setWindowSkipNextDrawing() {
		this.state.skipDrawingNumber = 2;
	}

	isWindowSkipNextDrawing(): boolean {
		return this.state.skipDrawingNumber != 0;
	}

	beginDraw(w: number, h: number) {
		this.painter.beginDraw(w, h);
	}

	endDraw() {
		this.painter.endDraw();

		this.nextState.endDraw();
	}

	setNextTextEntry(entry: string, ...components: TextEntryComponents) {
		this.nextState.text = {
			entry: entry,
			components: components
		};
	}

	pushTextEntry(entry: string, ...components: TextEntryComponents) {
		this.state.text = {
			entry: entry,
			components: components
		};
	}

	popTextEntry() {
		this.state.text = undefined;
	}

	getTextEntry(): string | undefined {
		if (this.nextState.text) return this.nextState.text.entry;
		if (this.state.text) return this.state.text.entry;
		return undefined;
	}

	getTextComponents(): TextEntryComponents | undefined {
		if (this.nextState.text) return this.nextState.text.components;
		if (this.state.text) return this.state.text.components;
		return undefined;
	}

	setNextWidgetWidth(w: number) {
		this.nextState.widgetWidth = w;
	}

	pushWidgetWidth(w: number) {
		this.state.widgetWidth = w;
	}

	popWidgetWidth() {
		this.state.widgetWidth = undefined;
	}

	getWidgetWidth(): number | undefined {
		return this.nextState.widgetWidth ?? this.state.widgetWidth;
	}

	getInput(): Input {
		return this.input;
	}

	getPainter(): Painter {
		return this.painter;
	}
}
