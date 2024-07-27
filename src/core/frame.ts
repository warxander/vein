import { Color, MouseCursor, Rect, Vector2 } from './types';
import { Input, InputControl } from './input';
import { Layout } from './layout';
import { Painter } from './painter';
import { Style } from './style';
import { drawItemBackground } from './utils';

enum FrameDrawOrder {
	Background = 1,
	Ui = 2,
	DragAndDrop = 7
}

class ItemDragState {
	isDropped = false;
	isDragged = true;
	payload: string | null = null;

	constructor(public readonly id: string) {}
}

class FrameOptions {
	position: Vector2 | undefined = undefined;
	scale: number | undefined = undefined;
	size: [number | undefined, number | undefined] | undefined = undefined;
	spacing: [number | undefined, number | undefined] | undefined = undefined;
	disableBackground = false;
	disableBorder = false;
	disableInput = false;
	disableMove = false;
	styleId: string | undefined = undefined;
}

class ItemOptions {
	isDisabled = false;
	position: Vector2 | undefined = undefined;
	spacing: number | undefined = undefined;
	width: number | undefined = undefined;
	styleId: string | undefined = undefined;
}

class ItemState {
	isHovered: boolean | undefined = undefined;
	activeControlStates = new Map<InputControl, boolean>();
	clickedControlStates = new Map<InputControl, boolean>();

	constructor(public readonly isDisabled: boolean, public readonly styleId: string | undefined) {}
}

class FrameMemory {
	rect = new Rect(new Vector2(0.33, 0.33));
	lastMovePosition: Vector2 | undefined = undefined;
	itemDragState: ItemDragState | undefined = undefined;

	constructor(public readonly id: number) {}
}

class KeyboardState {
	constructor(public readonly frameItemId: string) {}
}

export class Frame {
	private static readonly DEFAULT_ID = 'DEFAULT';
	private static readonly ITEM_DRAG_DISTANCE_SQUARED_THRESHOLD = Math.pow(0.0125, 2);
	private static readonly KEYBOARD_TITLE_ENTRY = 'VEIN_EDIT_KEYBOARD_TITLE';

	private static readonly memories = new Map<string, FrameMemory>();
	private static readonly style = new Style();

	private static _isDebugEnabled = false;

	private static options = new FrameOptions();
	private static itemOptions = new ItemOptions();
	private static keyboardState: KeyboardState | undefined = undefined;

	private readonly scale = Frame.options.scale ?? 1;
	private readonly spacing =
		Frame.options.spacing !== undefined
			? new Vector2(
					Frame.options.spacing[0] ?? Frame.style.frame.itemSpacing.x,
					Frame.options.spacing[1] ?? Frame.style.frame.itemSpacing.y
			  )
			: Frame.style.frame.itemSpacing.clone();
	private readonly memory: FrameMemory;
	private readonly input = new Input(Frame.options.disableInput);
	private readonly layoutStack: Layout[];
	private readonly painter: Painter;

	private itemIndex = -1;
	private itemState: ItemState | undefined = undefined;

	private mouseCursor = MouseCursor.Normal;

	static isDebugEnabled(): boolean {
		return Frame._isDebugEnabled;
	}

	static setDebugEnabled(enabled: boolean) {
		Frame._isDebugEnabled = enabled;
	}

	static isKeyboardOnScreen(): boolean {
		return Frame.keyboardState !== undefined;
	}

	static setNextFramePosition(x: number, y: number) {
		Frame.options.position = new Vector2(x, y);
	}

	static setNextFrameScale(scale: number) {
		Frame.options.scale = scale;
	}

	static setNextFrameSize(w: number | undefined, h: number | undefined) {
		Frame.options.size = [w, h];
	}

	static setNextFrameSpacing(x: number | undefined, y: number | undefined) {
		Frame.options.spacing = [x, y];
	}

	static setNextFrameStyleId(id: string) {
		Frame.options.styleId = id;
	}

	static setNextFrameDisableBackground() {
		Frame.options.disableBackground = true;
	}

	static setNextFrameDisableBorder() {
		Frame.options.disableBorder = true;
	}

	static setNextFrameDisableInput() {
		Frame.options.disableInput = true;
	}

	static setNextFrameDisableMove() {
		Frame.options.disableMove = true;
	}

	static getStyle(): Style {
		return Frame.style;
	}

	static setNextItemDisabled() {
		Frame.itemOptions.isDisabled = true;
	}

	static setNextItemPosition(x: number, y: number) {
		Frame.itemOptions.position = new Vector2(x, y);
	}

	static setNextItemSpacing(spacing: number) {
		Frame.itemOptions.spacing = spacing;
	}

	static getNextItemWidth(): number | undefined {
		return Frame.itemOptions.width;
	}

	static setNextItemWidth(w: number) {
		Frame.itemOptions.width = w;
	}

	static setNextItemStyleId(id: string) {
		Frame.itemOptions.styleId = id;
	}

	constructor(id: string | undefined) {
		if (id === undefined) id = Frame.DEFAULT_ID;

		let memory = Frame.memories.get(id);
		const isNewFrame = memory === undefined;

		if (memory === undefined) {
			memory = new FrameMemory(Frame.memories.size);
			Frame.memories.set(id, memory);
		}

		this.memory = memory;

		if (Frame.options.position !== undefined) {
			this.memory.rect.position.x = Frame.options.position.x;
			this.memory.rect.position.y = Frame.options.position.y;
		}

		if (Frame.options.size !== undefined) {
			if (Frame.options.size[0] !== undefined) this.memory.rect.size.x = Frame.options.size[0];
			if (Frame.options.size[1] !== undefined) this.memory.rect.size.y = Frame.options.size[1];
		}

		if (!Frame.options.disableMove) this.beginMove();

		const rect = this.getRect();
		const scale = this.getScale();
		const spacing = this.getSpacing();

		this.layoutStack = [
			new Layout(
				rect.position.x + Frame.style.frame.padding.x * scale,
				rect.position.y + Frame.style.frame.padding.y * scale,
				new Vector2(spacing.x * scale, spacing.y * scale)
			)
		];

		this.painter = new Painter(rect.position.x, rect.position.y, scale, `VEIN_${this.memory.id}`);

		if (!isNewFrame) {
			const selector = Frame.style.buildSelector('frame', Frame.options.styleId);
			const unscaledRect = new Rect(rect.position, new Vector2(rect.size.x / scale, rect.size.y / scale));

			if (!Frame.options.disableBackground) {
				SetScriptGfxDrawOrder(FrameDrawOrder.Background);
				drawItemBackground(this, selector, unscaledRect.size.x, unscaledRect.size.y);
				SetScriptGfxDrawOrder(FrameDrawOrder.Ui);
			}

			if (!Frame.options.disableBorder) {
				SetScriptGfxDrawOrder(FrameDrawOrder.Background);
				this.drawBorder(selector, unscaledRect);
				this.painter.setPosition(rect.position.x, rect.position.y);
				SetScriptGfxDrawOrder(FrameDrawOrder.Ui);
			}
		}

		Frame.options = new FrameOptions();
	}

	getInput(): Input {
		return this.input;
	}

	getPainter(): Painter {
		return this.painter;
	}

	getLayout(): Layout {
		return this.getTopLayout();
	}

	getRect(): Rect {
		return this.memory.rect;
	}

	getScale(): number {
		return this.scale;
	}

	getSpacing(): Vector2 {
		return this.spacing;
	}

	end() {
		this.endMove();

		if (this.memory.itemDragState !== undefined && !this.input.isControlDown(InputControl.MouseLeftButton))
			this.memory.itemDragState = undefined;

		if (!this.input.isDisabled()) SetMouseCursorSprite(this.mouseCursor);
		this.mouseCursor = MouseCursor.Normal;

		const layout = this.getTopLayout();

		layout.end();

		const contentRect = layout.getContentRect();
		const scale = this.getScale();

		this.memory.rect.size = new Vector2(
			contentRect.size.x + Frame.style.frame.padding.x * scale * 2,
			contentRect.size.y + Frame.style.frame.padding.y * scale * 2
		);
	}

	beginHorizontal(h?: number) {
		this.getTopLayout().beginHorizontal(h !== undefined ? h * this.getScale() : undefined);
	}

	endHorizontal() {
		this.getTopLayout().endHorizontal();
	}

	beginVertical(w?: number) {
		this.getTopLayout().beginVertical(w !== undefined ? w * this.getScale() : undefined);
	}

	endVertical() {
		this.getTopLayout().endVertical();
	}

	beginItem(w: number, h: number) {
		const scale = this.getScale();
		const layout = this.getTopLayout();

		layout.beginItem(
			Frame.itemOptions.position,
			Frame.itemOptions.spacing !== undefined ? Frame.itemOptions.spacing * scale : undefined,
			w * scale,
			h * scale
		);

		const itemRect = layout.getItemRect();
		this.painter.setPosition(itemRect.position.x, itemRect.position.y);

		this.itemState = new ItemState(Frame.itemOptions.isDisabled, Frame.itemOptions.styleId);

		++this.itemIndex;
		Frame.itemOptions = new ItemOptions();
	}

	endItem() {
		const layout = this.getTopLayout();

		if (Frame._isDebugEnabled) {
			const itemRect = layout.getItemRect();
			const scale = this.getScale();
			const unscaledItemRect = new Rect(
				itemRect.position,
				new Vector2(itemRect.size.x / scale, itemRect.size.y / scale)
			);

			this.painter.setPosition(unscaledItemRect.position.x, unscaledItemRect.position.y);
			this.painter.setColor(Frame.style.getPropertyAs<Color>('frame', 'color'));
			this.painter.drawRect(unscaledItemRect.size.x, unscaledItemRect.size.y);
		}

		layout.endItem();
	}

	beginItemDrag(id: string): boolean {
		const controlDownPosition = this.input.getControlDownPosition(InputControl.MouseLeftButton);
		if (controlDownPosition === undefined) return false;

		const mousePosition = this.input.getMousePosition();

		if (
			this.memory.itemDragState === undefined &&
			!this.isItemDisabled() &&
			this.getLayout().getItemRect().contains(controlDownPosition) &&
			controlDownPosition.squareDistance(mousePosition) >= Frame.ITEM_DRAG_DISTANCE_SQUARED_THRESHOLD * this.scale
		)
			this.memory.itemDragState = new ItemDragState(id);

		const isItemDragging =
			this.memory.itemDragState !== undefined &&
			!this.memory.itemDragState.isDropped &&
			this.memory.itemDragState.id === id;

		if (isItemDragging) {
			const scale = this.getScale();
			const spacing = this.getSpacing();

			this.layoutStack.push(
				new Layout(
					mousePosition.x + Frame.style.item.dragOffset.x,
					mousePosition.y + Frame.style.item.dragOffset.y,
					new Vector2(spacing.x * scale, spacing.y * scale)
				)
			);

			SetScriptGfxDrawOrder(FrameDrawOrder.DragAndDrop);
		}

		return isItemDragging;
	}

	endItemDrag() {
		if (this.memory.itemDragState === undefined) return;

		this.getTopLayout().end();
		this.layoutStack.pop();

		SetScriptGfxDrawOrder(FrameDrawOrder.Ui);

		this.memory.itemDragState.isDragged = false;
	}

	isItemDragged(): boolean {
		return this.memory.itemDragState !== undefined && this.memory.itemDragState.isDragged;
	}

	getItemDragPayload(): string | null {
		if (this.memory.itemDragState === undefined) return null;
		return this.memory.itemDragState.payload;
	}

	setItemDragPayload(payload: string | null) {
		if (this.memory.itemDragState === undefined)
			throw new Error('Frame.setItemDragPayload() failed: Nothing is dragged');

		this.memory.itemDragState.payload = payload;
	}

	beginItemDrop(): boolean {
		if (
			this.memory.itemDragState === undefined ||
			this.isItemDisabled() ||
			!this.isAreaHovered(this.getTopLayout().getItemRect())
		)
			return false;

		if (!this.memory.itemDragState.isDropped && !this.input.isControlDown(InputControl.MouseLeftButton))
			this.memory.itemDragState.isDropped = true;

		return true;
	}

	endItemDrop() {
		if (this.memory.itemDragState === undefined || !this.memory.itemDragState.isDropped) return;

		this.memory.itemDragState = undefined;
	}

	isItemDropped(): boolean {
		if (this.itemState === undefined) throw new Error('Frame.isItemDropped() failed: No item');

		return this.memory.itemDragState !== undefined && this.memory.itemDragState.isDropped;
	}

	isAreaHovered(rect: Rect): boolean {
		return rect.contains(this.input.getMousePosition());
	}

	isItemDisabled(): boolean {
		if (this.itemState === undefined) throw new Error('Frame.isItemDisabled() failed: No item');
		return this.itemState.isDisabled;
	}

	isItemClicked(control = InputControl.MouseLeftButton): boolean {
		if (this.itemState === undefined) throw new Error('Frame.isItemClicked() failed: No item');

		let isClicked = this.itemState.clickedControlStates.get(control);
		if (isClicked !== undefined) return isClicked;

		isClicked =
			this.memory.itemDragState === undefined &&
			!this.isItemDisabled() &&
			this.input.isControlReleased(control) &&
			this.isItemHovered();

		this.itemState.clickedControlStates.set(control, isClicked);

		return isClicked;
	}

	isItemHovered(): boolean {
		if (this.itemState === undefined) throw new Error('Frame.isItemHovered() failed: No item');

		if (this.itemState.isHovered !== undefined) return this.itemState.isHovered;

		const isHovered =
			this.memory.itemDragState === undefined &&
			!this.isItemDisabled() &&
			this.isAreaHovered(this.getTopLayout().getItemRect());

		this.itemState.isHovered = isHovered;
		return isHovered;
	}

	isItemActive(control = InputControl.MouseLeftButton): boolean {
		if (this.itemState === undefined) throw new Error('Frame.isItemActive() failed: No item');

		let isPressed = this.itemState.activeControlStates.get(control);
		if (isPressed !== undefined) return isPressed;

		isPressed =
			this.memory.itemDragState === undefined &&
			!this.isItemDisabled() &&
			this.input.isControlDown(control) &&
			this.isItemHovered();

		this.itemState.activeControlStates.set(control, isPressed);

		return isPressed;
	}

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	buildItemStyleSelector(name: string, state: string | undefined = undefined): string {
		if (this.itemState === undefined) throw new Error('Frame.buildItemStyleSelector() failed: No item');
		return Frame.style.buildSelector(name, this.itemState.styleId, state);
	}

	showOnScreenKeyboard(title: string, text: string, maxTextLength: number) {
		if (Frame.keyboardState !== undefined) return;

		CancelOnscreenKeyboard();

		AddTextEntry(Frame.KEYBOARD_TITLE_ENTRY, title);
		DisplayOnscreenKeyboard(1, Frame.KEYBOARD_TITLE_ENTRY, '', text, '', '', '', maxTextLength);

		Frame.keyboardState = new KeyboardState(this.getItemId());
	}

	tryGetOnScreenKeyboardResult(): string | null {
		if (
			Frame.keyboardState === undefined ||
			Frame.keyboardState.frameItemId !== this.getItemId() ||
			UpdateOnscreenKeyboard() <= 0
		)
			return null;

		const result = GetOnscreenKeyboardResult();
		Frame.keyboardState = undefined;

		return result;
	}

	private getTopLayout(): Layout {
		return this.layoutStack[this.layoutStack.length - 1];
	}

	private getItemId(): string {
		return `${this.memory.id}_${this.itemIndex}`;
	}

	private beginMove() {
		if (this.memory.itemDragState !== undefined || this.input.isDisabled()) return;

		if (
			!this.isAreaHovered(
				new Rect(
					this.memory.rect.position,
					new Vector2(this.memory.rect.size.x, Frame.style.frame.padding.y * this.getScale())
				)
			)
		)
			return;

		if (this.memory.lastMovePosition === undefined) {
			if (this.input.isControlPressed(InputControl.MouseLeftButton)) {
				const mousePosition = this.input.getMousePosition();
				this.memory.lastMovePosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!this.input.isControlDown(InputControl.MouseLeftButton)) {
			this.memory.lastMovePosition = undefined;
		}

		if (!this.memory.lastMovePosition) this.mouseCursor = MouseCursor.PreGrab;
	}

	private endMove() {
		if (this.memory.lastMovePosition === undefined) return;

		const mousePosition = this.input.getMousePosition();

		this.memory.rect.position.x += mousePosition.x - this.memory.lastMovePosition.x;
		this.memory.rect.position.y += mousePosition.y - this.memory.lastMovePosition.y;

		this.memory.lastMovePosition = new Vector2(mousePosition.x, mousePosition.y);

		this.mouseCursor = MouseCursor.Grab;
	}

	private drawBorder(selector: string, unscaledRect: Rect) {
		const rect = this.getRect();
		const scale = this.getScale();
		const bw = Frame.style.frame.borderWidth;
		const bh = bw * GetAspectRatio(false) + 0.00049;

		this.painter.setColor(Frame.style.getPropertyAs<Color>(selector, 'border-color'));
		this.painter.setPosition(rect.position.x + bw * scale, rect.position.y + rect.size.y);
		this.painter.drawRect(unscaledRect.size.x - bw, bh); // bottom
		this.painter.setPosition(rect.position.x + rect.size.x, rect.position.y + bh * scale);
		this.painter.drawRect(bw, unscaledRect.size.y); // right
	}
}

let frame: Frame | null = null;

export function getFrameChecked(): Frame {
	if (!frame) throw new Error('getFrameChecked() failed: Frame is null');
	return frame;
}

export function setFrame(frame_: Frame | null) {
	frame = frame_;
}
