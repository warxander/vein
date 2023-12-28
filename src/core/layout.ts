import { Rect, Vector2 } from './types';

class LayoutState {
	isFirstUse = true;

	constructor(public orientation: LayoutOrientation) {}
}

export enum LayoutOrientation {
	Horizontal,
	Vertical
}

export class Layout {
	private layoutStateStack: LayoutState[] = [];

	private horizontalLayoutRectStack: Rect[] = [];
	private verticalLayoutRectStack: Rect[] = [];

	private itemRect = new Rect();
	private contentRect: Rect;

	constructor(x: number, y: number, private itemSpacing: Vector2, private scale: number) {
		this.pushLayout(LayoutOrientation.Vertical, new Rect(new Vector2(x, y)));

		this.contentRect = new Rect(new Vector2(x, y));
	}

	getOrientation(): LayoutOrientation {
		return this.layoutStateStack[this.layoutStateStack.length - 1].orientation;
	}

	end() {
		if (this.layoutStateStack.length !== 1) throw new Error('Layout.end() failed: Stack is not empty');

		const layoutSize = this.verticalLayoutRectStack[this.verticalLayoutRectStack.length - 1].size;
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

		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal: {
				const layoutSize = this.horizontalLayoutRectStack[this.horizontalLayoutRectStack.length - 1].size;
				layoutSize.x += w + (layoutState.isFirstUse ? 0 : this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, h);
				break;
			}
			case LayoutOrientation.Vertical: {
				const layoutSize = this.verticalLayoutRectStack[this.verticalLayoutRectStack.length - 1].size;
				layoutSize.x = Math.max(layoutSize.x, w);
				layoutSize.y += h + (layoutState.isFirstUse ? 0 : this.itemSpacing.y);
				break;
			}
		}

		layoutState.isFirstUse = false;
	}

	beginHorizontal(h?: number) {
		this.pushLayout(
			LayoutOrientation.Horizontal,
			new Rect(this.getItemPosition(), new Vector2(0, h !== undefined ? h : 0))
		);
	}

	endHorizontal() {
		if (this.layoutStateStack[this.layoutStateStack.length - 1].orientation !== LayoutOrientation.Horizontal)
			throw new Error('Layout.endHorizontal() failed: Vertical layout is active');

		const size = this.horizontalLayoutRectStack[this.horizontalLayoutRectStack.length - 1].size;

		this.popLayout();
		this.endLayout(size);

		this.layoutStateStack[this.layoutStateStack.length - 1].isFirstUse = false;
	}

	beginVertical(w?: number) {
		this.pushLayout(
			LayoutOrientation.Vertical,
			new Rect(this.getItemPosition(), new Vector2(w !== undefined ? w : 0, 0))
		);
	}

	endVertical() {
		if (this.layoutStateStack[this.layoutStateStack.length - 1].orientation !== LayoutOrientation.Vertical)
			throw new Error('Layout.endVertical() failed: Horizontal layout is active');

		const size = this.verticalLayoutRectStack[this.verticalLayoutRectStack.length - 1].size;

		this.popLayout();
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
		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal: {
				const layoutRect = this.horizontalLayoutRectStack[this.horizontalLayoutRectStack.length - 1];
				return new Vector2(
					layoutRect.position.x + layoutRect.size.x + (layoutState.isFirstUse ? 0 : this.itemSpacing.x),
					layoutRect.position.y
				);
			}
			case LayoutOrientation.Vertical: {
				const layoutRect = this.verticalLayoutRectStack[this.verticalLayoutRectStack.length - 1];
				return new Vector2(
					layoutRect.position.x,
					layoutRect.position.y + layoutRect.size.y + (layoutState.isFirstUse ? 0 : this.itemSpacing.y)
				);
			}
		}
	}

	private endLayout(size: Vector2) {
		const layoutState = this.layoutStateStack[this.layoutStateStack.length - 1];
		switch (layoutState.orientation) {
			case LayoutOrientation.Horizontal: {
				const layoutSize = this.horizontalLayoutRectStack[this.horizontalLayoutRectStack.length - 1].size;
				layoutSize.x += size.x + (layoutState.isFirstUse ? 0 : this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, size.y);
				break;
			}
			case LayoutOrientation.Vertical: {
				const layoutSize = this.verticalLayoutRectStack[this.verticalLayoutRectStack.length - 1].size;
				layoutSize.x = Math.max(layoutSize.x, size.x);
				layoutSize.y += size.y + (layoutState.isFirstUse ? 0 : this.itemSpacing.y);
				break;
			}
		}
	}

	private pushLayout(orientation: LayoutOrientation, rect: Rect) {
		this.layoutStateStack.push(new LayoutState(orientation));
		switch (orientation) {
			case LayoutOrientation.Horizontal:
				this.horizontalLayoutRectStack.push(rect);
				break;
			case LayoutOrientation.Vertical:
				this.verticalLayoutRectStack.push(rect);
				break;
		}
	}

	private popLayout() {
		const orientation = this.layoutStateStack.pop()!.orientation;
		switch (orientation!) {
			case LayoutOrientation.Horizontal:
				this.horizontalLayoutRectStack.pop();
				break;
			case LayoutOrientation.Vertical:
				this.verticalLayoutRectStack.pop();
				break;
		}
	}
}
