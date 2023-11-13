import { Rect, Vector2 } from '../exports';
import { Input, InputKey } from './input';
import { Painter } from './painter';

class ItemState {
	constructor(public id: string | undefined = undefined, public width: number | undefined = undefined) {}
}

enum WindowFlags {
	None,
	NoDrag = 1 << 1,
	NoBackground = 1 << 2
}

class WindowState {
	constructor(
		public id: string | undefined = undefined,
		public spacing: Vector2 | undefined = undefined,
		public windowFlags = WindowFlags.None
	) {}
}

export class Context {
	private input = new Input();
	private painter = new Painter(this);
	private nextWindowState = new WindowState();
	private nextItemState = new ItemState();
	private itemWidthStack: number[] = [];
	private itemIdStack: string[] = [];
	private isDebugEnabled_ = false;

	setDebugEnabled(enabled: boolean) {
		this.isDebugEnabled_ = enabled;
	}

	isDebugEnabled(): boolean {
		return this.isDebugEnabled_;
	}

	setNextWindowNoDrag(isNoDrag: boolean) {
		if (isNoDrag) this.nextWindowState.windowFlags |= WindowFlags.NoDrag;
		else this.nextWindowState.windowFlags &= ~WindowFlags.NoDrag;
	}

	setNextWindowNoBackground(isNoBackground: boolean) {
		if (isNoBackground) this.nextWindowState.windowFlags |= WindowFlags.NoBackground;
		else this.nextWindowState.windowFlags &= ~WindowFlags.NoBackground;
	}

	setNextWindowId(id: string) {
		this.nextWindowState.id = id;
	}

	setNextWindowSpacing(x: number, y: number) {
		this.nextWindowState.spacing = new Vector2(x, y);
	}

	isWindowNoDrag(): boolean {
		return !!(this.nextWindowState.windowFlags & WindowFlags.NoDrag);
	}

	isWindowNoBackground(): boolean {
		return !!(this.nextWindowState.windowFlags & WindowFlags.NoBackground);
	}

	getWindowId(): string | undefined {
		return this.nextWindowState.id;
	}

	getWindowSpacing(): Vector2 | undefined {
		return this.nextWindowState.spacing;
	}

	beginWindow(x: number, y: number) {
		this.input.beginWindow();
		this.painter.beginWindow(x, y);
	}

	endWindow(): Rect {
		const windowRect = this.painter.endWindow();

		this.itemIdStack = [];
		this.itemWidthStack = [];

		this.nextWindowState = new WindowState();

		return windowRect;
	}

	isItemHovered(): boolean {
		return this.painter.getItemRect().contains(this.input.getMousePosition());
	}

	isItemClicked(): boolean {
		return this.input.isKeyPressed(InputKey.LeftMouseButton) && this.isItemHovered();
	}

	beginItem(w: number, h: number) {
		this.painter.beginItem(w, h);
	}

	endItem() {
		this.painter.endItem();

		this.nextItemState = new ItemState();
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
