import { Color, Image, Rect, Vector2 } from '../exports';
import { Context } from './context';
import { Style, StylePropertyValues } from './style';

class RowState {
	isFirstItem = true;
	size = new Vector2();
}

class WindowDragState {
	pos = new Vector2();
}

export class Painter {
	private style = new Style();
	private pos = new Vector2();
	private color: Color = [0, 0, 0, 255];
	private skipDrawing = true;
	private contentSize = new Vector2();
	private textEntryIndex = -1;
	private rowState: RowState | null = null;
	private windowRect = new Rect();
	private windowDragState: WindowDragState | null = null;
	private windowSpacing = new Vector2();
	private isFirstItem = true;
	private itemRect = new Rect();

	constructor(private context: Context) {}

	beginWindow(x: number, y: number) {
		this.contentSize = new Vector2();
		this.textEntryIndex = -1;
		this.isFirstItem = true;

		this.windowRect.pos = new Vector2(x, y);
		this.setPosition(this.windowRect.pos.x, this.windowRect.pos.y);

		const windowSpacing = this.context.getWindowSpacing();
		this.windowSpacing.x = windowSpacing !== undefined ? windowSpacing.x : this.style.window.spacing.x;
		this.windowSpacing.y = windowSpacing !== undefined ? windowSpacing.y : this.style.window.spacing.y;

		if (this.skipDrawing) return;

		if (!this.context.isWindowNoDrag()) this.beginWindowDrag();

		if (!this.context.isWindowNoBackground())
			this.drawItemBackground(
				this.style.getProperties(this.context.getWindowId() ?? 'window'),
				this.windowRect.size.x,
				this.windowRect.size.y
			);
	}

	endWindow(): Rect {
		if (!this.context.isWindowNoDrag()) this.endWindowDrag();

		this.windowRect.size = new Vector2(
			this.isFirstItem ? 0 : this.contentSize.x + this.style.window.margins.x * 2,
			this.isFirstItem ? 0 : this.contentSize.y + this.style.window.margins.y * 2
		);

		this.skipDrawing = false;

		return new Rect(this.windowRect.pos, this.windowRect.size);
	}

	skipNextDrawing() {
		this.skipDrawing = true;
	}

	private beginWindowDrag() {
		const input = this.context.getInput();

		if (
			input.isRectHovered(this.pos.x, this.pos.y, this.windowRect.size.x, this.style.window.margins.y) &&
			input.getIsLmbPressed()
		) {
			if (!this.windowDragState) this.windowDragState = new WindowDragState();
			const mousePos = input.getMousePos();
			this.windowDragState.pos = new Vector2(mousePos.x, mousePos.y);
		}
	}

	private endWindowDrag() {
		if (!this.windowDragState) return;

		const input = this.context.getInput();

		if (input.getIsLmbDown()) {
			const mousePos = input.getMousePos();

			this.windowRect.pos = new Vector2(
				this.windowRect.pos.x + mousePos.x - this.windowDragState.pos.x,
				this.windowRect.pos.y + mousePos.y - this.windowDragState.pos.y
			);

			this.windowDragState.pos = new Vector2(mousePos.x, mousePos.y);
		} else this.windowDragState = null;
	}

	getX(): number {
		return this.pos.x;
	}

	getY(): number {
		return this.pos.y;
	}

	beginRow() {
		if (!this.rowState) this.rowState = new RowState();
	}

	endRow() {
		if (!this.rowState) return;

		this.contentSize = new Vector2(
			Math.max(this.contentSize.x, this.rowState.size.x),
			this.contentSize.y + this.rowState.size.y
		);

		this.setPosition(this.windowRect.pos.x + this.style.window.margins.x, this.pos.y + this.rowState.size.y);

		this.rowState = null;
	}

	isRowMode(): boolean {
		return this.rowState !== null;
	}

	beginItem(w: number, h: number) {
		if (this.isFirstItem) this.move(this.style.window.margins.x, this.style.window.margins.y);
		else {
			let ho = 0;
			if (this.rowState && !this.rowState.isFirstItem) {
				ho = this.windowSpacing.x;
				this.rowState.size.x += ho;
			}

			let vo = 0;
			if (!this.rowState || this.rowState.isFirstItem) vo = this.windowSpacing.y;

			this.contentSize.x += ho;
			this.contentSize.y += vo;

			this.move(ho, vo);
		}

		this.itemRect = new Rect(new Vector2(this.pos.x, this.pos.y), new Vector2(w, h));

		if (this.rowState) this.rowState.isFirstItem = false;
		this.isFirstItem = false;
	}

	endItem() {
		const w = this.itemRect.size.x;
		const h = this.itemRect.size.y;

		this.drawDebug(w, h);

		if (this.rowState) {
			this.rowState.size = new Vector2(this.rowState.size.x + w, Math.max(this.rowState.size.y, h));
			this.setPosition(this.itemRect.pos.x + w, this.itemRect.pos.y);
		} else {
			this.contentSize = new Vector2(Math.max(w, this.contentSize.x), this.contentSize.y + h);
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
		if (!this.skipDrawing)
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
		if (!this.skipDrawing)
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
		if (this.textEntryIndex == -1) return 0;

		BeginTextCommandGetWidth(this.getTextEntry());
		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(): number {
		if (this.textEntryIndex == -1) return 0;

		BeginTextCommandLineCount(this.getTextEntry());
		return EndTextCommandLineCount(this.pos.x, this.pos.y);
	}

	setText(font: number, scale: number, text: string) {
		SetTextFont(font);
		SetTextScale(1, scale);

		++this.textEntryIndex;
		AddTextEntry(this.getTextEntry(), text);
	}

	setTextWidth(w: number) {
		SetTextWrap(this.pos.x, this.pos.x + w);
	}

	drawText() {
		if (this.skipDrawing || this.textEntryIndex == -1) return;

		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.pos.x, this.pos.y);
	}

	drawDebug(w: number, h = this.style.item.height) {
		if (this.skipDrawing || !this.context.isDebugEnabled()) return;

		this.setPosition(this.itemRect.pos.x, this.itemRect.pos.y);
		this.setColor(this.style.getProperty<Color>('window', 'color'));
		this.drawRect(w, h);
	}

	private getTextEntry(): string {
		return `VEIN_TEXT_ENTRY_${this.textEntryIndex}`;
	}
}
