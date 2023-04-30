import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('spacing', function (count = 1) {
		const isRowMode = painter.isRowMode();

		const w = isRowMode ? style.window.spacing.h * count : 0;
		const h = isRowMode ? 0 : style.window.spacing.v * count;

		context.beginDraw(w, h);

		context.endDraw();
	});
}
