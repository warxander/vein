import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('separator', function (w?: number) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getWidgetWidth()) as number;
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(style.getProperty<Color>('separator', 'color'));
		painter.move(0, (style.widget.height - style.separator.height) / 2);
		painter.drawRect(w, style.separator.height);

		context.endDraw();
	});
}
