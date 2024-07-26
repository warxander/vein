import { Color, TextData, Vector2 } from './types';

export class Painter {
	private static readonly FONT_SIZES_MAX_COUNT = 32;
	private static readonly fontSizes = new Map<string, number>();

	private readonly position: Vector2;

	private color: Color = [0, 0, 0, 255];
	private textEntryIndex = -1;

	constructor(x: number, y: number, private readonly scale: number, private readonly textEntryPrefix: string) {
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
		if (w === 0 || h === 0) return;

		const sw = w * this.scale;
		const sh = h * this.scale;

		DrawRect(this.position.x + sw / 2, this.position.y + sh / 2, sw, sh, ...this.color);
	}

	drawSprite(dict: string, name: string, w: number, h: number, heading?: number) {
		if (dict.length === 0 || name.length === 0 || w === 0 || h === 0) return;

		const sw = w * this.scale;
		const sh = h * this.scale;

		DrawSprite(dict, name, this.position.x + sw / 2, this.position.y + sh / 2, sw, sh, heading ?? 0, ...this.color);
	}

	getFontSize(font: number, scale: number): number {
		const fontKey = this.getFontKey(font, scale);

		let fontSize = Painter.fontSizes.get(fontKey);
		if (fontSize !== undefined) return fontSize;

		fontSize = GetRenderedCharacterHeight(scale, font);
		if (Painter.fontSizes.size < Painter.FONT_SIZES_MAX_COUNT) Painter.fontSizes.set(fontKey, fontSize);

		return fontSize;
	}

	getTextWidth(textData: TextData): number {
		this.setText(textData, false);
		if (textData.text.length === 0) return 0;

		BeginTextCommandGetWidth(this.getTextEntry());
		return EndTextCommandGetWidth(true);
	}

	getTextLineCount(textData: TextData): number {
		this.setWrappedText(textData, false);
		if (textData.text.length === 0) return 0;

		BeginTextCommandLineCount(this.getTextEntry());
		return EndTextCommandLineCount(this.position.x, this.position.y);
	}

	drawText(textData: TextData) {
		this.setText(textData, true);
		if (textData.text.length === 0) return;

		SetTextColour(...this.color);
		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	drawMultilineText(textData: TextData) {
		this.setWrappedText(textData, true);
		if (textData.text.length === 0) return;

		SetTextColour(...this.color);
		BeginTextCommandDisplayText(this.getTextEntry());
		EndTextCommandDisplayText(this.position.x, this.position.y);
	}

	private getTextEntry(): string {
		return `${this.textEntryPrefix}_${this.textEntryIndex}`;
	}

	private getFontKey(font: number, scale: number): string {
		return `${font}_${scale}`;
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
