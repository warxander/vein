export type Color = [number, number, number, number];
export type TextEntryComponents = Array<string | number>;

export interface PositionInterface {
	x: number;
	y: number;
}

export class Position implements PositionInterface {
	x = 0;
	y = 0;

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
