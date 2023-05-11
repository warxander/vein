import { getCurrentContext } from '../index';

export function declareExport(): void {
	globalThis.exports('textArea', function (text: string, w: number | undefined): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getWidgetWidth()) as number;

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
