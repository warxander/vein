import { Ui, getUiChecked, setUi } from './ui';
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

export interface IUi {
	beginItem(w: number, h: number): void;
	endItem(): void;

	tryGetItemWidth(): number | null;
	tryGetItemId(): string | null;

	setMouseCursor(mouseCursor: number): void;

	getInput(): IInput;
	getLayout(): ILayout;
	getPainter(): IPainter;

	isItemHovered(): boolean;
	isItemClicked(): boolean;

	getWindowRect(): IRect;
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

export function getUi(): IUi {
	const ui = getUiChecked();

	return {
		beginItem(w: number, h: number) {
			ui.beginItem(w, h);
		},

		endItem() {
			ui.endItem();
		},

		tryGetItemWidth(): number | null {
			return ui.tryGetItemWidth() ?? null;
		},

		tryGetItemId(): string | null {
			return ui.tryGetItemId() ?? null;
		},

		setMouseCursor(mouseCursor: number) {
			ui.setMouseCursor(mouseCursor);
		},

		getInput(): IInput {
			const input = ui.getInput();

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
			const layout = ui.getLayout();

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
			const painter = ui.getPainter();

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

		isItemHovered(): boolean {
			return ui.isItemHovered();
		},

		isItemClicked(): boolean {
			return ui.isItemClicked();
		},

		getWindowRect(): IRect {
			return toIRect(Ui.getWindowRect());
		}
	};
}

export function isDebugEnabled(): boolean {
	return Ui.isDebugEnabled();
}

export function setDebugEnabled(enabled: boolean) {
	Ui.setDebugEnabled(enabled);
}

export function setNextWindowPositionFixed() {
	Ui.setNextWindowPositionFixed();
}

/** `false` by default */
export function setNextWindowNoBackground(isNoBackground: boolean) {
	Ui.setNextWindowNoBackground(isNoBackground);
}

/** Used as a selector name */
export function setNextWindowId(id: string) {
	Ui.setNextWindowId(id);
}

export function setNextWindowSpacing(x: number, y: number) {
	Ui.setNextWindowSpacing(x, y);
}

export function setNextWindowDisableInput() {
	Ui.setNextWindowDisableInput();
}

export function beginWindow(x: number | null, y: number | null) {
	setUi(new Ui(x !== null ? x : 0.33, y !== null ? y : 0.33));
}

export function endWindow(): IRect {
	const ui = getUiChecked();

	ui.end();

	const windowRect = Ui.getWindowRect();
	setUi(null);

	return toIRect(windowRect);
}

/** `true` if the last drawn item was hovered */
export function isItemHovered(): boolean {
	return getUiChecked().isItemHovered();
}

/** `true` if the last drawn item was clicked */
export function isItemClicked(): boolean {
	return getUiChecked().isItemClicked();
}

export function beginRow() {
	getUiChecked().getLayout().beginRow();
}

export function endRow() {
	getUiChecked().getLayout().endRow();
}

export function setNextItemWidth(w: number) {
	getUiChecked().setNextItemWidth(w);
}

export function pushItemWidth(w: number) {
	getUiChecked().pushItemWidth(w);
}

export function popItemWidth() {
	getUiChecked().popItemWidth();
}

export function setStyleSheet(styleSheet: string) {
	Ui.getStyle().setSheet(styleSheet);
}

export function useDefaultStyle() {
	Ui.getStyle().useDefault();
}

/** Used as a selector name */
export function setNextItemId(id: string) {
	getUiChecked().setNextItemId(id);
}

/** Used as a selector name */
export function pushItemId(id: string) {
	getUiChecked().pushItemId(id);
}

export function popItemId() {
	getUiChecked().popItemId();
}
