import { Rect, Vector2 } from '../exports';
import { Input } from './input';
import { Painter } from './painter';

class NextItemState {
	constructor(public id: string | undefined = undefined, public width: number | undefined = undefined) {}
}

enum WindowFlags {
	None,
	NoDrag = 1 << 1,
	NoBackground = 1 << 2
}

class WindowFrameState {
	constructor(
		public id: string | undefined = undefined,
		public spacing: Vector2 | undefined = undefined,
		public windowFlags: WindowFlags = WindowFlags.None
	) {}
}

export class Context {
	private input = new Input();
	private painter = new Painter(this);
	private windowFrameState = new WindowFrameState();
	private nextItemState = new NextItemState();
	private itemWidthStack: number[] = [];
	private itemIdStack: string[] = [];
	private scheduleSkipNextDrawing = false;
	private skipNextDrawing = true;
	private isDebugEnabled_ = false;

	setDebugEnabled(enabled: boolean) {
		this.isDebugEnabled_ = enabled;
	}

	isDebugEnabled(): boolean {
		return this.isDebugEnabled_;
	}

	setWindowNoDrag(isNoDrag: boolean) {
		if (isNoDrag) this.windowFrameState.windowFlags |= WindowFlags.NoDrag;
		else this.windowFrameState.windowFlags &= ~WindowFlags.NoDrag;
	}

	setWindowNoBackground(isNoBackground: boolean) {
		if (isNoBackground) this.windowFrameState.windowFlags |= WindowFlags.NoBackground;
		else this.windowFrameState.windowFlags &= ~WindowFlags.NoBackground;
	}

	setWindowId(id: string) {
		this.windowFrameState.id = id;
	}

	setWindowSpacing(x: number, y: number) {
		this.windowFrameState.spacing = new Vector2(x, y);
	}

	isWindowNoDrag(): boolean {
		return !!(this.windowFrameState.windowFlags & WindowFlags.NoDrag);
	}

	isWindowNoBackground(): boolean {
		return !!(this.windowFrameState.windowFlags & WindowFlags.NoBackground);
	}

	getWindowId(): string | undefined {
		return this.windowFrameState.id;
	}

	getWindowSpacing(): Vector2 | undefined {
		return this.windowFrameState.spacing;
	}

	beginWindow(x: number, y: number) {
		this.windowFrameState = new WindowFrameState();

		this.input.beginWindow();
		this.painter.beginWindow(x, y);
	}

	endWindow(): Rect {
		const windowRect = this.painter.endWindow();

		if (this.scheduleSkipNextDrawing) {
			this.skipNextDrawing = true;
			this.scheduleSkipNextDrawing = false;
		} else this.skipNextDrawing = false;

		return windowRect;
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
		this.scheduleSkipNextDrawing = true;
	}

	isWindowSkipNextDrawing(): boolean {
		return this.skipNextDrawing;
	}

	beginItem(w: number, h: number) {
		this.painter.beginItem(w, h);
	}

	endItem() {
		this.painter.endItem();

		this.nextItemState = new NextItemState();
	}

	setNextItemWidth(w: number) {
		this.nextItemState.width = w;
	}

	pushItemWidth(w: number) {
		this.itemWidthStack.push(w);
	}

	popItemWidth() {
		this.itemWidthStack.pop();
	}

	tryGetItemWidth(): number | undefined {
		return this.nextItemState.width ?? this.itemWidthStack[this.itemWidthStack.length - 1];
	}

	setNextItemId(id: string) {
		this.nextItemState.id = id;
	}

	pushItemId(id: string) {
		this.itemIdStack.push(id);
	}

	popItemId() {
		this.itemIdStack.pop();
	}

	tryGetItemId(): string | undefined {
		return this.nextItemState.id ?? this.itemIdStack[this.itemIdStack.length - 1];
	}

	getInput(): Input {
		return this.input;
	}

	getPainter(): Painter {
		return this.painter;
	}
}
