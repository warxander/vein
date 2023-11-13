import { Color, Image, Rect, Vector2 } from '../exports';
import { Context } from './context';
import { InputKey } from './input';
import { Style, StylePropertyValues } from './style';

class RowState {
	isFirstItem = true;
	size = new Vector2();
}

export enum MouseCursor {
	None = 0,
	Normal = 1,
	TransparentNormal = 2,
	PreGrab = 3,
	Grab = 4,
	MiddleFinger = 5,
	LeftArrow = 6,
	RightArrow = 7,
	UpArrow = 8,
	DownArrow = 9,
	HorizontalExpand = 10,
	Add = 11,
	Remove = 12
}

export class Painter {
	private position = new Vector2();
	private color: Color = [0, 0, 0, 255];
	private mouseCursor: MouseCursor = MouseCursor.Normal;
	private contentSize = new Vector2();
	private textEntryIndex = -1;
	private rowState: RowState | null = null;
	private windowRect = new Rect();
	private windowDragPosition: Vector2 | null = null;
	private isFirstItem = true;
	private itemRect = new Rect();

	constructor(private context: Context) {}

	beginWindow(x: number, y: number) {
		this.setMouseCursor(MouseCursor.Normal);

		this.contentSize = new Vector2();
		this.textEntryIndex = -1;
		this.isFirstItem = true;

		this.windowRect.position = new Vector2(x, y);
		this.setPosition(this.windowRect.position.x, this.windowRect.position.y);

		if (!this.context.isWindowNoDrag()) this.beginWindowDrag();

		if (!this.context.isWindowNoBackground())
			this.drawItemBackground(
				this.context.getStyle().getProperties(this.context.getWindowId() ?? 'window'),
				this.windowRect.size.x,
				this.windowRect.size.y
			);
	}

	endWindow(): Rect {
		if (!this.context.isWindowNoDrag()) this.endWindowDrag();

		this.windowRect.size = new Vector2(
			this.isFirstItem ? 0 : this.contentSize.x + this.context.getStyle().window.margins.x * 2,
			this.isFirstItem ? 0 : this.contentSize.y + this.context.getStyle().window.margins.y * 2
		);

		SetMouseCursorActiveThisFrame();
		SetMouseCursorSprite(this.mouseCursor);

		return new Rect(this.windowRect.position, this.windowRect.size);
	}

	setMouseCursor(mouseCursor: MouseCursor) {
		this.mouseCursor = mouseCursor;
	}

	private beginWindowDrag() {
		const input = this.context.getInput();
		const mousePosition = input.getMousePosition();

		if (
			!new Rect(
				this.position,
				new Vector2(this.windowRect.size.x, this.context.getStyle().window.margins.y)
			).contains(mousePosition)
		)
			return;

		if (!this.windowDragPosition) {
			if (input.isKeyPressed(InputKey.LeftMouseButton)) {
				this.windowDragPosition = new Vector2(mousePosition.x, mousePosition.y);
			}
		} else if (!input.isKeyDown(InputKey.LeftMouseButton)) {
			this.windowDragPosition = null;
		}

		if (!this.windowDragPosition) this.setMouseCursor(MouseCursor.PreGrab);
	}

	private endWindowDrag() {
		if (!this.windowDragPosition) return;

		const mousePosition = this.context.getInput().getMousePosition();

		this.windowRect.position = new Vector2(
			this.windowRect.position.x + mousePosition.x - this.windowDragPosition.x,
			this.windowRect.position.y + mousePosition.y - this.windowDragPosition.y
		);

		this.windowDragPosition = new Vector2(mousePosition.x, mousePosition.y);

		this.setMouseCursor(MouseCursor.Grab);
	}

	getPosition(): Vector2 {
		return this.position;
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

		this.setPosition(
			this.windowRect.position.x + this.context.getStyle().window.margins.x,
			this.position.y + this.rowState.size.y
		);

		this.rowState = null;
	}

	isRowMode(): boolean {
		return this.rowState !== null;
	}

	beginItem(w: number, h: number) {
		if (this.isFirstItem)
			this.move(this.context.getStyle().window.margins.x, this.context.getStyle().window.margins.y);
		else {
			let ho = 0;
			if (this.rowState && !this.rowState.isFirstItem) {
				ho = this.context.getWindowSpacing().x;
				this.rowState.size.x += ho;
			}

			let vo = 0;
			if (!this.rowState || this.rowState.isFirstItem) vo = this.context.getWindowSpacing().y;

			this.contentSize.x += ho;
			this.contentSize.y += vo;

			this.move(ho, vo);
		}

		this.itemRect = new Rect(new Vector2(this.position.x, this.position.y), new Vector2(w, h));

		if (this.rowState) this.rowState.isFirstItem = false;
		this.isFirstItem = false;
	}

	endItem() {
		const w = this.itemRect.size.x;
		const h = this.itemRect.size.y;

		this.drawDebug(w, h);

		if (this.rowState) {
			this.rowState.size = new Vector2(this.rowState.size.x + w, Math.max(this.rowState.size.y, h));
			this.setPosition(this.itemRect.position.x + w, this.itemRect.position.y);
		} else {
			this.contentSize = new Vector2(Math.max(w, this.contentSize.x), this.contentSize.y + h);
			this.setPosition(this.itemRect.position.x, this.itemRect.position.y + h);
		}
	}

	getItemRect(): Rect {
		return this.itemRect;
	}

	setPosition(x: number, y: number) {
		this.position.x = x;
		this.position.y = y;
	}

	move(x: number, y: number) {
		this.position.x += x;
		this.position.y += y;
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
		DrawRect(
			this.position.x + w / 2,
			this.position.y + h / 2,
			w,
			h,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
	}

	drawSprite(dict: string, name: string, w: number, h: number, heading?: number) {
		DrawSprite(
			dict,
			name,
			this.position.x + w / 2,
			this.position.y + h / 2,
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
		return EndTextCommandLineCount(this.position.x, this.position.y);
	}

	setText(font: number, scale: number, text: string) {
		SetTextFont(font);
		SetTextScale(1, scale);

		++this.textEntryIndex;
		AddTextEntry(this.getTextEntry(), text);
	}

	setTextWidth(w: number) {
		SetTextWrap(this.position.x, this.position.x + w);
	}

	drawText() {
		if (this.textEntryIndex == -1) return;

		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	drawDebug(w: number, h = this.context.getStyle().item.height) {
		if (!this.context.isDebugEnabled()) return;

		this.setPosition(this.itemRect.position.x, this.itemRect.position.y);
		this.setColor(this.context.getStyle().getProperty<Color>('window', 'color'));
		this.drawRect(w, h);
	}

	private getTextEntry(): string {
		return `VEIN_TEXT_ENTRY_${this.textEntryIndex}`;
	}
}
