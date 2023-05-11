import { getCurrentContext } from '../../index';
import { numberEquals } from '../core/utils';

export function declareExport(): void {
	globalThis.exports('progressBar', function (min: number, value: number, max: number, w: number | undefined): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getWidgetWidth()) as number;

		context.beginDraw(w, style.widget.height);

		const h = style.progressBar.height;

		painter.setColor(style.color.widget);
		painter.move(0, (style.widget.height - h) / 2);
		painter.drawRect(w, h);

		if (!numberEquals(value, min)) {
			const pw = numberEquals(value, max) ? w : ((value - min) / (max - min)) * w;

			painter.setColor(style.color.progress);
			painter.drawRect(pw, h);
		}

		context.endDraw();
	});
}
