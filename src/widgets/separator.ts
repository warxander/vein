import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('separator', function (w = context.getWidgetWidth()) {
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(style.color.secondary);
		painter.move(0, (style.widget.height - style.separator.height) / 2);
		painter.drawRect(w, style.separator.height);

		context.endDraw();
	});
}
