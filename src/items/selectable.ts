import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function selectable(isSelected: boolean, text: string): boolean {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'selectable';
	const selectableProperties = style.getProperties(id);
	const font = selectableProperties.get<number>('font-family');
	const scale = selectableProperties.get<number>('font-size');

	painter.setText(font, scale, text);

	const w = ui.tryGetItemWidth() ?? painter.getTextWidth() + style.selectable.spacing * 2;
	const h = style.item.height;

	ui.beginItem(w, h);

	if (ui.isItemClicked()) isSelected = !isSelected;

	const isHovered = ui.isItemHovered();
	const properties = isHovered ? style.getProperties(`${id}:hover`) : selectableProperties;

	painter.setColor(
		isSelected ? selectableProperties.get<Color>('accent-color') : properties.get<Color>('background-color')
	);
	painter.drawRect(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.selectable.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	ui.endItem();

	return isSelected;
}
