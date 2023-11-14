import { Color, Rect, Vector2 } from './core/types';
import { Input, InputKey } from './core/input';
import { Layout } from './core/layout';
import { Painter } from './core/painter';
import { Style } from './core/style';

class ItemState {
	id: string | undefined = undefined;
	width: number | undefined = undefined;
}

enum WindowFlags {
	None,
	NoDrag = 1 << 1,
	NoBackground = 1 << 2
}

class WindowState {
	id: string | undefined = undefined;
	spacing: Vector2 | undefined = undefined;
	windowFlags = WindowFlags.None;
}

export enum MouseCursor {
	None = 0,
	Normal = 1,
	TransparentNormal = 2,
	PreGrab = 3,
	Grab = 4,
	MiddleFinger = 5,
	LeftArrow = 6,
	RightArrow = 7,
	UpArrow = 8,
	DownArrow = 9,
	HorizontalExpand = 10,
	Add = 11,
	Remove = 12
}

export class Ui {
	private static style = new Style();
	private static windowRect = new Rect();
	private static windowDragPosition: Vector2 | null = null;
	private static nextWindowState = new WindowState();
	private static isDebugEnabled_ = false;

	private input = new Input();
	private painter = new Painter();
	private nextItemState = new ItemState();
	private mouseCursor = MouseCursor.Normal;
	private itemWidthStack: number[] = [];
	private itemIdStack: string[] = [];

	private layout: Layout;

	static setDebugEnabled(enabled: boolean) {
		Ui.isDebugEnabled_ = enabled;
	}

	static isDebugEnabled(): boolean {
		return Ui.isDebugEnabled_;
	}

	static setNextWindowNoDrag(isNoDrag: boolean) {
		if (isNoDrag) Ui.nextWindowState.windowFlags |= WindowFlags.NoDrag;
		else Ui.nextWindowState.windowFlags &= ~WindowFlags.NoDrag;
	}

	static setNextWindowNoBackground(isNoBackground: boolean) {
		if (isNoBackground) Ui.nextWindowState.windowFlags |= WindowFlags.NoBackground;
		else Ui.nextWindowState.windowFlags &= ~WindowFlags.NoBackground;
	}

	static setNextWindowId(id: string) {
		Ui.nextWindowState.id = id;
	}

	static setNextWindowSpacing(x: number, y: number) {
		Ui.nextWindowState.spacing = new Vector2(x, y);
	}

	static getStyle(): Style {
		return Ui.style;
	}

	static getWindowRect(): Rect {
		return Ui.windowRect;
	}

	static getWindowId(): string | undefined {
		return Ui.nextWindowState.id;
	}

	static getWindowSpacing(): Vector2 {
		return Ui.nextWindowState.spacing ?? Ui.style.window.spacing;
	}

	static isWindowNoDrag(): boolean {
		return !!(Ui.nextWindowState.windowFlags & WindowFlags.NoDrag);
	}

	static isWindowNoBackground(): boolean {
		return !!(Ui.nextWindowState.windowFlags & WindowFlags.NoBackground);
	}

	constructor(x: number, y: number) {
		Ui.windowRect.position = new Vector2(x, y);

		this.beginWindowDrag();

		this.layout = new Layout(x + Ui.style.window.margins.x, y + Ui.style.window.margins.y, Ui.getWindowSpacing());

		this.painter.setPosition(x, y);

		if (!Ui.isWindowNoBackground())
			this.painter.drawItemBackground(
				Ui.style.getProperties(Ui.nextWindowState.id ?? 'window'),
				Ui.windowRect.size.x,
				Ui.windowRect.size.y
			);
	}

	end() {
		SetMouseCursorActiveThisFrame();
		SetMouseCursorSprite(this.mouseCursor);

		this.endWindowDrag();

		const contentRect = this.layout.getContentRect();
		Ui.windowRect.size = new Vector2(
			contentRect.size.x + Ui.style.window.margins.x * 2,
			contentRect.size.y + Ui.style.window.margins.y * 2
		);

		this.itemIdStack = [];
		this.itemWidthStack = [];

		Ui.nextWindowState = new WindowState();
	}

	isItemHovered(): boolean {
		return this.layout.getItemRect().contains(this.input.getMousePosition());
	}

	isItemClicked(): boolean {
		return this.input.isKeyPressed(InputKey.LeftMouseButton) && this.isItemHovered();
	}

	beginItem(w: number, h: number) {
		this.layout.beginItem(w, h);

		const itemRect = this.layout.getItemRect();
		this.painter.setPosition(itemRect.position.x, itemRect.position.y);
	}

	endItem() {
		if (Ui.isDebugEnabled_) {
			const itemRect = this.layout.getItemRect();

			this.painter.setPosition(itemRect.position.x, itemRect.position.y);
			this.painter.setColor(Ui.style.getProperty<Color>('window', 'color'));
			this.painter.drawRect(itemRect.size.x, itemRect.size.y);
		}

		this.layout.endItem();

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

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	getInput(): Input {
		return this.input;
	}

	getPainter(): Painter {
		return this.painter;
	}

	getLayout(): Layout {
		return this.layout;
	}

	private beginWindowDrag() {
		if (Ui.isWindowNoDrag()) return;

		const mousePosition = this.input.getMousePosition();

		if (
			!new Rect(Ui.windowRect.position, new Vector2(Ui.windowRect.size.x, Ui.style.window.margins.y)).contains(
				mousePosition
			)
		)
			return;

		if (!Ui.windowDragPosition) {
			if (this.input.isKeyPressed(InputKey.LeftMouseButton)) {
				Ui.windowDragPosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!this.input.isKeyDown(InputKey.LeftMouseButton)) {
			Ui.windowDragPosition = null;
		}

		if (!Ui.windowDragPosition) this.mouseCursor = MouseCursor.PreGrab;
	}

	private endWindowDrag() {
		if (!Ui.windowDragPosition) return;

		const mousePosition = this.input.getMousePosition();

		Ui.windowRect.position.x += mousePosition.x - Ui.windowDragPosition.x;
		Ui.windowRect.position.y += mousePosition.y - Ui.windowDragPosition.y;

		Ui.windowDragPosition = new Vector2(mousePosition.x, mousePosition.y);

		this.mouseCursor = MouseCursor.Grab;
	}
}

let ui: Ui | null = null;

export function getUiChecked(): Ui {
	if (!ui) throw new Error('Ui is null');
	return ui;
}

export function setUi(ui_: Ui | null) {
	ui = ui_;
}
