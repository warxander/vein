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
	private layoutStack: LayoutState[] = [];

	private isCustomItemPosition = false;
	private customItemSpacing: number | undefined = undefined;

	private itemRect = new Rect();

	private contentRect: Rect;

	constructor(x: number, y: number, private itemSpacing: Vector2, private scale: number) {
		this.layoutStack.push(new LayoutState(LayoutOrientation.Vertical, new Rect(new Vector2(x, y))));

		this.contentRect = new Rect(new Vector2(x, y));
	}

	getOrientation(): LayoutOrientation {
		return this.getTopLayout().orientation;
	}

	end() {
		if (this.layoutStack.length !== 1) throw new Error('Layout.end() failed: Stack is not empty');

		const layoutSize = this.getTopLayout().rect.size;
		this.contentRect.size.x = Math.max(this.contentRect.size.x, layoutSize.x);
		this.contentRect.size.y = Math.max(this.contentRect.size.y, layoutSize.y);
	}

	beginItem(position: Vector2 | undefined, spacing: number | undefined, w: number, h: number) {
		this.isCustomItemPosition = position !== undefined;
		this.customItemSpacing = spacing;

		this.itemRect = new Rect(
			position !== undefined ? position : this.getNextItemPosition(),
			new Vector2(w * this.scale, h * this.scale)
		);
	}

	endItem() {
		if (!this.isCustomItemPosition) this.extendTopLayout(this.itemRect.size);

		this.customItemSpacing = undefined;
		this.isCustomItemPosition = false;
	}

	beginHorizontal(h?: number) {
		this.layoutStack.push(
			new LayoutState(
				LayoutOrientation.Horizontal,
				new Rect(this.getNextItemPosition(), new Vector2(0, h !== undefined ? h * this.scale : 0))
			)
		);
	}

	endHorizontal() {
		if (this.getTopLayout().orientation !== LayoutOrientation.Horizontal)
			throw new Error('Layout.endHorizontal() failed: Vertical layout is active');

		this.endTopLayout();
	}

	beginVertical(w?: number) {
		this.layoutStack.push(
			new LayoutState(
				LayoutOrientation.Vertical,
				new Rect(this.getNextItemPosition(), new Vector2(w !== undefined ? w * this.scale : 0, 0))
			)
		);
	}

	endVertical() {
		if (this.getTopLayout().orientation !== LayoutOrientation.Vertical)
			throw new Error('Layout.endVertical() failed: Horizontal layout is active');

		this.endTopLayout();
	}

	getContentRect(): Rect {
		return this.contentRect;
	}

	getItemRect(): Rect {
		return this.itemRect;
	}

	private getNextItemPosition(): Vector2 {
		const layout = this.getTopLayout();
		const layoutRect = layout.rect;

		switch (layout.orientation) {
			case LayoutOrientation.Horizontal:
				return new Vector2(
					layoutRect.position.x +
						layoutRect.size.x +
						(layout.isFirstUse
							? 0
							: this.customItemSpacing !== undefined
							? this.customItemSpacing
							: this.itemSpacing.x),
					layoutRect.position.y
				);
			case LayoutOrientation.Vertical:
				return new Vector2(
					layoutRect.position.x,
					layoutRect.position.y +
						layoutRect.size.y +
						(layout.isFirstUse
							? 0
							: this.customItemSpacing !== undefined
							? this.customItemSpacing
							: this.itemSpacing.y)
				);
		}
	}

	private getTopLayout(): LayoutState {
		return this.layoutStack[this.layoutStack.length - 1];
	}

	private endTopLayout() {
		const size = this.getTopLayout().rect.size;
		this.layoutStack.pop();
		this.extendTopLayout(size);
	}

	private extendTopLayout(size: Vector2) {
		const layout = this.getTopLayout();
		const layoutSize = layout.rect.size;

		switch (layout.orientation) {
			case LayoutOrientation.Horizontal:
				layoutSize.x +=
					size.x +
					(layout.isFirstUse
						? 0
						: this.customItemSpacing !== undefined
						? this.customItemSpacing
						: this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, size.y);
				break;
			case LayoutOrientation.Vertical:
				layoutSize.x = Math.max(layoutSize.x, size.x);
				layoutSize.y +=
					size.y +
					(layout.isFirstUse
						? 0
						: this.customItemSpacing !== undefined
						? this.customItemSpacing
						: this.itemSpacing.y);
				break;
		}

		layout.isFirstUse = false;
	}
}
