import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('textArea', function (text, w = context.getWidgetWidth()) {
		painter.setText(text);
		painter.setTextOpts();

		painter.setTextMaxWidth(w);

		const lc = painter.calculateTextLineCount();
		const h =
			lc == 1
				? style.widget.height
				: painter.calculateTextLineHeight() * (lc + 1) + Math.abs(style.textArea.text.offset) * 2;

		context.beginDraw(w, h);

		painter.setColor(style.color.secondary);
		painter.drawText(style.textArea.text.offset);

		context.endDraw();
	});
}
