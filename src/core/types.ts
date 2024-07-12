export type Color = [number, number, number, number];
export type Image = [string, string];

export class TextData {
	static readonly Empty = new TextData('', -1, -1);

	constructor(public text: string, public font: number, public scale: number, public width?: number) {}

	isEmpty(): boolean {
		return this.text.length === 0;
	}
}

export class Vector2 {
	constructor(public x: number = 0, public y: number = 0) {}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}
}

export class Rect {
	position: Vector2;
	size: Vector2;

	constructor(position = new Vector2(), size = new Vector2()) {
		this.position = position.clone();
		this.size = size.clone();
	}

	contains(point: Vector2): boolean {
		return !(
			point.x < this.position.x ||
			point.x > this.position.x + this.size.x ||
			point.y < this.position.y ||
			point.y > this.position.y + this.size.y
		);
	}
}
