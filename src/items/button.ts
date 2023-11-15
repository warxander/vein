import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function button(text: string): boolean {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'button';
	const buttonProperties = style.getProperties(id);
	const font = buttonProperties.get<number>('font-family');
	const scale = buttonProperties.get<number>('font-size');

	const w = ui.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale) + style.button.spacing * 2;
	const h = style.item.height;

	ui.beginItem(w, h);

	const properties = ui.isItemHovered() ? style.getProperties(`${id}:hover`) : buttonProperties;

	painter.drawItemBackground(properties, w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.button.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	ui.endItem();

	return ui.isItemClicked();
}
