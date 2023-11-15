import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function label(text: string) {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const properties = style.getProperties(ui.tryGetItemId() ?? 'label');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	const w = ui.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	ui.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	ui.endItem();
}
