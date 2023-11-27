import { Rect, Vector2 } from './types';

class RowState {
	isFirstItem = true;
	size = new Vector2();
}

export class Layout {
	private rowState: RowState | null = null;
	private itemRect = new Rect();
	private isFirstItem = true;

	private contentRect: Rect;
	private position: Vector2;

	constructor(x: number, y: number, private itemSpacing: Vector2, private scale: number) {
		this.contentRect = new Rect(new Vector2(x, y), new Vector2());
		this.position = new Vector2(x, y);
	}

	beginItem(w: number, h: number) {
		if (this.isFirstItem) {
			this.isFirstItem = false;
		} else {
			let ho = 0;
			if (this.rowState && !this.rowState.isFirstItem) {
				ho = this.itemSpacing.x;
				this.rowState.size.x += ho;
			}

			let vo = 0;
			if (!this.rowState || this.rowState.isFirstItem) {
				vo = this.itemSpacing.y;
				this.contentRect.size.y += vo;
			}

			this.move(ho, vo);
		}

		this.itemRect = new Rect(new Vector2(this.position.x, this.position.y), new Vector2(w * this.scale, h * this.scale));

		if (this.rowState) this.rowState.isFirstItem = false;
	}

	endItem() {
		const w = this.itemRect.size.x;
		const h = this.itemRect.size.y;

		if (this.rowState) {
			this.rowState.size = new Vector2(this.rowState.size.x + w, Math.max(this.rowState.size.y, h));
			this.move(w, 0);
		} else {
			this.contentRect.size = new Vector2(Math.max(w, this.contentRect.size.x), this.contentRect.size.y + h);
			this.move(0, h);
		}
	}

	isInRowMode(): boolean {
		return this.rowState !== null;
	}

	beginRow() {
		if (this.rowState) throw new Error('Nested rows are not supported');
		this.rowState = new RowState();
	}

	endRow() {
		if (!this.rowState) throw new Error('Row has not been started');

		this.contentRect.size = new Vector2(
			Math.max(this.contentRect.size.x, this.rowState.size.x),
			this.contentRect.size.y + this.rowState.size.y
		);

		this.position.x = this.contentRect.position.x;
		this.position.y += this.rowState.size.y;

		this.rowState = null;
	}

	getContentRect(): Rect {
		return this.contentRect;
	}

	getItemRect(): Rect {
		return this.itemRect;
	}

	private move(x: number, y: number) {
		this.position.x += x;
		this.position.y += y;
	}
}
