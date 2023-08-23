import { Color, Image, Position, PositionInterface, TextEntryComponents } from '../common/types';
import { getIsDebugEnabled } from '../../index';
import { Context } from './context';
import { Style, StylePropertyValues } from './style';
import { addTextComponents } from './utils';

class Size {
	w = 0;
	h = 0;

	set(w: number, h: number) {
		this.w = w;
		this.h = h;
	}
}

class LayoutState {
	isValid = false;
	isFirstItem = false;
	size = new Size();
}

class RowState {
	isInRowMode = false;
	isFirstItem = false;
	size = new Size();
}

class DragState {
	isInProcess = false;
	origin = new Position();
}

class Geometry {
	pos = new Position();
	size = new Size();
}

export class Painter {
	private style = new Style();
	private pos = new Position();
	private color: Color = [0, 0, 0, 255];
	private layoutState = new LayoutState();
	private dragState = new DragState();
	private rowState = new RowState();
	private itemGeometry = new Geometry();
	private windowGeometry = new Geometry();

	constructor(private context: Context) {}

	beginWindow(x: number, y: number) {
		this.windowGeometry.pos.set(x, y);

		this.setPos(
			this.windowGeometry.pos.x - this.windowGeometry.size.w / 2,
			this.windowGeometry.pos.y - this.windowGeometry.size.h / 2
		);

		if (!this.isLayoutValid()) return;

		if (!this.context.isWindowNoDrag()) this.beginDrag();

		if (!this.context.isWindowNoBackground())
			this.drawItemBackground(
				this.style.getProperties(this.context.getWindowId() ?? 'window'),
				this.windowGeometry.size.w,
				this.windowGeometry.size.h
			);
	}

	endWindow(): PositionInterface {
		if (!this.context.isWindowNoDrag()) this.endDrag();

		this.layoutState.isValid = !this.layoutState.isFirstItem;
		this.layoutState.isFirstItem = true;

		this.windowGeometry.size.set(
			this.layoutState.isValid ? this.layoutState.size.w + this.style.window.margins.h * 2 : 0,
			this.layoutState.isValid ? this.layoutState.size.h + this.style.window.margins.v * 2 : 0
		);

		this.layoutState.size.set(0, 0);

		return { x: this.windowGeometry.pos.x, y: this.windowGeometry.pos.y };
	}

	private isLayoutValid(): boolean {
		return this.layoutState.isValid && !this.context.isWindowSkipNextDrawing();
	}

	private beginDrag() {
		if (this.dragState.isInProcess) return;

		const input = this.context.getInput();

		if (
			input.isRectHovered(this.pos.x, this.pos.y, this.windowGeometry.size.w, this.style.window.margins.v) &&
			input.getIsLmbPressed()
		) {
			const mousePos: Position = input.getMousePos();
			this.dragState.origin.set(mousePos.x, mousePos.y);
			this.dragState.isInProcess = true;
		}
	}

	private endDrag() {
		if (!this.dragState.isInProcess) return;

		const input = this.context.getInput();

		if (input.getIsLmbDown()) {
			const mousePos: Position = input.getMousePos();

			this.windowGeometry.pos.set(
				this.windowGeometry.pos.x + mousePos.x - this.dragState.origin.x,
				this.windowGeometry.pos.y + mousePos.y - this.dragState.origin.y
			);

			this.dragState.origin.set(mousePos.x, mousePos.y);
		} else this.dragState.isInProcess = false;
	}

	getX(): number {
		return this.pos.x;
	}

	getY(): number {
		return this.pos.y;
	}

	beginRow() {
		if (!this.rowState.isInRowMode) {
			this.rowState.isInRowMode = true;
			this.rowState.isFirstItem = true;
		}
	}

	endRow() {
		if (!this.rowState.isInRowMode) return;

		this.layoutState.size.set(
			Math.max(this.layoutState.size.w, this.rowState.size.w),
			this.layoutState.size.h + this.rowState.size.h
		);

		this.setPos(
			this.windowGeometry.pos.x - this.windowGeometry.size.w / 2 + this.style.window.margins.h,
			this.pos.y + this.rowState.size.h
		);

		this.rowState.isInRowMode = false;
		this.rowState.isFirstItem = true;

		this.rowState.size.set(0, 0);
	}

	isRowMode(): boolean {
		return this.rowState.isInRowMode;
	}

	beginDraw(w: number, h: number) {
		if (this.layoutState.isFirstItem) this.move(this.style.window.margins.h, this.style.window.margins.v);
		else {
			let ho = 0;
			if (this.rowState.isInRowMode && !this.rowState.isFirstItem) {
				ho = this.style.window.spacing.h;
				this.rowState.size.w += ho;
			}

			let vo = 0;
			if (!this.rowState.isInRowMode || this.rowState.isFirstItem) vo = this.style.window.spacing.v;

			this.layoutState.size.w += ho;
			this.layoutState.size.h += vo;

			this.move(ho, vo);
		}

		this.itemGeometry.pos.set(this.pos.x, this.pos.y);
		this.itemGeometry.size.set(w, h);
	}

	endDraw() {
		const w = this.itemGeometry.size.w;
		const h = this.itemGeometry.size.h;

		this.drawDebug(w, h);

		if (this.rowState.isInRowMode) {
			this.rowState.size.set(this.rowState.size.w + w, Math.max(this.rowState.size.h, h));
			this.setPos(this.itemGeometry.pos.x + w, this.itemGeometry.pos.y);
			this.rowState.isFirstItem = false;
		} else {
			this.layoutState.size.set(Math.max(w, this.layoutState.size.w), this.layoutState.size.h + h);
			this.setPos(this.itemGeometry.pos.x, this.itemGeometry.pos.y + h);
		}

		this.layoutState.isFirstItem = false;
	}

	getItemX(): number {
		return this.itemGeometry.pos.x;
	}

	getItemY(): number {
		return this.itemGeometry.pos.y;
	}

	getItemWidth(): number {
		return this.itemGeometry.size.w;
	}

	getItemHeight(): number {
		return this.itemGeometry.size.h;
	}

	setPos(x: number, y: number) {
		this.pos.x = x;
		this.pos.y = y;
	}

	move(x: number, y: number) {
		this.pos.x += x;
		this.pos.y += y;
	}

	getStyle(): Style {
		return this.style;
	}

	setColor(color: Color) {
		this.color = color;
	}

	drawItemBackground(properties: StylePropertyValues, w: number, h: number) {
		const backgroundImage = properties.tryGet<Image>('background-image');
		if (backgroundImage !== undefined) {
			const backgroundColor = properties.tryGet<Color>('background-color');
			this.setColor(backgroundColor ?? Style.SPRITE_COLOR);
			this.drawSprite(backgroundImage[0], backgroundImage[1], w, h);
		} else {
			this.setColor(properties.get<Color>('background-color'));
			this.drawRect(w, h);
		}
	}

	drawRect(w: number, h: number) {
		if (this.isLayoutValid())
			DrawRect(
				this.pos.x + w / 2,
				this.pos.y + h / 2,
				w,
				h,
				this.color[0],
				this.color[1],
				this.color[2],
				this.color[3]
			);
	}

	drawSprite(dict: string, name: string, w: number, h: number) {
		if (this.isLayoutValid())
			DrawSprite(
				dict,
				name,
				this.pos.x + w / 2,
				this.pos.y + h / 2,
				w,
				h,
				0,
				this.color[0],
				this.color[1],
				this.color[2],
				this.color[3]
			);
	}

	getTextWidth(): number {
		const textEntry: string | undefined = this.context.getTextEntry();
		if (!textEntry) return 0;

		BeginTextCommandGetWidth(textEntry);

		const textComponents: TextEntryComponents | undefined = this.context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(): number {
		const textEntry: string | undefined = this.context.getTextEntry();
		if (!textEntry) return 0;

		BeginTextCommandLineCount(textEntry);

		const textComponents: TextEntryComponents | undefined = this.context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		return EndTextCommandLineCount(this.pos.x, this.pos.y);
	}

	setText(font: number, scale: number, text?: string, w?: number) {
		SetTextFont(font);
		SetTextScale(1, scale);
		if (text !== undefined) this.context.setNextTextEntry('STRING', text);
		if (w !== undefined) SetTextWrap(this.pos.x, this.pos.x + w);
	}

	drawText() {
		if (!this.isLayoutValid()) return;

		const textEntry: string | undefined = this.context.getTextEntry();
		if (!textEntry) return;

		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(textEntry);

		const textComponents: TextEntryComponents | undefined = this.context.getTextComponents();
		if (textComponents) addTextComponents(textComponents);

		EndTextCommandDisplayText(this.pos.x, this.pos.y);
	}

	drawDebug(w: number, h = this.style.item.height) {
		if (!this.isLayoutValid() || !getIsDebugEnabled()) return;

		this.setPos(this.itemGeometry.pos.x, this.itemGeometry.pos.y);
		this.setColor(this.style.getProperty<Color>('window', 'color'));
		this.drawRect(w, h);
	}
}
