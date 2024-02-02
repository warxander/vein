import * as cFrame from './core/frame';
import { InputControl } from './core/input';
import { TextData } from './core/painter';
import { StylePropertyType } from './core/style';
import * as cTypes from './core/types';

function toRect(rect: cTypes.Rect): Rect {
	return { x: rect.position.x, y: rect.position.y, w: rect.size.x, h: rect.size.y };
}

function toVector2(vector2: cTypes.Vector2): Vector2 {
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
	isItemClicked(): boolean;
	isItemHovered(): boolean;
	isItemPressed(): boolean;

	setMouseCursor(mouseCursor: number): void;

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
	 * @param control 0 - LeftButton, 1 - RightButton, 2 - ScrollWheelUp, 3 - ScrollWheelDown
	 */
	isMouseControlPressed(control: number): boolean;

	/**
	 *
	 * @param control 0 - LeftButton, 1 - RightButton, 2 - ScrollWheelUp, 3 - ScrollWheelDown
	 */
	isMouseControlReleased(control: number): boolean;

	/**
	 *
	 * @param control 0 - LeftButton, 1 - RightButton, 2 - ScrollWheelUp, 3 - ScrollWheelDown
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
	const frame = cFrame.getFrameChecked();

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
					return painter.getTextWidth(new TextData(text, font, scale));
				},

				getTextLineCount(text: string, font: number, scale: number, w: number): number {
					return painter.getTextLineCount(new TextData(text, font, scale, w));
				},

				drawText(text: string, font: number, scale: number) {
					painter.drawText(new TextData(text, font, scale));
				},

				drawMultilineText(text: string, font: number, scale: number, w: number) {
					painter.drawMultilineText(new TextData(text, font, scale, w));
				}
			};
		},

		getRect(): Rect {
			return toRect(frame.getRect());
		},

		getScale(): number {
			return cFrame.Frame.getScale();
		},

		getSpacing(): Vector2 {
			return toVector2(cFrame.Frame.getSpacing());
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

		isItemClicked(): boolean {
			return frame.isItemClicked();
		},

		isItemHovered(): boolean {
			return frame.isItemHovered();
		},

		isItemPressed(): boolean {
			return frame.isItemPressed();
		},

		setMouseCursor(mouseCursor: number) {
			frame.setMouseCursor(mouseCursor);
		},

		buildStyleSelector(name: string, state: string | null = null): string {
			return frame.buildStyleSelector(name, state ?? undefined);
		},

		getStyleProperty(selector: string, property: string): unknown {
			return cFrame.Frame.getStyleProperty(selector, property);
		}
	};
}

/**
 * @category General
 */
export function isDebugEnabled(): boolean {
	return cFrame.Frame.isDebugEnabled();
}

/**
 * @category General
 */
export function setDebugEnabled(enabled: boolean) {
	cFrame.Frame.setDebugEnabled(enabled);
}

/**
 * @category Frame
 */
export function setNextFramePosition(x: number, y: number) {
	cFrame.Frame.setNextFramePosition(x, y);
}

/**
 * @category Frame
 */
export function setNextFrameScale(scale: number) {
	cFrame.Frame.setNextFrameScale(scale);
}

/**
 * @category Frame
 */
export function setNextFrameSize(w: number | null, h: number | null) {
	cFrame.Frame.setNextFrameSize(w ?? undefined, h ?? undefined);
}

/**
 * @category Frame
 */
export function setNextFrameSpacing(x: number | null, y: number | null) {
	cFrame.Frame.setNextFrameSpacing(x ?? undefined, y ?? undefined);
}

/**
 * @category Frame
 */
export function setNextFrameDisableBackground() {
	cFrame.Frame.setNextFrameDisableBackground();
}

/**
 * @category Frame
 */
export function setNextFrameDisableBorder() {
	cFrame.Frame.setNextFrameDisableBorder();
}

/**
 * @category Frame
 */
export function setNextFrameDisableInput() {
	cFrame.Frame.setNextFrameDisableInput();
}

/**
 * @category Frame
 */
export function setNextFrameDisableMove() {
	cFrame.Frame.setNextFrameDisableMove();
}

/**
 * @category Frame
 */
export function beginFrame(id: string | null = null) {
	cFrame.setFrame(new cFrame.Frame(id ?? undefined));
}

/**
 * @category Frame
 */
export function endFrame(): Rect {
	const frame = cFrame.getFrameChecked();

	frame.end();

	const rect = frame.getRect();

	cFrame.setFrame(null);

	return toRect(rect);
}

/**
 * @category Frame
 */
export function beginHorizontal(h: number | null = null) {
	cFrame.getFrameChecked().beginHorizontal(h ?? undefined);
}

/**
 * @category Frame
 */
export function endHorizontal() {
	cFrame.getFrameChecked().endHorizontal();
}

/**
 * @category Frame
 */
export function beginVertical(w: number | null = null) {
	cFrame.getFrameChecked().beginVertical(w ?? undefined);
}

/**
 * @category Frame
 */
export function endVertical() {
	cFrame.getFrameChecked().endVertical();
}

/**
 * @category Frame
 */
export function isItemHovered(): boolean {
	return cFrame.getFrameChecked().isItemHovered();
}

/**
 * @category Frame
 */
export function isItemClicked(): boolean {
	return cFrame.getFrameChecked().isItemClicked();
}

/**
 * @category Frame
 */
export function isItemPressed(): boolean {
	return cFrame.getFrameChecked().isItemPressed();
}

/**
 * @category Frame
 */
export function setNextItemDisabled() {
	cFrame.getFrameChecked().setNextItemDisabled();
}

/**
 * @category Frame
 */
export function setNextItemPosition(x: number, y: number) {
	cFrame.getFrameChecked().setNextItemPosition(x, y);
}

/**
 * @category Frame
 */
export function setNextItemSpacing(spacing: number) {
	cFrame.getFrameChecked().setNextItemSpacing(spacing);
}

/**
 * @category Frame
 */
export function setNextItemWidth(w: number) {
	cFrame.getFrameChecked().setNextItemWidth(w);
}

/**
 * @category Style
 */
export function addStyleSheet(sheet: string) {
	cFrame.Frame.getStyle().addSheet(sheet);
}

/**
 * @category Style
 */
export function resetStyle() {
	cFrame.Frame.getStyle().reset();
}

/**
 * @category Style
 */
export function registerStylePropertyAsColor(property: string) {
	cFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Color);
}

/**
 * @category Style
 */
export function registerStylePropertyAsFloat(property: string) {
	cFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Float);
}

/**
 * @category Style
 */
export function registerStylePropertyAsImage(property: string) {
	cFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Image);
}

/**
 * @category Style
 */
export function registerStylePropertyAsInteger(property: string) {
	cFrame.Frame.getStyle().registerProperty(property, StylePropertyType.Integer);
}

/**
 * @category Style
 */
export function setNextFrameStyleId(id: string) {
	cFrame.Frame.setNextFrameStyleId(id);
}

/**
 * @category Style
 */
export function setNextItemStyleId(id: string) {
	cFrame.getFrameChecked().setNextItemStyleId(id);
}

/**
 * @category Style
 */
export function pushItemStyleId(id: string) {
	cFrame.getFrameChecked().pushItemStyleId(id);
}

/**
 * @category Style
 */
export function popItemStyleId() {
	cFrame.getFrameChecked().popItemStyleId();
}
