export type Color = [number, number, number, number];
export type FontSize = number;
export type Image = [string, string];
export type TextEntryComponents = Array<string | number>;

export class Vector2 {
	constructor(public x: number = 0, public y: number = 0) {}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
