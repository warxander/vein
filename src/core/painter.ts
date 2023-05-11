import { Color, Position, PositionObject, TextEntryComponents } from '../common/types';
import { getIsDebugEnabled } from '../index';
import { Context } from './context';
import { Style } from './style';
import { addTextComponents } from './utils';

class Size {
	w: number;
	h: number;

	constructor() {
		this.w = 0;
		this.h = 0;
	}

	set(w: number, h: number) {
		this.w = w;
		this.h = h;
	}
}

class LayoutState {
	isValid: boolean;
	isFirstWidget: boolean;
	size: Size;

	constructor() {
		this.isValid = false;
		this.isFirstWidget = false;
		this.size = new Size();
	}
}

class RowState {
	isActive: boolean;
	isFirstWidget: boolean;
	size: Size;

	constructor() {
		this.isActive = false;
		this.isFirstWidget = false;
		this.size = new Size();
	}
}

class DragState {
	isInProcess: boolean;
	origin: Position;

	constructor() {
		this.isInProcess = false;
		this.origin = new Position();
	}
}

class Geometry {
	pos: Position;
	size: Size;

	constructor() {
		this.pos = new Position();
		this.size = new Size();
	}
}

export class Painter {
	#context: Context;
	#style: Style;
	#pos: Position;
	#color: Color;
	#layoutState: LayoutState;
	#dragState: DragState;
	#rowState: RowState;
	#widgetGeometry: Geometry;
	#windowGeometry: Geometry;

	constructor(context: Context) {
		this.#context = context;
		this.#style = new Style();
		this.#pos = new Position();
		this.#color = [0, 0, 0, 255];
		this.#layoutState = new LayoutState();
		this.#dragState = new DragState();
		this.#rowState = new RowState();
		this.#widgetGeometry = new Geometry();
		this.#windowGeometry = new Geometry();
	}

	beginWindow(x: number, y: number): void {
		this.#windowGeometry.pos.set(x, y);

		this.setPos(
			this.#windowGeometry.pos.x - this.#windowGeometry.size.w / 2,
			this.#windowGeometry.pos.y - this.#windowGeometry.size.h / 2
		);

		if (!this.#isLayoutValid()) return;

		if (!this.#context.isWindowNoDrag()) this.#beginDrag();

		if (!this.#context.isWindowNoBackground()) this.#drawWindowBackground();
	}

	endWindow(): PositionObject {
		if (!this.#context.isWindowNoDrag()) this.#endDrag();

		this.#layoutState.isValid = !this.#layoutState.isFirstWidget;
		this.#layoutState.isFirstWidget = true;

		this.#windowGeometry.size.set(
			this.#layoutState.isValid ? this.#layoutState.size.w + this.#style.window.margins.h * 2 : 0,
			this.#layoutState.isValid ? this.#layoutState.size.h + this.#style.window.margins.v * 2 : 0
		);

		this.#layoutState.size.set(0, 0);

		return { x: this.#windowGeometry.pos.x, y: this.#windowGeometry.pos.y };
	}

	#isLayoutValid(): boolean {
		return this.#layoutState.isValid && !this.#context.isWindowSkipNextDrawing();
	}

	#drawWindowBackground(): void {
		const outlineWidth = this.#style.window.outlineWidth;
		const outlineHeight = outlineWidth * GetAspectRatio(false);

		this.move(-outlineWidth, -outlineHeight);
		this.setColor(this.#style.color.widget);
		this.drawRect(this.#windowGeometry.size.w + outlineWidth * 2, this.#windowGeometry.size.h + outlineHeight * 2);
		this.move(outlineWidth, outlineHeight);

		this.setColor(this.#style.color.window);
		this.drawRect(this.#windowGeometry.size.w, this.#windowGeometry.size.h);
	}

	#beginDrag(): void {
		if (this.#dragState.isInProcess) return;

		const input = this.#context.getInput();

		if (
			input.isRectHovered(this.#pos.x, this.#pos.y, this.#windowGeometry.size.w, this.#style.window.margins.v) &&
			input.getIsLmbPressed()
		) {
			const mousePos: Position = input.getMousePos();
			this.#dragState.origin.set(mousePos.x, mousePos.y);
			this.#dragState.isInProcess = true;
		}
	}

	#endDrag(): void {
		if (!this.#dragState.isInProcess) return;

		const input = this.#context.getInput();

		if (input.getIsLmbDown()) {
			const mousePos: Position = input.getMousePos();

			this.#windowGeometry.pos.set(
				this.#windowGeometry.pos.x + mousePos.x - this.#dragState.origin.x,
				this.#windowGeometry.pos.y + mousePos.y - this.#dragState.origin.y
			);

			this.#dragState.origin.set(mousePos.x, mousePos.y);
		} else this.#dragState.isInProcess = false;
	}

	getX(): number {
		return this.#pos.x;
	}

	getY(): number {
		return this.#pos.y;
	}

	beginRow(): void {
		if (!this.#rowState.isActive) {
			this.#rowState.isActive = true;
			this.#rowState.isFirstWidget = true;
		}
	}

	endRow(): void {
		if (!this.#rowState.isActive) return;

		this.#layoutState.size.set(
			Math.max(this.#layoutState.size.w, this.#rowState.size.w),
			this.#layoutState.size.h + this.#rowState.size.h
		);

		this.setPos(
			this.#windowGeometry.pos.x - this.#windowGeometry.size.w / 2 + this.#style.window.margins.h,
			this.#pos.y + this.#rowState.size.h
		);

		this.#rowState.isActive = false;
		this.#rowState.isFirstWidget = true;

		this.#rowState.size.set(0, 0);
	}

	isRowMode(): boolean {
		return this.#rowState.isActive;
	}

	beginDraw(w: number, h: number): void {
		if (this.#layoutState.isFirstWidget) this.move(this.#style.window.margins.h, this.#style.window.margins.v);
		else {
			let ho = 0;
			if (this.#rowState.isActive && !this.#rowState.isFirstWidget) {
				ho = this.#style.window.spacing.h;
				this.#rowState.size.w += ho;
			}

			let vo = 0;
			if (!this.#rowState.isActive || this.#rowState.isFirstWidget) vo = this.#style.window.spacing.v;

			this.#layoutState.size.w += ho;
			this.#layoutState.size.h += vo;

			this.move(ho, vo);
		}

		this.#widgetGeometry.pos.set(this.#pos.x, this.#pos.y);
		this.#widgetGeometry.size.set(w, h);
	}

	endDraw(): void {
		const w = this.#widgetGeometry.size.w;
		const h = this.#widgetGeometry.size.h;

		this.drawDebug(w, h);

		if (this.#rowState.isActive) {
			this.#rowState.size.set(this.#rowState.size.w + w, Math.max(this.#rowState.size.h, h));
			this.setPos(this.#widgetGeometry.pos.x + w, this.#widgetGeometry.pos.y);
			this.#rowState.isFirstWidget = false;
		} else {
			this.#layoutState.size.set(Math.max(w, this.#layoutState.size.w), this.#layoutState.size.h + h);
			this.setPos(this.#widgetGeometry.pos.x, this.#widgetGeometry.pos.y + h);
		}

		this.#layoutState.isFirstWidget = false;
	}

	getWidgetX(): number {
		return this.#widgetGeometry.pos.x;
	}

	getWidgetY(): number {
		return this.#widgetGeometry.pos.y;
	}

	getWidgetWidth(): number {
		return this.#widgetGeometry.size.w;
	}

	getWidgetHeight(): number {
		return this.#widgetGeometry.size.h;
	}

	setPos(x: number, y: number): void {
		this.#pos.x = x;
		this.#pos.y = y;
	}

	move(x: number, y: number): void {
		this.#pos.x += x;
		this.#pos.y += y;
	}

	getStyle(): Style {
		return this.#style;
	}

	setColor(color: Color): void {
		this.#color = color;
	}

	drawRect(w: number, h: number): void {
		if (this.#isLayoutValid())
			DrawRect(
				this.#pos.x + w / 2,
				this.#pos.y + h / 2,
				w,
				h,
				this.#color[0],
				this.#color[1],
				this.#color[2],
				this.#color[3]
			);
	}

	drawSprite(dict: string, name: string, w: number, h: number): void {
		if (this.#isLayoutValid())
			DrawSprite(
				dict,
				name,
				this.#pos.x + w / 2,
				this.#pos.y + h / 2,
				w,
				h,
				0,
				this.#color[0],
				this.#color[1],
				this.#color[2],
				this.#color[3]
			);
	}

	calculateTextWidth(): number {
		const textEntry: string | undefined = this.#context.getTextEntry();
		if (!textEntry) return 0;

		BeginTextCommandGetWidth(textEntry);

		const textComponents: TextEntryComponents | undefined = this.#context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		return EndTextCommandGetWidth(true);
	}

	calculateTextLineHeight(): number {
		return GetRenderedCharacterHeight(this.#style.widget.text.scale, this.#style.widget.text.font);
	}

	calculateTextLineCount(): number {
		const textEntry: string | undefined = this.#context.getTextEntry();
		if (!textEntry) return 0;

		BeginTextCommandLineCount(textEntry);

		const textComponents: TextEntryComponents | undefined = this.#context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		return EndTextCommandLineCount(this.#pos.x, this.#pos.y);
	}

	setText(text: string | undefined): void {
		if (text) this.#context.setNextTextEntry('STRING', text);
	}

	setTextOpts(font = this.#style.widget.text.font, scale = this.#style.widget.text.scale): void {
		if (!this.#context.getTextEntry()) return;

		SetTextFont(font);
		SetTextScale(scale * GetAspectRatio(false), scale);
	}

	setTextMaxWidth(w: number): void {
		if (this.#context.getTextEntry()) SetTextWrap(this.#pos.x, this.#pos.x + w);
	}

	drawText(offset = this.#style.widget.text.offset): void {
		if (!this.#isLayoutValid()) return;

		const textEntry: string | undefined = this.#context.getTextEntry();
		if (!textEntry) return;

		SetTextColour(this.#color[0], this.#color[1], this.#color[2], this.#color[3]);

		BeginTextCommandDisplayText(textEntry);

		const textComponents: TextEntryComponents | undefined = this.#context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		EndTextCommandDisplayText(this.#pos.x, this.#pos.y - offset);
	}

	drawDebug(w: number, h = this.#style.widget.height): void {
		if (!this.#isLayoutValid() || !getIsDebugEnabled()) return;

		this.setPos(this.#widgetGeometry.pos.x, this.#widgetGeometry.pos.y);
		this.setColor(this.#style.color.debug);
		this.drawRect(w, h);
	}
}
