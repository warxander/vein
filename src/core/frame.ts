import { Color, Rect, Vector2 } from './types';
import { Input, InputFlags, InputKey } from './input';
import { Layout } from './layout';
import { Painter } from './painter';
import { Style, StylePropertyValue } from './style';
import { drawItemBackground } from './utils';

class ItemState {
	id: string | undefined = undefined;
	width: number | undefined = undefined;
}

enum FrameFlags {
	None,
	FixedPosition = 1 << 1,
	BackgroundDisabled = 1 << 2
}

class FrameState {
	id: string | undefined = undefined;
	spacing: Vector2 | undefined = undefined;
	flags = FrameFlags.None;
	inputFlags = InputFlags.None;
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

export class Frame {
	private static style = new Style();
	private static rect = new Rect();
	private static dragPosition: Vector2 | null = null;
	private static nextState = new FrameState();
	private static isDebugEnabled_ = false;

	private input = new Input(Frame.nextState.inputFlags);
	private painter = new Painter();
	private nextItemState = new ItemState();
	private mouseCursor = MouseCursor.Normal;
	private itemWidthStack: number[] = [];
	private itemIdStack: string[] = [];

	private layout: Layout;

	static isDebugEnabled(): boolean {
		return Frame.isDebugEnabled_;
	}

	static setDebugEnabled(enabled: boolean) {
		Frame.isDebugEnabled_ = enabled;
	}

	static setNextFramePositionFixed() {
		Frame.nextState.flags |= FrameFlags.FixedPosition;
	}

	static setNextFrameDisableBackground() {
		Frame.nextState.flags |= FrameFlags.BackgroundDisabled;
	}

	static setNextFrameId(id: string) {
		Frame.nextState.id = id;
	}

	static setNextFrameSpacing(x: number, y: number) {
		Frame.nextState.spacing = new Vector2(x, y);
	}

	static setNextFrameDisableInput() {
		Frame.nextState.inputFlags |= InputFlags.DisableInput;
	}

	static getStyle(): Style {
		return Frame.style;
	}

	static getRect(): Rect {
		return Frame.rect;
	}

	static getId(): string | undefined {
		return Frame.nextState.id;
	}

	static getSpacing(): Vector2 {
		return Frame.nextState.spacing ?? Frame.style.frame.spacing;
	}

	static isPositionFixed(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.FixedPosition);
	}

	static isBackgroundDisabled(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.BackgroundDisabled);
	}

	static isInputDisabled(): boolean {
		return !!(Frame.nextState.inputFlags & InputFlags.DisableInput);
	}

	static getStyleProperty(selector: string, property: string): StylePropertyValue {
		return Frame.style.getProperty(selector, property);
	}

	constructor(x: number, y: number) {
		Frame.rect.position = new Vector2(x, y);

		this.beginDrag();

		this.layout = new Layout(x + Frame.style.frame.margins.x, y + Frame.style.frame.margins.y, Frame.getSpacing());

		this.painter.setPosition(x, y);

		if (!Frame.isBackgroundDisabled())
			drawItemBackground(this, Frame.nextState.id ?? 'frame', Frame.rect.size.x, Frame.rect.size.y);
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

	end() {
		this.endDrag();

		if (!Frame.isInputDisabled()) {
			SetMouseCursorActiveThisFrame();
			SetMouseCursorSprite(this.mouseCursor);
		}

		this.mouseCursor = MouseCursor.Normal;

		const contentRect = this.layout.getContentRect();
		Frame.rect.size = new Vector2(
			contentRect.size.x + Frame.style.frame.margins.x * 2,
			contentRect.size.y + Frame.style.frame.margins.y * 2
		);

		this.itemIdStack = [];
		this.itemWidthStack = [];

		Frame.nextState = new FrameState();
	}

	beginItem(w: number, h: number) {
		this.layout.beginItem(w, h);

		const itemRect = this.layout.getItemRect();
		this.painter.setPosition(itemRect.position.x, itemRect.position.y);
	}

	endItem() {
		if (Frame.isDebugEnabled_) {
			const itemRect = this.layout.getItemRect();

			this.painter.setPosition(itemRect.position.x, itemRect.position.y);
			this.painter.setColor(Frame.style.getPropertyAs<Color>('frame', 'color'));
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

	isItemHovered(): boolean {
		return this.layout.getItemRect().contains(this.input.getMousePosition());
	}

	isItemClicked(): boolean {
		return this.input.isKeyPressed(InputKey.LeftMouseButton) && this.isItemHovered();
	}

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	buildStyleSelector(class_: string, subClass: string | undefined = undefined): string {
		const id = this.nextItemState.id ?? this.itemIdStack[this.itemIdStack.length - 1];
		return Frame.style.buildSelector(class_, id, subClass);
	}

	private beginDrag() {
		if (Frame.isPositionFixed() || Frame.isInputDisabled()) return;

		const mousePosition = this.input.getMousePosition();

		if (
			!new Rect(Frame.rect.position, new Vector2(Frame.rect.size.x, Frame.style.frame.margins.y)).contains(
				mousePosition
			)
		)
			return;

		if (!Frame.dragPosition) {
			if (this.input.isKeyPressed(InputKey.LeftMouseButton)) {
				Frame.dragPosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!this.input.isKeyDown(InputKey.LeftMouseButton)) {
			Frame.dragPosition = null;
		}

		if (!Frame.dragPosition) this.mouseCursor = MouseCursor.PreGrab;
	}

	private endDrag() {
		if (!Frame.dragPosition) return;

		const mousePosition = this.input.getMousePosition();

		Frame.rect.position.x += mousePosition.x - Frame.dragPosition.x;
		Frame.rect.position.y += mousePosition.y - Frame.dragPosition.y;

		Frame.dragPosition = new Vector2(mousePosition.x, mousePosition.y);

		this.mouseCursor = MouseCursor.Grab;
	}
}

let frame: Frame | null = null;

export function getFrameChecked(): Frame {
	if (!frame) throw new Error('Frame is null');
	return frame;
}

export function setFrame(frame_: Frame | null) {
	frame = frame_;
}
