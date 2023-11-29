import { Color, Vector2 } from './types';

export class Painter {
	private position: Vector2;
	private color: Color = [0, 0, 0, 255];
	private textEntryIndex = -1;

	constructor(x: number, y: number, private scale: number, private textEntryPrefix: string) {
		this.position = new Vector2(x, y);
	}

	getPosition(): Vector2 {
		return this.position;
	}

	setPosition(x: number, y: number) {
		this.position.x = x;
		this.position.y = y;
	}

	move(x: number, y: number) {
		this.position.x += x * this.scale;
		this.position.y += y * this.scale;
	}

	setColor(color: Color) {
		this.color = color;
	}

	drawRect(w: number, h: number) {
		const sw = w * this.scale;
		const sh = h * this.scale;

		DrawRect(
			this.position.x + sw / 2,
			this.position.y + sh / 2,
			sw,
			sh,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
	}

	drawSprite(dict: string, name: string, w: number, h: number, heading?: number) {
		const sw = w * this.scale;
		const sh = h * this.scale;

		DrawSprite(
			dict,
			name,
			this.position.x + sw / 2,
			this.position.y + sh / 2,
			sw,
			sh,
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

		this.setText(text, font, scale * this.scale);
		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	drawMultilineText(text: string, font: number, scale: number, w: number) {
		if (text.length === 0) return;

		this.setText(text, font, scale * this.scale, w * this.scale);
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
