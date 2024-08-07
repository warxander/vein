import { Rect, Vector2 } from './types';

class LayoutState {
	isFirstUse = true;

	constructor(public readonly orientation: LayoutOrientation, public readonly rect: Rect) {}
}

export enum LayoutOrientation {
	Horizontal,
	Vertical
}

export class Layout {
	private readonly stateStack: LayoutState[];
	private readonly contentRect: Rect;

	private isItemWithCustomPosition = false;
	private itemCustomSpacing: number | undefined = undefined;

	private itemRect = new Rect();

	constructor(x: number, y: number, private itemSpacing: Vector2) {
		this.stateStack = [new LayoutState(LayoutOrientation.Vertical, new Rect(new Vector2(x, y)))];
		this.contentRect = new Rect(new Vector2(x, y));
	}

	getOrientation(): LayoutOrientation {
		return this.getTopLayout().orientation;
	}

	end() {
		if (this.stateStack.length !== 1) throw new Error('Layout.end() failed: Stack is not empty');

		const layoutSize = this.getTopLayout().rect.size;
		this.contentRect.size.x = Math.max(this.contentRect.size.x, layoutSize.x);
		this.contentRect.size.y = Math.max(this.contentRect.size.y, layoutSize.y);
	}

	beginItem(position: Vector2 | undefined, spacing: number | undefined, w: number, h: number) {
		this.isItemWithCustomPosition = position !== undefined;
		this.itemCustomSpacing = spacing;

		this.itemRect = new Rect(position ?? this.getNextItemPosition(), new Vector2(w, h));
	}

	endItem() {
		if (!this.isItemWithCustomPosition) this.extendTopLayout(this.itemRect.size);

		this.itemCustomSpacing = undefined;
		this.isItemWithCustomPosition = false;
	}

	beginHorizontal(h?: number) {
		this.stateStack.push(
			new LayoutState(LayoutOrientation.Horizontal, new Rect(this.getNextItemPosition(), new Vector2(0, h ?? 0)))
		);
	}

	endHorizontal() {
		if (this.getTopLayout().orientation !== LayoutOrientation.Horizontal)
			throw new Error('Layout.endHorizontal() failed: Vertical layout is active');

		this.endTopLayout();
	}

	beginVertical(w?: number) {
		this.stateStack.push(
			new LayoutState(LayoutOrientation.Vertical, new Rect(this.getNextItemPosition(), new Vector2(w ?? 0, 0)))
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
						(layout.isFirstUse ? 0 : this.itemCustomSpacing ?? this.itemSpacing.x),
					layoutRect.position.y
				);
			case LayoutOrientation.Vertical:
				return new Vector2(
					layoutRect.position.x,
					layoutRect.position.y +
						layoutRect.size.y +
						(layout.isFirstUse ? 0 : this.itemCustomSpacing ?? this.itemSpacing.y)
				);
		}
	}

	private getTopLayout(): LayoutState {
		return this.stateStack[this.stateStack.length - 1];
	}

	private endTopLayout() {
		const size = this.getTopLayout().rect.size;
		this.stateStack.pop();
		this.extendTopLayout(size);
	}

	private extendTopLayout(size: Vector2) {
		const layout = this.getTopLayout();
		const layoutSize = layout.rect.size;

		switch (layout.orientation) {
			case LayoutOrientation.Horizontal:
				layoutSize.x += size.x + (layout.isFirstUse ? 0 : this.itemCustomSpacing ?? this.itemSpacing.x);
				layoutSize.y = Math.max(layoutSize.y, size.y);
				break;
			case LayoutOrientation.Vertical:
				layoutSize.x = Math.max(layoutSize.x, size.x);
				layoutSize.y += size.y + (layout.isFirstUse ? 0 : this.itemCustomSpacing ?? this.itemSpacing.y);
				break;
		}

		layout.isFirstUse = false;
	}
}
