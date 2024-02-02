import { Color, Vector2 } from './types';

export class TextData {
	constructor(public text: string, public font: number, public scale: number, public width?: number) {}
}

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

	getFontSize(font: number, scale: number): number {
		return GetRenderedCharacterHeight(scale, font);
	}

	getTextWidth(textData: TextData): number {
		if (textData.text.length === 0) return 0;

		this.setText(textData, false);

		BeginTextCommandGetWidth(this.getTextEntry());
		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(textData: TextData): number {
		if (textData.text.length === 0) return 0;

		this.setWrappedText(textData, false);

		BeginTextCommandLineCount(this.getTextEntry());
		return EndTextCommandLineCount(this.position.x, this.position.y);
	}

	drawText(textData: TextData) {
		if (textData.text.length === 0) return;

		this.setText(textData, true);
		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	drawMultilineText(textData: TextData) {
		if (textData.text.length === 0) return;

		this.setWrappedText(textData, true);
		SetTextColour(this.color[0], this.color[1], this.color[2], this.color[3]);

		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	private getTextEntry(): string {
		return `${this.textEntryPrefix}_${this.textEntryIndex}`;
	}

	private setText(textData: TextData, useScaling: boolean) {
		++this.textEntryIndex;
		AddTextEntry(this.getTextEntry(), textData.text);

		SetTextFont(textData.font);
		SetTextScale(1, useScaling ? textData.scale * this.scale : textData.scale);
	}

	private setWrappedText(textData: TextData, useScaling: boolean) {
		++this.textEntryIndex;
		AddTextEntry(this.getTextEntry(), textData.text);

		SetTextFont(textData.font);
		SetTextScale(1, useScaling ? textData.scale * this.scale : textData.scale);
		SetTextWrap(this.position.x, this.position.x + (useScaling ? textData.width! * this.scale : textData.width!));
	}
}
