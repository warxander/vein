import { Context } from './core/context';

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

/** @ignore */
export type Color = [number, number, number, number];

/** @ignore */
export type FontSize = number;

/** @ignore */
export type Image = [string, string];

export class Vector2 {
	constructor(public x: number = 0, public y: number = 0) {}
}

export class Rect {
	constructor(public pos: Vector2 = new Vector2(), public size: Vector2 = new Vector2()) {}
}

/** @ignore */
export const context: Context = new Context();

export interface IContext {
	beginItem(w: number, h: number): void;
	endItem(): void;

	tryGetItemWidth(): number | null;
	tryGetItemId(): string | null;

	getPainter(): IPainter;

	isItemHovered(): boolean;
	isItemClicked(): boolean;
}

export interface IPainter {
	move(x: number, y: number): void;

	getPosition(): [number, number];
	setPosition(x: number, y: number): void;

	setColor(r: number, g: number, b: number, a: number): void;

	drawRect(w: number, h: number): void;

	drawSprite(dict: string, name: string, w: number, h: number): void;

	setText(font: number, scale: number, text: string): void;
	setTextWidth(w: number): void;
	getTextWidth(): number;
	drawText(): void;
}

export function getContext(): IContext {
	return {
		beginItem(w: number, h: number) {
			context.beginItem(w, h);
		},

		endItem() {
			context.endItem();
		},

		tryGetItemWidth(): number | null {
			return context.tryGetItemWidth() ?? null;
		},

		tryGetItemId(): string | null {
			return context.tryGetItemId() ?? null;
		},

		getPainter(): IPainter {
			return {
				move(x: number, y: number) {
					context.getPainter().move(x, y);
				},

				getPosition(): [number, number] {
					const painter = context.getPainter();
					return [painter.getX(), painter.getY()];
				},

				setPosition(x: number, y: number) {
					context.getPainter().setPosition(x, y);
				},

				setColor(r: number, g: number, b: number, a: number) {
					context.getPainter().setColor([r, g, b, a]);
				},

				drawRect(w: number, h: number) {
					context.getPainter().drawRect(w, h);
				},

				drawSprite(dict: string, name: string, w: number, h: number) {
					context.getPainter().drawSprite(dict, name, w, h);
				},

				setText(font: number, scale: number, text: string) {
					context.getPainter().setText(font, scale, text);
				},

				setTextWidth(w: number) {
					context.getPainter().setTextWidth(w);
				},

				getTextWidth(): number {
					return context.getPainter().getTextWidth();
				},

				drawText() {
					context.getPainter().drawText();
				}
			};
		},

		isItemHovered(): boolean {
			return context.isItemHovered();
		},

		isItemClicked(): boolean {
			return context.isItemClicked();
		}
	};
}

export function setDebugEnabled(enabled: boolean) {
	context.setDebugEnabled(enabled);
}

export function isDebugEnabled(): boolean {
	return context.isDebugEnabled();
}

/** `false` by default */
export function setNextWindowNoDrag(isNoDrag: boolean) {
	context.setWindowNoDrag(isNoDrag);
}

/** `false` by default */
export function setNextWindowNoBackground(isNoBackground: boolean) {
	context.setWindowNoBackground(isNoBackground);
}

/** Used as a selector name */
export function setNextWindowId(id: string) {
	context.setWindowId(id);
}

export function setNextWindowSpacing(x: number, y: number) {
	context.setWindowSpacing(x, y);
}

export function beginWindow(x: number | null, y: number | null) {
	context.beginWindow(x !== null ? x : 0.33, y !== null ? y : 0.33);
}

export function endWindow(): Rect {
	return context.endWindow();
}

/** `true` if the last drawn item was hovered */
export function isItemHovered(): boolean {
	return context.isItemHovered();
}

/** `true` if the last drawn item was clicked */
export function isItemClicked(): boolean {
	return context.isItemClicked();
}

/** Eliminates visual redrawing artifacts if the item layout was drastically changed */
export function setWindowSkipNextDrawing() {
	context.setWindowSkipNextDrawing();
}

export function beginRow() {
	context.getPainter().beginRow();
}

export function endRow() {
	context.getPainter().endRow();
}

export function setNextItemWidth(w: number) {
	context.setNextItemWidth(w);
}

export function pushItemWidth(w: number) {
	context.pushItemWidth(w);
}

export function popItemWidth() {
	context.popItemWidth();
}

export function setStyleSheet(styleSheet: string) {
	context.getPainter().getStyle().setSheet(styleSheet);
}

export function useDefaultStyle() {
	context.getPainter().getStyle().useDefault();
}

/** Used as a selector name */
export function setNextItemId(id: string) {
	context.setNextItemId(id);
}

/** Used as a selector name */
export function pushItemId(id: string) {
	context.pushItemId(id);
}

export function popItemId() {
	context.popItemId();
}
