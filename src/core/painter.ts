import { Color, Image, Vector2 } from './types';
import { Style, StylePropertyValues } from './style';

export class Painter {
	private position = new Vector2();
	private color: Color = [0, 0, 0, 255];
	private textEntryIndex = -1;

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

	private getTextEntry(): string {
		return `VEIN_TEXT_ENTRY_${this.textEntryIndex}`;
	}
}
