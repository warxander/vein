import { getCurrentContext } from '../../index';

export function declareExport() {
	globalThis.exports('spacing', function (count = 1) {
		const context = getCurrentContext();
		const painter = context.getPainter();

		const isRowMode = painter.isRowMode();

		const windowSpacing = painter.getWindowSpacing();
		const w = isRowMode ? windowSpacing.x * count : 0;
		const h = isRowMode ? 0 : windowSpacing.y * count;

		context.beginDraw(w, h);

		context.endDraw();
	});
}
