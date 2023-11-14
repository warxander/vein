import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function heading(text: string) {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const properties = style.getProperties(ui.tryGetItemId() ?? 'heading');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	painter.setText(font, scale, text);

	const w = ui.tryGetItemWidth() ?? painter.getTextWidth();
	const h = style.item.height;

	ui.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	ui.endItem();
}
