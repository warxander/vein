import { context } from '../index';

export function registerExport() {
	globalThis.exports('spacing', function (count = 1) {
		const painter = context.getPainter();

		const isRowMode = painter.isRowMode();

		const windowSpacing = painter.getWindowSpacing();
		const w = isRowMode ? windowSpacing.x * count : 0;
		const h = isRowMode ? 0 : windowSpacing.y * count;

		context.beginItem(w, h);

		context.endItem();
	});
}
