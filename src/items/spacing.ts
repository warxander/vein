import { getCurrentContext } from '../../index';

export function declareExport() {
	globalThis.exports('spacing', function (count = 1) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const isRowMode = painter.isRowMode();

		const w = isRowMode ? style.window.spacing.h * count : 0;
		const h = isRowMode ? 0 : style.window.spacing.v * count;

		context.beginDraw(w, h);

		context.endDraw();
	});
}
