import { Rect, Vector2 } from './types';

class LayoutState {
	isFirstUse = true;

	constructor(public orientation: LayoutOrientation, public rect: Rect) {}
}

export enum LayoutOrientation {
	Horizontal,
	Vertical
}

export class Layout {
	private layoutStateStack: LayoutState[] = [];

	private itemRect = new Rect();
	private contentRect: Rect;

	constructor(x: number, y: number, private itemSpacing: Vector2, private scale: number) {
		this.layoutStateStack.push(new LayoutState(LayoutOrientation.Vertical, new Rect(new Vector2(x, y))));

		this.contentRect = new Rect(new Vector2(x, y));
	}

	getOrientation(): LayoutOrientation {
		return this.layoutStateStack[this.layoutStateStack.length - 1].orientation;
	}

	end() {
		if (this.layoutStateStack.length !== 1) throw new Error('Layout.end() failed: Stack is not empty');

		const layoutSize = this.layoutStateStack[this.layoutStateStack.length - 1].rect.size;
		this.contentRect.size.x = Math.max(this.contentRect.size.x, layoutSize.x);
		this.contentRect.size.y = Math.max(this.contentRect.size.y, layoutSize.y);
	}

	beginItem(w: number, h: number) {
		this.itemRect = new Rect(this.getItemPosition(), new Vector2(w * this.scale, h * this.scale));
	}

	endItem() {
		const w = this.itemRect.size.x;
		const h = this.itemRect.size.y;

		const layoutState = this.layoutStateStack[this.layoutStateStack.length - 1];
		const layoutSize = layoutState.rect.size;

		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal:
				layoutSize.x += w + (layoutState.isFirstUse ? 0 : this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, h);
				break;
			case LayoutOrientation.Vertical:
				layoutSize.x = Math.max(layoutSize.x, w);
				layoutSize.y += h + (layoutState.isFirstUse ? 0 : this.itemSpacing.y);
				break;
		}

		layoutState.isFirstUse = false;
	}

	beginHorizontal(h?: number) {
		this.layoutStateStack.push(
			new LayoutState(
				LayoutOrientation.Horizontal,
				new Rect(this.getItemPosition(), new Vector2(0, h !== undefined ? h * this.scale : 0))
			)
		);
	}

	endHorizontal() {
		if (this.layoutStateStack[this.layoutStateStack.length - 1].orientation !== LayoutOrientation.Horizontal)
			throw new Error('Layout.endHorizontal() failed: Vertical layout is active');

		const size = this.layoutStateStack[this.layoutStateStack.length - 1].rect.size;

		this.layoutStateStack.pop();
		this.endLayout(size);

		this.layoutStateStack[this.layoutStateStack.length - 1].isFirstUse = false;
	}

	beginVertical(w?: number) {
		this.layoutStateStack.push(
			new LayoutState(
				LayoutOrientation.Vertical,
				new Rect(this.getItemPosition(), new Vector2(w !== undefined ? w * this.scale : 0, 0))
			)
		);
	}

	endVertical() {
		if (this.layoutStateStack[this.layoutStateStack.length - 1].orientation !== LayoutOrientation.Vertical)
			throw new Error('Layout.endVertical() failed: Horizontal layout is active');

		const size = this.layoutStateStack[this.layoutStateStack.length - 1].rect.size;

		this.layoutStateStack.pop();
		this.endLayout(size);

		this.layoutStateStack[this.layoutStateStack.length - 1].isFirstUse = false;
	}

	getContentRect(): Rect {
		return this.contentRect;
	}

	getItemRect(): Rect {
		return this.itemRect;
	}

	private getItemPosition(): Vector2 {
		const layoutState = this.layoutStateStack[this.layoutStateStack.length - 1];
		const layoutRect = layoutState.rect;

		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal:
				return new Vector2(
					layoutRect.position.x + layoutRect.size.x + (layoutState.isFirstUse ? 0 : this.itemSpacing.x),
					layoutRect.position.y
				);
			case LayoutOrientation.Vertical:
				return new Vector2(
					layoutRect.position.x,
					layoutRect.position.y + layoutRect.size.y + (layoutState.isFirstUse ? 0 : this.itemSpacing.y)
				);
		}
	}

	private endLayout(size: Vector2) {
		const layoutState = this.layoutStateStack[this.layoutStateStack.length - 1];
		const layoutSize = layoutState.rect.size;

		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal:
				layoutSize.x += size.x + (layoutState.isFirstUse ? 0 : this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, size.y);
				break;
			case LayoutOrientation.Vertical:
				layoutSize.x = Math.max(layoutSize.x, size.x);
				layoutSize.y += size.y + (layoutState.isFirstUse ? 0 : this.itemSpacing.y);
				break;
		}
	}
}
