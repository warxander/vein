export type Color = [number, number, number, number];
export type Image = [string, string];

export class Vector2 {
	constructor(public x: number = 0, public y: number = 0) {}
}

export class Rect {
	constructor(public position: Vector2 = new Vector2(), public size: Vector2 = new Vector2()) {}

	contains(point: Vector2): boolean {
		return !(
			point.x < this.position.x ||
			point.x > this.position.x + this.size.x ||
			point.y < this.position.y ||
			point.y > this.position.y + this.size.y
		);
	}
}
