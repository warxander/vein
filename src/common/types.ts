export type Color = [number, number, number, number];
export type PositionObject = { x: number; y: number };
export type TextEntryComponents = Array<string | number>;

export class Position {
	x: number;
	y: number;

	constructor() {
		this.x = 0;
		this.y = 0;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
