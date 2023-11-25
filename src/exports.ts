import { Frame, getFrameChecked, setFrame } from './core/frame';
import { InputControl } from './core/input';
import { StylePropertyType } from './core/style';
import { Rect, Vector2 } from './core/types';

function toIRect(rect: Rect): IRect {
	return { x: rect.position.x, y: rect.position.y, w: rect.size.x, h: rect.size.y };
}

function toIVector2(vector2: Vector2): IVector2 {
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
			throw new Error(`Unsupported mouse control ${control}`);
	}
}

export * from './items/button';
export * from './items/checkbox';
export * from './items/collapsingheader';
export * from './items/dummy';
export * from './items/heading';
export * from './items/hyperlink';
export * from './items/label';
export * from './items/progressbar';
export * from './items/rect';
export * from './items/selectable';
export * from './items/separator';
export * from './items/slider';
export * from './items/spacing';
export * from './items/sprite';
export * from './items/spritebutton';
export * from './items/textarea';
export * from './items/textedit';

/**
 * @category Types
 */
export interface IVector2 {
	x: number;
	y: number;
}

/**
 * @category Types
 */
export interface IRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * @category Frame
 */
export interface IFrameResponse {
	rect: IRect;
}

/**
 * @category Custom Items
 */
export interface IFrame {
	getInput(): IInput;
	getLayout(): ILayout;
	getPainter(): IPainter;

	getRect(): IRect;

	beginItem(w: number, h: number): void;
	endItem(): void;

	tryGetItemWidth(): number | null;

	isItemClicked(): boolean;
	isItemHovered(): boolean;
	isItemPressed(): boolean;

	setMouseCursor(mouseCursor: number): void;

	buildStyleSelector(name: string, state: string | null): string;
	getStyleProperty(selector: string, property: string): any;
}

/**
 * @category Custom Items
 */
export interface IInput {
	getMousePosition(): IVector2;

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
export interface ILayout {
	getContentRect(): IRect;
	getItemRect(): IRect;
}

/**
 * @category Custom Items
 */
export interface IPainter {
	move(x: number, y: number): void;

	getPosition(): IVector2;
	setPosition(x: number, y: number): void;

	setColor(r: number, g: number, b: number, a: number): void;

	drawRect(w: number, h: number): void;

	drawSprite(dict: string, name: string, w: number, h: number): void;

	getTextWidth(text: string, font: number, scale: number): number;
	getTextLineCount(text: string, font: number, scale: number, w: number): number;

	drawText(text: string, font: number, scale: number): void;
	drawMultilineText(text: string, font: number, scale: number, w: number): void;
}

/**
 * @category Custom Items
 */
export function getFrame(): IFrame {
	const frame = getFrameChecked();

	return {
		getInput(): IInput {
			const input = frame.getInput();

			return {
				getMousePosition(): IVector2 {
					return toIVector2(input.getMousePosition());
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

		getLayout(): ILayout {
			const layout = frame.getLayout();

			return {
				getContentRect(): IRect {
					return toIRect(layout.getContentRect());
				},

				getItemRect(): IRect {
					return toIRect(layout.getItemRect());
				}
			};
		},

		getPainter(): IPainter {
			const painter = frame.getPainter();

			return {
				move(x: number, y: number) {
					painter.move(x, y);
				},

				getPosition(): IVector2 {
					return toIVector2(painter.getPosition());
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

				getTextWidth(text: string, font: number, scale: number): number {
					return painter.getTextWidth(text, font, scale);
				},

				getTextLineCount(text: string, font: number, scale: number, w: number): number {
					return painter.getTextLineCount(text, font, scale, w);
				},

				drawText(text: string, font: number, scale: number) {
					painter.drawText(text, font, scale);
				},

				drawMultilineText(text: string, font: number, scale: number, w: number) {
					painter.drawMultilineText(text, font, scale, w);
				}
			};
		},

		getRect(): IRect {
			return toIRect(frame.getRect());
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

		getStyleProperty(selector: string, property: string): any {
			return Frame.getStyleProperty(selector, property);
		}
	};
}

/**
 * @category General
 */
export function isDebugEnabled(): boolean {
	return Frame.isDebugEnabled();
}

/**
 * @category General
 */
export function setDebugEnabled(enabled: boolean) {
	Frame.setDebugEnabled(enabled);
}

/**
 * @category Frame
 */
export function setNextFramePosition(x: number, y: number) {
	Frame.setNextFramePosition(x, y);
}

/**
 * @category Frame
 */
export function setNextFrameSpacing(x: number, y: number) {
	Frame.setNextFrameSpacing(x, y);
}

/**
 * @category Frame
 */
export function setNextFrameDisableBackground() {
	Frame.setNextFrameDisableBackground();
}

/**
 * @category Frame
 */
export function setNextFrameDisableBorder() {
	Frame.setNextFrameDisableBorder();
}

/**
 * @category Frame
 */
export function setNextFrameDisableInput() {
	Frame.setNextFrameDisableInput();
}

/**
 * @category Frame
 */
export function setNextFrameDisableMove() {
	Frame.setNextFrameDisableMove();
}

/**
 * @category Frame
 */
export function beginFrame(id: string | null = null) {
	setFrame(new Frame(id ?? undefined));
}

/**
 * @category Frame
 */
export function endFrame(): IFrameResponse {
	const frame = getFrameChecked();

	frame.end();

	const rect = frame.getRect();

	setFrame(null);

	return { rect: toIRect(rect) };
}

/**
 * @category Frame
 */
export function isItemHovered(): boolean {
	return getFrameChecked().isItemHovered();
}

/**
 * @category Frame
 */
export function isItemClicked(): boolean {
	return getFrameChecked().isItemClicked();
}

/**
 * @category Frame
 */
export function beginRow() {
	getFrameChecked().getLayout().beginRow();
}

/**
 * @category Frame
 */
export function endRow() {
	getFrameChecked().getLayout().endRow();
}

/**
 * @category Frame
 */
export function setNextItemWidth(w: number) {
	getFrameChecked().setNextItemWidth(w);
}

/**
 * @category Frame
 */
export function pushItemWidth(w: number) {
	getFrameChecked().pushItemWidth(w);
}

/**
 * @category Frame
 */
export function popItemWidth() {
	getFrameChecked().popItemWidth();
}

/**
 * @category Style
 */
export function addStyleSheet(sheet: string) {
	Frame.getStyle().addSheet(sheet);
}

/**
 * @category Style
 */
export function resetStyle() {
	Frame.getStyle().reset();
}

/**
 * @category Style
 */
export function registerStylePropertyAsColor(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Color);
}

/**
 * @category Style
 */
export function registerStylePropertyAsFloat(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Float);
}

/**
 * @category Style
 */
export function registerStylePropertyAsImage(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Image);
}

/**
 * @category Style
 */
export function registerStylePropertyAsInteger(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Integer);
}

/**
 * @category Style
 */
export function setNextFrameStyleId(id: string) {
	Frame.setNextFrameStyleId(id);
}

/**
 * @category Style
 */
export function setNextItemStyleId(id: string) {
	getFrameChecked().setNextItemStyleId(id);
}

/**
 * @category Style
 */
export function pushItemStyleId(id: string) {
	getFrameChecked().pushItemStyleId(id);
}

/**
 * @category Style
 */
export function popItemStyleId() {
	getFrameChecked().popItemStyleId();
}
