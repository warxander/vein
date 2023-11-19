import { Color, Rect, Vector2 } from './types';
import { Input, InputFlags, InputKey } from './input';
import { Layout } from './layout';
import { Painter } from './painter';
import { Style, StylePropertyValue } from './style';
import { drawItemBackground } from './utils';

class ItemState {
	styleId: string | undefined = undefined;
	width: number | undefined = undefined;
}

enum FrameFlags {
	None,
	DisableMove = 1 << 1,
	BackgroundDisabled = 1 << 2
}

class FrameState {
	position: Vector2 | undefined = undefined;
	styleId: string | undefined = undefined;
	spacing: Vector2 | undefined = undefined;
	flags = FrameFlags.None;
	inputFlags = InputFlags.None;
}

class FrameMemory {
	rect = new Rect(new Vector2(0.33, 0.33));
	movePosition: Vector2 | null = null;
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
	private static readonly DEFAULT_ID = 'DEFAULT';

	private static frameMemory = new Map<string, FrameMemory>();
	private static style = new Style();
	private static nextState = new FrameState();
	private static isDebugEnabled_ = false;

	private memory: FrameMemory;
	private input = new Input(Frame.nextState.inputFlags);
	private painter: Painter;
	private nextItemState = new ItemState();
	private mouseCursor = MouseCursor.Normal;
	private itemWidthStack: number[] = [];
	private itemStyleIdStack: string[] = [];

	private layout: Layout;

	static isDebugEnabled(): boolean {
		return Frame.isDebugEnabled_;
	}

	static setDebugEnabled(enabled: boolean) {
		Frame.isDebugEnabled_ = enabled;
	}

	static setNextFramePosition(x: number, y: number) {
		Frame.nextState.position = new Vector2(x, y);
	}

	static setNextFrameSpacing(x: number, y: number) {
		Frame.nextState.spacing = new Vector2(x, y);
	}

	static setNextFrameStyleId(id: string) {
		Frame.nextState.styleId = id;
	}

	static setNextFrameDisableBackground() {
		Frame.nextState.flags |= FrameFlags.BackgroundDisabled;
	}

	static setNextFrameDisableInput() {
		Frame.nextState.inputFlags |= InputFlags.DisableInput;
	}

	static setNextFrameDisableMove() {
		Frame.nextState.flags |= FrameFlags.DisableMove;
	}

	static getStyle(): Style {
		return Frame.style;
	}

	static getStyleId(): string | undefined {
		return Frame.nextState.styleId;
	}

	static getSpacing(): Vector2 {
		return Frame.nextState.spacing ?? Frame.style.frame.spacing;
	}

	static isMoveDisabled(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.DisableMove);
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

	constructor(id: string | undefined) {
		if (id === undefined) id = Frame.DEFAULT_ID;

		let memory = Frame.frameMemory.get(id);
		if (memory === undefined) {
			memory = new FrameMemory();
			Frame.frameMemory.set(id, memory);
		}

		this.memory = memory;

		if (Frame.nextState.position !== undefined) {
			this.memory.rect.position.x = Frame.nextState.position.x;
			this.memory.rect.position.y = Frame.nextState.position.y;
		}

		this.beginMove();

		const rect = this.getRect();

		this.layout = new Layout(
			rect.position.x + Frame.style.frame.margins.x,
			rect.position.y + Frame.style.frame.margins.y,
			Frame.getSpacing()
		);

		this.painter = new Painter(`VEIN_${id}`);
		this.painter.setPosition(rect.position.x, rect.position.y);

		if (!Frame.isBackgroundDisabled())
			drawItemBackground(this, Frame.nextState.styleId ?? 'frame', rect.size.x, rect.size.y);
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

	getRect(): Rect {
		return this.memory.rect;
	}

	end() {
		this.endMove();

		if (!Frame.isInputDisabled()) {
			SetMouseCursorActiveThisFrame();
			SetMouseCursorSprite(this.mouseCursor);
		}

		this.mouseCursor = MouseCursor.Normal;

		const contentRect = this.layout.getContentRect();
		this.memory.rect.size = new Vector2(
			contentRect.size.x + Frame.style.frame.margins.x * 2,
			contentRect.size.y + Frame.style.frame.margins.y * 2
		);

		this.itemStyleIdStack = [];
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

	setNextItemStyleId(id: string) {
		this.nextItemState.styleId = id;
	}

	pushItemStyleId(id: string) {
		this.itemStyleIdStack.push(id);
	}

	popItemStyleId() {
		this.itemStyleIdStack.pop();
	}

	isAreaHovered(rect: Rect): boolean {
		return rect.contains(this.input.getMousePosition());
	}

	isItemHovered(): boolean {
		return this.isAreaHovered(this.layout.getItemRect());
	}

	isItemClicked(): boolean {
		return this.input.isKeyPressed(InputKey.MouseLeftButton) && this.isItemHovered();
	}

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	buildStyleSelector(class_: string, subClass: string | undefined = undefined): string {
		const styleId = this.nextItemState.styleId ?? this.itemStyleIdStack[this.itemStyleIdStack.length - 1];
		return Frame.style.buildSelector(class_, styleId, subClass);
	}

	private beginMove() {
		if (Frame.isMoveDisabled() || Frame.isInputDisabled()) return;

		if (
			!this.isAreaHovered(
				new Rect(this.memory.rect.position, new Vector2(this.memory.rect.size.x, Frame.style.frame.margins.y))
			)
		)
			return;

		if (!this.memory.movePosition) {
			if (this.input.isKeyPressed(InputKey.MouseLeftButton)) {
				const mousePosition = this.input.getMousePosition();
				this.memory.movePosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!this.input.isKeyDown(InputKey.MouseLeftButton)) {
			this.memory.movePosition = null;
		}

		if (!this.memory.movePosition) this.mouseCursor = MouseCursor.PreGrab;
	}

	private endMove() {
		if (!this.memory.movePosition) return;

		const mousePosition = this.input.getMousePosition();

		this.memory.rect.position.x += mousePosition.x - this.memory.movePosition.x;
		this.memory.rect.position.y += mousePosition.y - this.memory.movePosition.y;

		this.memory.movePosition = new Vector2(mousePosition.x, mousePosition.y);

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
