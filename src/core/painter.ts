import { Color, Image, Rect, Vector2 } from '../exports';
import { Context } from './context';
import { Style, StylePropertyValues } from './style';

class LayoutState {
	hasItems = false;
	size = new Vector2();
	textEntryIndex = -1;
}

class RowState {
	isInRowMode = false;
	isFirstItem = false;
	size = new Vector2();
}

class DragState {
	isInProcess = false;
	origin = new Vector2();
}

export class Painter {
	private style = new Style();
	private pos = new Vector2();
	private color: Color = [0, 0, 0, 255];
	private layoutState = new LayoutState();
	private dragState = new DragState();
	private rowState = new RowState();
	private itemRect = new Rect();
	private windowRect = new Rect();
	private windowSpacing = new Vector2();

	constructor(private context: Context) {}

	beginWindow(x: number, y: number) {
		this.windowRect.pos = new Vector2(x, y);

		this.setPosition(this.windowRect.pos.x, this.windowRect.pos.y);

		this.layoutState.size = new Vector2();
		this.layoutState.textEntryIndex = -1;

		if (!this.isLayoutValid()) return;

		if (!this.context.isWindowNoDrag()) this.beginDrag();

		if (!this.context.isWindowNoBackground())
			this.drawItemBackground(
				this.style.getProperties(this.context.getWindowId() ?? 'window'),
				this.windowRect.size.x,
				this.windowRect.size.y
			);

		const windowSpacing = this.context.getWindowSpacing();
		this.windowSpacing.x = windowSpacing !== undefined ? windowSpacing.x : this.style.window.spacing.x;
		this.windowSpacing.y = windowSpacing !== undefined ? windowSpacing.y : this.style.window.spacing.y;

		this.layoutState = new LayoutState();
	}

	endWindow(): Rect {
		if (!this.context.isWindowNoDrag()) this.endDrag();

		this.windowRect.size = new Vector2(
			this.layoutState.hasItems ? this.layoutState.size.x + this.style.window.margins.x * 2 : 0,
			this.layoutState.hasItems ? this.layoutState.size.y + this.style.window.margins.y * 2 : 0
		);

		return new Rect(this.windowRect.pos, this.windowRect.size);
	}

	private isLayoutValid(): boolean {
		return this.layoutState.hasItems && !this.context.isWindowSkipNextDrawing();
	}

	private beginDrag() {
		if (this.dragState.isInProcess) return;

		const input = this.context.getInput();

		if (
			input.isRectHovered(this.pos.x, this.pos.y, this.windowRect.size.x, this.style.window.margins.y) &&
			input.getIsLmbPressed()
		) {
			const mousePos = input.getMousePos();
			this.dragState.origin = new Vector2(mousePos.x, mousePos.y);
			this.dragState.isInProcess = true;
		}
	}

	private endDrag() {
		if (!this.dragState.isInProcess) return;

		const input = this.context.getInput();

		if (input.getIsLmbDown()) {
			const mousePos = input.getMousePos();

			this.windowRect.pos = new Vector2(
				this.windowRect.pos.x + mousePos.x - this.dragState.origin.x,
				this.windowRect.pos.y + mousePos.y - this.dragState.origin.y
			);

			this.dragState.origin = new Vector2(mousePos.x, mousePos.y);
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

		this.layoutState.size = new Vector2(
			Math.max(this.layoutState.size.x, this.rowState.size.x),
			this.layoutState.size.y + this.rowState.size.y
		);

		this.setPosition(this.windowRect.pos.x + this.style.window.margins.x, this.pos.y + this.rowState.size.y);

		this.rowState.isInRowMode = false;
		this.rowState.isFirstItem = true;

		this.rowState.size = new Vector2();
	}

	isRowMode(): boolean {
		return this.rowState.isInRowMode;
	}

	beginItem(w: number, h: number) {
		if (!this.layoutState.hasItems) this.move(this.style.window.margins.x, this.style.window.margins.y);
		else {
			let ho = 0;
			if (this.rowState.isInRowMode && !this.rowState.isFirstItem) {
				ho = this.windowSpacing.x;
				this.rowState.size.x += ho;
			}

			let vo = 0;
			if (!this.rowState.isInRowMode || this.rowState.isFirstItem) vo = this.windowSpacing.y;

			this.layoutState.size.x += ho;
			this.layoutState.size.y += vo;

			this.move(ho, vo);
		}

		this.itemRect.pos = new Vector2(this.pos.x, this.pos.y);
		this.itemRect.size = new Vector2(w, h);

		if (this.rowState.isInRowMode) this.rowState.isFirstItem = false;
		this.layoutState.hasItems = true;
	}

	endItem() {
		const w = this.itemRect.size.x;
		const h = this.itemRect.size.y;

		this.drawDebug(w, h);

		if (this.rowState.isInRowMode) {
			this.rowState.size = new Vector2(this.rowState.size.x + w, Math.max(this.rowState.size.y, h));
			this.setPosition(this.itemRect.pos.x + w, this.itemRect.pos.y);
		} else {
			this.layoutState.size = new Vector2(Math.max(w, this.layoutState.size.x), this.layoutState.size.y + h);
			this.setPosition(this.itemRect.pos.x, this.itemRect.pos.y + h);
		}
	}

	getItemX(): number {
		return this.itemRect.pos.x;
	}

	getItemY(): number {
		return this.itemRect.pos.y;
	}

	getItemWidth(): number {
		return this.itemRect.size.x;
	}

	getItemHeight(): number {
		return this.itemRect.size.y;
	}

	getWindowSpacing(): Vector2 {
		return this.windowSpacing;
	}

	setPosition(x: number, y: number) {
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

	drawSprite(dict: string, name: string, w: number, h: number, heading?: number) {
		if (this.isLayoutValid())
			DrawSprite(
				dict,
				name,
				this.pos.x + w / 2,
				this.pos.y + h / 2,
				w,
				h,
				heading ?? 0,
				this.color[0],
				this.color[1],
				this.color[2],
				this.color[3]
			);
	}

	getTextWidth(): number {
		if (this.layoutState.textEntryIndex == -1) return 0;

		BeginTextCommandGetWidth(this.getTextEntry());
		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(): number {
		if (this.layoutState.textEntryIndex == -1) return 0;

		BeginTextCommandLineCount(this.getTextEntry());
		return EndTextCommandLineCount(this.pos.x, this.pos.y);
	}

	setText(font: number, scale: number, text: string) {
		SetTextFont(font);
		SetTextScale(1, scale);

		++this.layoutState.textEntryIndex;
		AddTextEntry(this.getTextEntry(), text);
	}

	setTextWidth(w: number) {
		SetTextWrap(this.pos.x, this.pos.x + w);
	}

	drawText() {
		if (!this.isLayoutValid() || this.layoutState.textEntryIndex == -1) return;

		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.pos.x, this.pos.y);
	}

	drawDebug(w: number, h = this.style.item.height) {
		if (!this.isLayoutValid() || !this.context.isDebugEnabled()) return;

		this.setPosition(this.itemRect.pos.x, this.itemRect.pos.y);
		this.setColor(this.style.getProperty<Color>('window', 'color'));
		this.drawRect(w, h);
	}

	private getTextEntry(): string {
		return `VEIN_TEXT_ENTRY_${this.layoutState.textEntryIndex}`;
	}
}
