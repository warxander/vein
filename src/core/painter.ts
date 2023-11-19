import { Color, Vector2 } from './types';

export class Painter {
	private position = new Vector2();
	private color: Color = [0, 0, 0, 255];
	private textEntryIndex = -1;

	constructor(private textEntryPrefix: string) {}

	getPosition(): Vector2 {
		return this.position;
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

	getTextWidth(text: string, font: number, scale: number): number {
		if (text.length === 0) return 0;

		this.setText(text, font, scale);

		BeginTextCommandGetWidth(this.getTextEntry());
		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(text: string, font: number, scale: number, w: number): number {
		if (text.length === 0) return 0;

		this.setText(text, font, scale, w);

		BeginTextCommandLineCount(this.getTextEntry());
		return EndTextCommandLineCount(this.position.x, this.position.y);
	}

	drawText(text: string, font: number, scale: number) {
		if (text.length === 0) return;

		this.setText(text, font, scale);
		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	drawMultilineText(text: string, font: number, scale: number, w: number) {
		if (text.length === 0) return;

		this.setText(text, font, scale, w);
		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	private getTextEntry(): string {
		return `${this.textEntryPrefix}_${this.textEntryIndex}`;
	}

	private setText(text: string, font: number, scale: number, w: number | null = null) {
		++this.textEntryIndex;
		AddTextEntry(this.getTextEntry(), text);

		SetTextFont(font);
		SetTextScale(1, scale);

		if (w) SetTextWrap(this.position.x, this.position.x + w);
	}
}
