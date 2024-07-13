import { Color, MouseCursor, Rect, Vector2 } from './types';
import { Input, InputFlags, InputControl } from './input';
import { Layout } from './layout';
import { Painter } from './painter';
import { Style, StylePropertyValue } from './style';
import { drawItemBackground } from './utils';

class ItemState {
	disabled = false;
	position: Vector2 | undefined = undefined;
	spacing: number | undefined = undefined;
	width: number | undefined = undefined;
	styleId: string | undefined = undefined;
}

enum FrameFlags {
	None,
	DisableBackground = 1 << 1,
	DisableBorder = 1 << 2,
	DisableMove = 1 << 3
}

class FrameState {
	inputFlags = InputFlags.None;
	flags = FrameFlags.None;
	position: Vector2 | undefined = undefined;
	scale: number | undefined = undefined;
	size: [number | undefined, number | undefined] | undefined = undefined;
	spacing: [number | undefined, number | undefined] | undefined = undefined;
	styleId: string | undefined = undefined;
}

class FrameMemory {
	rect = new Rect(new Vector2(0.33, 0.33));
	movePosition: Vector2 | undefined = undefined;

	constructor(public id: number) {}
}

export class Frame {
	private static readonly DEFAULT_ID = 'DEFAULT';
	private static readonly KEYBOARD_TITLE_ENTRY = 'VEIN_EDIT_KEYBOARD_TITLE';

	private static frameMemory = new Map<string, FrameMemory>();
	private static style = new Style();
	private static nextState = new FrameState();
	private static isKeyboardOnScreen = false;
	private static isDebugEnabled_ = false;

	private memory: FrameMemory;
	private input = new Input(Frame.nextState.inputFlags);
	private painter: Painter;
	private nextItemState = new ItemState();
	private mouseCursor = MouseCursor.Normal;

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

	static setNextFrameScale(scale: number) {
		Frame.nextState.scale = scale;
	}

	static setNextFrameSize(w: number | undefined, h: number | undefined) {
		Frame.nextState.size = [w, h];
	}

	static setNextFrameSpacing(x: number | undefined, y: number | undefined) {
		Frame.nextState.spacing = [x, y];
	}

	static setNextFrameStyleId(id: string) {
		Frame.nextState.styleId = id;
	}

	static setNextFrameDisableBackground() {
		Frame.nextState.flags |= FrameFlags.DisableBackground;
	}

	static setNextFrameDisableBorder() {
		Frame.nextState.flags |= FrameFlags.DisableBorder;
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

	constructor(id: string | undefined) {
		if (id === undefined) id = Frame.DEFAULT_ID;

		let memory = Frame.frameMemory.get(id);
		const isNewFrame = memory === undefined;

		if (memory === undefined) {
			memory = new FrameMemory(Frame.frameMemory.size);
			Frame.frameMemory.set(id, memory);
		}

		this.memory = memory;

		if (Frame.nextState.position !== undefined) {
			this.memory.rect.position.x = Frame.nextState.position.x;
			this.memory.rect.position.y = Frame.nextState.position.y;
		}

		this.beginMove();

		const rect = this.getRect();
		const scale = this.getScale();
		const spacing = this.getSpacing();

		this.layout = new Layout(
			rect.position.x + Frame.style.frame.padding.x * scale,
			rect.position.y + Frame.style.frame.padding.y * scale,
			new Vector2(spacing.x * scale, spacing.y * scale)
		);

		this.painter = new Painter(rect.position.x, rect.position.y, scale, `VEIN_${this.memory.id}`);

		if (isNewFrame || this.isBackgroundDisabled()) return;

		const selector = this.buildStyleSelector('frame');
		const unscaledRect = new Rect(rect.position, new Vector2(rect.size.x / scale, rect.size.y / scale));

		drawItemBackground(this, selector, unscaledRect.size.x, unscaledRect.size.y);

		if (this.isBorderDisabled()) return;

		this.drawBorder(selector, unscaledRect);
		this.painter.setPosition(rect.position.x, rect.position.y);
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
		const rect = this.memory.rect;
		if (Frame.nextState.size === undefined) return rect;
		return new Rect(
			rect.position,
			new Vector2(Frame.nextState.size[0] ?? rect.size.x, Frame.nextState.size[1] ?? rect.size.y)
		);
	}

	getStyleId(): string | undefined {
		return Frame.nextState.styleId;
	}

	getScale(): number {
		return Frame.nextState.scale ?? 1;
	}

	getSpacing(): Vector2 {
		if (Frame.nextState.spacing === undefined) return Frame.style.frame.itemSpacing;
		return new Vector2(
			Frame.nextState.spacing[0] ?? Frame.style.frame.itemSpacing.x,
			Frame.nextState.spacing[1] ?? Frame.style.frame.itemSpacing.y
		);
	}

	isBackgroundDisabled(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.DisableBackground);
	}

	isBorderDisabled(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.DisableBorder);
	}

	isInputDisabled(): boolean {
		return !!(Frame.nextState.inputFlags & InputFlags.DisableInput);
	}

	isMoveDisabled(): boolean {
		return !!(Frame.nextState.flags & FrameFlags.DisableMove);
	}

	getStyleProperty(selector: string, property: string): StylePropertyValue {
		return Frame.style.getProperty(selector, property);
	}

	end() {
		this.endMove();


		if (!this.isInputDisabled()) SetMouseCursorSprite(this.mouseCursor);
		this.mouseCursor = MouseCursor.Normal;

		this.layout.end();

		const contentRect = this.layout.getContentRect();
		const scale = this.getScale();

		this.memory.rect.size = new Vector2(
			contentRect.size.x + Frame.style.frame.padding.x * scale * 2,
			contentRect.size.y + Frame.style.frame.padding.y * scale * 2
		);

		Frame.nextState = new FrameState();
	}

	beginHorizontal(h?: number) {
		this.layout.beginHorizontal(h !== undefined ? h * this.getScale() : undefined);
	}

	endHorizontal() {
		this.layout.endHorizontal();
	}

	beginVertical(w?: number) {
		this.layout.beginVertical(w !== undefined ? w * this.getScale() : undefined);
	}

	endVertical() {
		this.layout.endVertical();
	}

	beginItem(w: number, h: number) {
		const scale = this.getScale();

		this.layout.beginItem(
			this.nextItemState.position,
			this.nextItemState.spacing !== undefined ? this.nextItemState.spacing * scale : undefined,
			w * scale,
			h * scale
		);

		const itemRect = this.layout.getItemRect();
		this.painter.setPosition(itemRect.position.x, itemRect.position.y);
	}

	endItem() {
		if (Frame.isDebugEnabled_) {
			const itemRect = this.layout.getItemRect();
			const scale = this.getScale();
			const unscaledItemRect = new Rect(
				itemRect.position,
				new Vector2(itemRect.size.x / scale, itemRect.size.y / scale)
			);

			this.painter.setPosition(unscaledItemRect.position.x, unscaledItemRect.position.y);
			this.painter.setColor(Frame.style.getPropertyAs<Color>('frame', 'color'));
			this.painter.drawRect(unscaledItemRect.size.x, unscaledItemRect.size.y);
		}

		this.layout.endItem();

		this.nextItemState = new ItemState();
	}

	setNextItemDisabled() {
		this.nextItemState.disabled = true;
	}

	setNextItemPosition(x: number, y: number) {
		this.nextItemState.position = new Vector2(x, y);
	}

	setNextItemSpacing(spacing: number) {
		this.nextItemState.spacing = spacing;
	}

	setNextItemWidth(w: number) {
		this.nextItemState.width = w;
	}

	tryGetItemWidth(): number | undefined {
		return this.nextItemState.width;
	}

	setNextItemStyleId(id: string) {
		this.nextItemState.styleId = id;
	}

	isAreaHovered(rect: Rect): boolean {
		return rect.contains(this.input.getMousePosition());
	}

	isItemDisabled(): boolean {
		return this.nextItemState.disabled;
	}

	isItemClicked(): boolean {
		return (
			!this.isItemDisabled() && this.input.isControlReleased(InputControl.MouseLeftButton) && this.isItemHovered()
		);
	}

	isItemHovered(): boolean {
		return !this.isItemDisabled() && this.isAreaHovered(this.layout.getItemRect());
	}

	isItemPressed(): boolean {
		return !this.isItemDisabled() && this.input.isControlDown(InputControl.MouseLeftButton) && this.isItemHovered();
	}

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	buildStyleSelector(name: string, state: string | undefined = undefined): string {
		return Frame.style.buildSelector(name, this.nextItemState.styleId, state);
	}

	isKeyboardOnScreen(): boolean {
		return Frame.isKeyboardOnScreen;
	}

	showOnScreenKeyboard(title: string, text: string, maxTextLength: number) {
		if (Frame.isKeyboardOnScreen) return;

		CancelOnscreenKeyboard();

		AddTextEntry(Frame.KEYBOARD_TITLE_ENTRY, title);
		DisplayOnscreenKeyboard(1, Frame.KEYBOARD_TITLE_ENTRY, '', text, '', '', '', maxTextLength);

		Frame.isKeyboardOnScreen = true;
	}

	tryGetOnScreenKeyboardResult(): string | null {
		if (!Frame.isKeyboardOnScreen || UpdateOnscreenKeyboard() <= 0) return null;

		const result = GetOnscreenKeyboardResult();
		Frame.isKeyboardOnScreen = false;

		return result;
	}

	private beginMove() {
		if (this.isMoveDisabled() || this.isInputDisabled()) return;

		if (
			!this.isAreaHovered(
				new Rect(
					this.memory.rect.position,
					new Vector2(this.memory.rect.size.x, Frame.style.frame.padding.y * this.getScale())
				)
			)
		)
			return;

		if (this.memory.movePosition === undefined) {
			if (this.input.isControlPressed(InputControl.MouseLeftButton)) {
				const mousePosition = this.input.getMousePosition();
				this.memory.movePosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!this.input.isControlDown(InputControl.MouseLeftButton)) {
			this.memory.movePosition = undefined;
		}

		if (!this.memory.movePosition) this.mouseCursor = MouseCursor.PreGrab;
	}

	private endMove() {
		if (this.memory.movePosition === undefined) return;

		const mousePosition = this.input.getMousePosition();

		this.memory.rect.position.x += mousePosition.x - this.memory.movePosition.x;
		this.memory.rect.position.y += mousePosition.y - this.memory.movePosition.y;

		this.memory.movePosition = new Vector2(mousePosition.x, mousePosition.y);

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
