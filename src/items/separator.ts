import { context } from '../exports';
import { Color } from '../exports';

export function separator(w: number) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const h = style.item.height;

	context.beginItem(w, h);

	painter.setColor(style.getProperty<Color>(context.tryGetItemId() ?? 'separator', 'color'));
	painter.move(0, (style.item.height - style.separator.height) / 2);
	painter.drawRect(w, style.separator.height);

	context.endItem();
}
