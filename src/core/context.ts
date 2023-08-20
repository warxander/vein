import { PositionInterface, TextEntryComponents } from '../common/types';
import { Input } from './input';
import { Painter } from './painter';

class Text {
	constructor(public entry: string, public components: TextEntryComponents) {}
}

class NextItemState {
	text?: Text;
	itemWidth?: number;

	reset() {
		this.text = undefined;
		this.itemWidth = undefined;
	}
}

enum WindowFlags {
	None,
	NoDrag = 1 << 1,
	NoBackground = 1 << 2
}

class WindowFrameState {
	windowFlags: WindowFlags = WindowFlags.None;

	reset() {
		this.windowFlags = WindowFlags.None;
	}
}

export class Context {
	private input = new Input();
	private painter = new Painter(this);
	private windowFrameState = new WindowFrameState();
	private nextItemState = new NextItemState();
	private itemWidthStack: number[] = [];
	private textStack: Text[] = [];
	private skipDrawingNumber = 1;

	setWindowNoDrag(isNoDrag: boolean) {
		if (isNoDrag) this.windowFrameState.windowFlags |= WindowFlags.NoDrag;
		else this.windowFrameState.windowFlags &= ~WindowFlags.NoDrag;
	}

	setWindowNoBackground(isNoBackground: boolean) {
		if (isNoBackground) this.windowFrameState.windowFlags |= WindowFlags.NoBackground;
		else this.windowFrameState.windowFlags &= ~WindowFlags.NoBackground;
	}

	isWindowNoDrag(): boolean {
		return !!(this.windowFrameState.windowFlags & WindowFlags.NoDrag);
	}

	isWindowNoBackground(): boolean {
		return !!(this.windowFrameState.windowFlags & WindowFlags.NoBackground);
	}

	beginWindow(x?: number, y?: number) {
		this.input.beginWindow();
		this.painter.beginWindow(x ?? 0.5, y ?? 0.5);
	}

	endWindow(): PositionInterface {
		const windowPos = this.painter.endWindow();

		this.input.endWindow();

		this.windowFrameState.reset();
		if (this.skipDrawingNumber != 0) --this.skipDrawingNumber;

		return windowPos;
	}

	isItemHovered(): boolean {
		return this.input.isRectHovered(
			this.painter.getItemX(),
			this.painter.getItemY(),
			this.painter.getItemWidth(),
			this.painter.getItemHeight()
		);
	}

	isItemClicked(): boolean {
		return this.input.getIsLmbPressed() && this.isItemHovered();
	}

	setWindowSkipNextDrawing() {
		this.skipDrawingNumber = 2;
	}

	isWindowSkipNextDrawing(): boolean {
		return this.skipDrawingNumber != 0;
	}

	beginDraw(w: number, h: number) {
		this.painter.beginDraw(w, h);
	}

	endDraw() {
		this.painter.endDraw();

		this.nextItemState.reset();
	}

	setNextTextEntry(entry: string, ...components: TextEntryComponents) {
		this.nextItemState.text = {
			entry: entry,
			components: components
		};
	}

	pushTextEntry(entry: string, ...components: TextEntryComponents) {
		this.textStack.push({
			entry: entry,
			components: components
		});
	}

	popTextEntry() {
		this.textStack.pop();
	}

	getTextEntry(): string | undefined {
		if (this.nextItemState.text) return this.nextItemState.text.entry;
		return this.textStack[this.textStack.length - 1]?.entry;
	}

	getTextComponents(): TextEntryComponents | undefined {
		if (this.nextItemState.text) return this.nextItemState.text.components;
		return this.textStack[this.textStack.length - 1]?.components;
	}

	setNextItemWidth(w: number) {
		this.nextItemState.itemWidth = w;
	}

	pushItemWidth(w: number) {
		this.itemWidthStack.push(w);
	}

	popItemWidth() {
		this.itemWidthStack.pop();
	}

	getItemWidth(): number | undefined {
		return this.nextItemState.itemWidth ?? this.itemWidthStack[this.itemWidthStack.length - 1];
	}

	getInput(): Input {
		return this.input;
	}

	getPainter(): Painter {
		return this.painter;
	}
}
