import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function separator(w: number) {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const h = style.item.height;

	ui.beginItem(w, h);

	painter.setColor(style.getProperty<Color>(ui.tryGetItemId() ?? 'separator', 'color'));
	painter.move(0, (style.item.height - style.separator.height) / 2);
	painter.drawRect(w, style.separator.height);

	ui.endItem();
}
