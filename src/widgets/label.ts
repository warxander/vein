import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('label', function (text: string | undefined) {
		painter.setText(text);
		painter.setTextOpts();

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth();
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(style.color.secondary);
		painter.drawText(style.label.text.offset);

		context.endDraw();
	});
}
