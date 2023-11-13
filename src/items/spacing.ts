import { context } from '../exports';

/** Horizontal if in row mode, vertical otherwise */
export function spacing(count = 1) {
	const painter = context.getPainter();

	const isRowMode = painter.isRowMode();

	const windowSpacing = context.getWindowSpacing();
	const w = isRowMode ? windowSpacing.x * count : 0;
	const h = isRowMode ? 0 : windowSpacing.y * count;

	context.beginItem(w, h);

	context.endItem();
}
