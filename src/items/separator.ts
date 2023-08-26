import { getCurrentContext } from '../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('separator', function (w?: number) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.tryGetItemWidth()) as number;
		const h = style.item.height;

		context.beginItem(w, h);

		painter.setColor(style.getProperty<Color>(context.tryGetItemId() ?? 'separator', 'color'));
		painter.move(0, (style.item.height - style.separator.height) / 2);
		painter.drawRect(w, style.separator.height);

		context.endItem();
	});
}
