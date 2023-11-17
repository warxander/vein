import { Frame, getFrameChecked, setFrame } from './core/frame';
import { StylePropertyType } from './core/style';
import { Rect, Vector2 } from './core/types';

function toIRect(rect: Rect): IRect {
	return { x: rect.position.x, y: rect.position.y, w: rect.size.x, h: rect.size.y };
}

function toIVector2(vector2: Vector2): IVector2 {
	return { x: vector2.x, y: vector2.y };
}

export * from './items/button';
export * from './items/checkbox';
export * from './items/collapsingheader';
export * from './items/dummy';
export * from './items/heading';
export * from './items/hyperlink';
export * from './items/label';
export * from './items/progressbar';
export * from './items/selectable';
export * from './items/separator';
export * from './items/slider';
export * from './items/spacing';
export * from './items/sprite';
export * from './items/spritebutton';
export * from './items/textarea';
export * from './items/textedit';

export interface IVector2 {
	x: number;
	y: number;
}

export interface IRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IFrame {
	getInput(): IInput;
	getLayout(): ILayout;
	getPainter(): IPainter;

	getRect(): IRect;

	beginItem(w: number, h: number): void;
	endItem(): void;

	tryGetItemWidth(): number | null;

	isItemHovered(): boolean;
	isItemClicked(): boolean;

	setMouseCursor(mouseCursor: number): void;

	buildStyleSelector(class_: string, subClass: string | null): string;
	getStyleProperty(selector: string, property: string): any;
}

export interface IInput {
	getMousePosition(): IVector2;

	isKeyPressed(key: number): boolean;
	isKeyReleased(key: number): boolean;
	isKeyDown(key: number): boolean;
}

export interface ILayout {
	getContentRect(): IRect;
	getItemRect(): IRect;
}

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

export function getFrame(): IFrame {
	const frame = getFrameChecked();

	return {
		getInput(): IInput {
			const input = frame.getInput();

			return {
				getMousePosition(): IVector2 {
					return toIVector2(input.getMousePosition());
				},

				isKeyPressed(key: number): boolean {
					return input.isKeyPressed(key);
				},

				isKeyReleased(key: number): boolean {
					return input.isKeyReleased(key);
				},

				isKeyDown(key: number): boolean {
					return input.isKeyDown(key);
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
			return toIRect(Frame.getRect());
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

		isItemHovered(): boolean {
			return frame.isItemHovered();
		},

		isItemClicked(): boolean {
			return frame.isItemClicked();
		},

		setMouseCursor(mouseCursor: number) {
			frame.setMouseCursor(mouseCursor);
		},

		buildStyleSelector(class_: string, subClass: string | null): string {
			return frame.buildStyleSelector(class_, subClass ?? undefined);
		},

		getStyleProperty(selector: string, property: string): any {
			return Frame.getStyleProperty(selector, property);
		}
	};
}

export function isDebugEnabled(): boolean {
	return Frame.isDebugEnabled();
}

export function setDebugEnabled(enabled: boolean) {
	Frame.setDebugEnabled(enabled);
}

export function setNextFramePositionFixed() {
	Frame.setNextFramePositionFixed();
}

export function setNextFrameDisableBackground() {
	Frame.setNextFrameDisableBackground();
}

export function setNextFrameStyleId(id: string) {
	Frame.setNextFrameStyleId(id);
}

export function setNextFrameSpacing(x: number, y: number) {
	Frame.setNextFrameSpacing(x, y);
}

export function setNextFrameDisableInput() {
	Frame.setNextFrameDisableInput();
}

export function beginFrame(x: number | null, y: number | null) {
	setFrame(new Frame(x !== null ? x : 0.33, y !== null ? y : 0.33));
}

export function endFrame(): IRect {
	const frame = getFrameChecked();

	frame.end();

	const frameRect = Frame.getRect();
	setFrame(null);

	return toIRect(frameRect);
}

/** `true` if the last drawn item was hovered */
export function isItemHovered(): boolean {
	return getFrameChecked().isItemHovered();
}

/** `true` if the last drawn item was clicked */
export function isItemClicked(): boolean {
	return getFrameChecked().isItemClicked();
}

export function beginRow() {
	getFrameChecked().getLayout().beginRow();
}

export function endRow() {
	getFrameChecked().getLayout().endRow();
}

export function setNextItemWidth(w: number) {
	getFrameChecked().setNextItemWidth(w);
}

export function pushItemWidth(w: number) {
	getFrameChecked().pushItemWidth(w);
}

export function popItemWidth() {
	getFrameChecked().popItemWidth();
}

export function addStyleSheet(sheet: string) {
	Frame.getStyle().addSheet(sheet);
}

export function resetStyle() {
	Frame.getStyle().reset();
}

export function registerStylePropertyAsColor(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Color);
}

export function registerStylePropertyAsFontSize(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.FontSize);
}

export function registerStylePropertyAsImage(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Image);
}

export function registerStylePropertyAsInteger(property: string) {
	Frame.getStyle().registerProperty(property, StylePropertyType.Integer);
}

export function setNextItemStyleId(id: string) {
	getFrameChecked().setNextItemStyleId(id);
}

export function pushItemStyleId(id: string) {
	getFrameChecked().pushItemStyleId(id);
}

export function popItemStyleId() {
	getFrameChecked().popItemStyleId();
}
