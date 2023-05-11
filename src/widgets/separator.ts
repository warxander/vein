import { getCurrentContext } from '../index';

export function declareExport(): void {
	globalThis.exports('separator', function (w: number | undefined): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getWidgetWidth()) as number;
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(style.color.secondary);
		painter.move(0, (style.widget.height - style.separator.height) / 2);
		painter.drawRect(w, style.separator.height);

		context.endDraw();
	});
}
