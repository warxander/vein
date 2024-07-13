import * as CoreFrame from './core/frame';
import { InputControl } from './core/input';
import { StylePropertyType } from './core/style';
import * as CoreTypes from './core/types';
import * as CoreUtils from './core/utils';

function toRect(rect: CoreTypes.Rect): Rect {
	return { x: rect.position.x, y: rect.position.y, w: rect.size.x, h: rect.size.y };
}

function toVector2(vector2: CoreTypes.Vector2): Vector2 {
	return { x: vector2.x, y: vector2.y };
}

function toInputMouseControl(control: number): InputControl {
	switch (control) {
		case 0:
			return InputControl.MouseLeftButton;
		case 1:
			return InputControl.MouseRightButton;
		case 2:
			return InputControl.MouseScrollWheelUp;
		case 3:
			return InputControl.MouseScrollWheelDown;
		default:
			throw new Error(`toInputMouseControl() failed: Unsupported mouse control ${control}`);
	}
}

/**
 * @category Types
 */
export interface Vector2 {
	x: number;
	y: number;
}

/**
 * @category Types
 */
export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * @category Custom Items
 */
export interface Frame {
	getInput(): Input;
	getLayout(): Layout;
	getPainter(): Painter;

	getRect(): Rect;
	getScale(): number;
	getSpacing(): Vector2;

	beginItem(w: number, h: number): void;
	endItem(): void;

	tryGetItemWidth(): number | null;

	isItemDisabled(): boolean;

	/**
	 *
	 * @param control 0 - MouseLeftButton (default), 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
	 */
	isItemClicked(control: number): boolean;

	isItemHovered(): boolean;

	/**
	 *
	 * @param control 0 - MouseLeftButton (default), 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
	 */
	isItemPressed(control: number): boolean;

	setMouseCursor(mouseCursor: number): void;

	isKeyboardOnScreen(): boolean;
	showOnScreenKeyboard(title: string, text: string, maxTextLength: number): void;
	tryGetOnScreenKeyboardResult(): string | null;

	buildStyleSelector(name: string, state: string | null): string;
	getStyleProperty(selector: string, property: string): unknown;
}

/**
 * @category Custom Items
 */
export interface Input {
	getMousePosition(): Vector2;

	/**
	 *
	 * @param control 0 - MouseLeftButton, 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
	 */
	isMouseControlPressed(control: number): boolean;

	/**
	 *
	 * @param control 0 - MouseLeftButton, 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
	 */
	isMouseControlReleased(control: number): boolean;

	/**
	 *
	 * @param control 0 - MouseLeftButton, 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
	 */
	isMouseControlDown(control: number): boolean;
}

/**
 * @category Custom Items
 */
export interface Layout {
	getContentRect(): Rect;
	getItemRect(): Rect;
}

/**
 * @category Custom Items
 */
export interface Painter {
	move(x: number, y: number): void;

	getPosition(): Vector2;
	setPosition(x: number, y: number): void;

	setColor(r: number, g: number, b: number, a: number): void;

	drawRect(w: number, h: number): void;

	drawSprite(dict: string, name: string, w: number, h: number): void;

	getFontSize(font: number, scale: number): number;

	getTextWidth(text: string, font: number, scale: number): number;
	getTextLineCount(text: string, font: number, scale: number, w: number): number;

	drawText(text: string, font: number, scale: number): void;
	drawMultilineText(text: string, font: number, scale: number, w: number): void;
}

export * from './items/button';
export * from './items/check_box';
export * from './items/collapsing_header';
export * from './items/dummy';
export * from './items/heading';
export * from './items/hyperlink';
export * from './items/label';
export * from './items/progress_bar';
export * from './items/rect';
export * from './items/selectable';
export * from './items/separator';
export * from './items/slider';
export * from './items/sprite';
export * from './items/sprite_button';
export * from './items/text_area';
export * from './items/text_edit';

/**
 * @category Custom Items
 */
export function getFrame(): Frame {
	const frame = CoreFrame.getFrameChecked();

	return {
		getInput(): Input {
			const input = frame.getInput();

			return {
				getMousePosition(): Vector2 {
					return toVector2(input.getMousePosition());
				},

				isMouseControlPressed(control: number): boolean {
					return input.isControlPressed(toInputMouseControl(control));
				},

				isMouseControlReleased(control: number): boolean {
					return input.isControlReleased(toInputMouseControl(control));
				},

				isMouseControlDown(control: number): boolean {
					return input.isControlDown(toInputMouseControl(control));
				}
			};
		},

		getLayout(): Layout {
			const layout = frame.getLayout();

			return {
				getContentRect(): Rect {
					return toRect(layout.getContentRect());
				},

				getItemRect(): Rect {
					return toRect(layout.getItemRect());
				}
			};
		},

		getPainter(): Painter {
			const painter = frame.getPainter();

			return {
				move(x: number, y: number) {
					painter.move(x, y);
				},

				getPosition(): Vector2 {
					return toVector2(painter.getPosition());
				},

				setPosition(x: number, y: number) {
					painter.setPosition(x, y);
				},

				setColor(r: number, g: number, b: number, a: number) {
					painter.setColor([r, g, b, a]);
				},

				drawRect(w: number, h: number) {
					painter.drawRect(w, h);
				},

				drawSprite(dict: string, name: string, w: number, h: number) {
					painter.drawSprite(dict, name, w, h);
				},

				getFontSize(font: number, scale: number): number {
					return painter.getFontSize(font, scale);
				},

				getTextWidth(text: string, font: number, scale: number): number {
					return painter.getTextWidth(new CoreTypes.TextData(text, font, scale));
				},

				getTextLineCount(text: string, font: number, scale: number, w: number): number {
					return painter.getTextLineCount(new CoreTypes.TextData(text, font, scale, w));
				},

				drawText(text: string, font: number, scale: number) {
					painter.drawText(new CoreTypes.TextData(text, font, scale));
				},

				drawMultilineText(text: string, font: number, scale: number, w: number) {
					painter.drawMultilineText(new CoreTypes.TextData(text, font, scale, w));
				}
			};
		},

		getRect(): Rect {
			return toRect(frame.getRect());
		},

		getScale(): number {
			return frame.getScale();
		},

		getSpacing(): Vector2 {
			return toVector2(frame.getSpacing());
		},

		beginItem(w: number, h: number) {
			frame.beginItem(w, h);
		},

		endItem() {
			frame.endItem();
		},

		tryGetItemWidth(): number | null {
			return frame.tryGetItemWidth() ?? null;
		},

		isItemDisabled(): boolean {
			return frame.isItemDisabled();
		},

		isItemClicked(control = 0): boolean {
			return frame.isItemClicked(toInputMouseControl(control));
		},

		isItemHovered(): boolean {
			return frame.isItemHovered();
		},

		isItemPressed(control = 0): boolean {
			return frame.isItemPressed(toInputMouseControl(control));
		},

		setMouseCursor(mouseCursor: number) {
			frame.setMouseCursor(mouseCursor);
		},

		isKeyboardOnScreen(): boolean {
			return frame.isKeyboardOnScreen();
		},

		showOnScreenKeyboard(title: string, text: string, maxTextLength: number) {
			frame.showOnScreenKeyboard(title, text, maxTextLength);
		},

		tryGetOnScreenKeyboardResult(): string | null {
			return frame.tryGetOnScreenKeyboardResult();
		},

		buildStyleSelector(name: string, state: string | null = null): string {
			return frame.buildStyleSelector(name, state ?? undefined);
		},

		getStyleProperty(selector: string, property: string): unknown {
			return frame.getStyleProperty(selector, property);
		}
	};
}

/**
 * @category General
 */
export function isDebugEnabled(): boolean {
	return CoreFrame.Frame.isDebugEnabled();
}

/**
 * @category General
 */
export function setDebugEnabled(enabled: boolean) {
	CoreFrame.Frame.setDebugEnabled(enabled);
}

/**
 * @category Frame
 */
export function setNextFramePosition(x: number, y: number) {
	CoreFrame.Frame.setNextFramePosition(x, y);
}

/**
 * @category Frame
 */
export function setNextFrameScale(scale: number) {
	CoreFrame.Frame.setNextFrameScale(scale);
}

/**
 * @category Frame
 */
export function setNextFrameSize(w: number | null, h: number | null) {
	CoreFrame.Frame.setNextFrameSize(w ?? undefined, h ?? undefined);
}

/**
 * @category Frame
 */
export function setNextFrameSpacing(x: number | null, y: number | null) {
	CoreFrame.Frame.setNextFrameSpacing(x ?? undefined, y ?? undefined);
}

/**
 * @category Frame
 */
export function setNextFrameDisableBackground() {
	CoreFrame.Frame.setNextFrameDisableBackground();
}

/**
 * @category Frame
 */
export function setNextFrameDisableBorder() {
	CoreFrame.Frame.setNextFrameDisableBorder();
}

/**
 * @category Frame
 */
export function setNextFrameDisableInput() {
	CoreFrame.Frame.setNextFrameDisableInput();
}

/**
 * @category Frame
 */
export function setNextFrameDisableMove() {
	CoreFrame.Frame.setNextFrameDisableMove();
}

/**
 * @category Frame
 */
export function beginFrame(id: string | null = null) {
	CoreFrame.setFrame(new CoreFrame.Frame(id ?? undefined));
}

/**
 * @category Frame
 */
export function endFrame(): Rect {
	const frame = CoreFrame.getFrameChecked();

	frame.end();

	const rect = frame.getRect();

	CoreFrame.setFrame(null);

	return toRect(rect);
}

/**
 * @category Frame
 */
export function beginHorizontal(h: number | null = null) {
	CoreFrame.getFrameChecked().beginHorizontal(h ?? undefined);
}

/**
 * @category Frame
 */
export function endHorizontal() {
	CoreFrame.getFrameChecked().endHorizontal();
}

/**
 * @category Frame
 */
export function beginVertical(w: number | null = null) {
	CoreFrame.getFrameChecked().beginVertical(w ?? undefined);
}

/**
 * @category Frame
 */
export function endVertical() {
	CoreFrame.getFrameChecked().endVertical();
}

/**
 * @category Frame
 */
export function isItemHovered(): boolean {
	return CoreFrame.getFrameChecked().isItemHovered();
}

/**
 * @category Frame
 * @param control 0 - MouseLeftButton (default), 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
 */
export function isItemClicked(control = 0): boolean {
	return CoreFrame.getFrameChecked().isItemClicked(toInputMouseControl(control));
}

/**
 * @category Frame
 * @param control 0 - MouseLeftButton (default), 1 - MouseRightButton, 2 - MouseScrollWheelUp, 3 - MouseScrollWheelDown
 */
export function isItemPressed(control = 0): boolean {
	return CoreFrame.getFrameChecked().isItemPressed(toInputMouseControl(control));
}

/**
 * @category Frame
 */
export function setNextItemDisabled() {
	CoreFrame.getFrameChecked().setNextItemDisabled();
}

/**
 * @category Frame
 */
export function setNextItemPosition(x: number, y: number) {
	CoreFrame.getFrameChecked().setNextItemPosition(x, y);
}

/**
 * @category Frame
 */
export function setNextItemSpacing(spacing: number) {
	CoreFrame.getFrameChecked().setNextItemSpacing(spacing);
}

/**
 * @category Frame
 */
export function setNextItemWidth(w: number) {
	CoreFrame.getFrameChecked().setNextItemWidth(w);
}

/**
 * @category Drag & Drop
 */
export function beginItemDrag(id: string): boolean {
	return CoreFrame.getFrameChecked().beginItemDrag(id);
}

/**
 * @category Drag & Drop
 */
export function endItemDrag() {
	CoreFrame.getFrameChecked().endItemDrag();
}

/**
 * @category Drag & Drop
 */
export function isItemDragged(): boolean {
	return CoreFrame.getFrameChecked().isItemDragged();
}

/**
 * @category Drag & Drop
 */
export function getItemDragPayload(): string | null {
	return CoreFrame.getFrameChecked().getItemDragPayload();
}

/**
 * @category Drag & Drop
 */
export function setItemDragPayload(payload: string | null) {
	CoreFrame.getFrameChecked().setItemDragPayload(payload);
}

/**
 * @category Drag & Drop
 */
export function beginItemDrop(): boolean {
	return CoreFrame.getFrameChecked().beginItemDrop();
}

/**
 * @category Drag & Drop
 */
export function endItemDrop() {
	CoreFrame.getFrameChecked().endItemDrop();
}

/**
 * @category Drag & Drop
 */
export function isItemDropped(): boolean {
	return CoreFrame.getFrameChecked().isItemDropped();
}

/**
 * @category Style
 */
export function addStyleSheet(sheet: string) {
	CoreFrame.Frame.getStyle().addSheet(sheet);
}

/**
 * @category Style
 */
export function resetStyle() {
	CoreFrame.Frame.getStyle().reset();
}

/**
 * @category Style
 */
export function registerStylePropertyAsColor(property: string) {
	CoreFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Color);
}

/**
 * @category Style
 */
export function registerStylePropertyAsFloat(property: string) {
	CoreFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Float);
}

/**
 * @category Style
 */
export function registerStylePropertyAsImage(property: string) {
	CoreFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Image);
}

/**
 * @category Style
 */
export function registerStylePropertyAsInteger(property: string) {
	CoreFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Integer);
}

/**
 * @category Style
 */
export function setNextFrameStyleId(id: string) {
	CoreFrame.Frame.setNextFrameStyleId(id);
}

/**
 * @category Style
 */
export function setNextItemStyleId(id: string) {
	CoreFrame.getFrameChecked().setNextItemStyleId(id);
}

/**
 * @category Misc
 */
export function openUrl(url: string) {
	CoreUtils.openUrl(url);
}
