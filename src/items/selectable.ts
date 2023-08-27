import { context } from '../exports';
import { Color } from '../exports';

export function selectable(isSelected: boolean, text: string): boolean {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const id = context.tryGetItemId() ?? 'selectable';
	const selectableProperties = style.getProperties(id);
	const font = selectableProperties.get<number>('font-family');
	const scale = selectableProperties.get<number>('font-size');

	painter.setTextFont(font, scale);
	painter.setText(text);

	const w = context.tryGetItemWidth() ?? painter.getTextWidth() + style.selectable.spacing * 2;
	const h = style.item.height;

	context.beginItem(w, h);

	if (context.isItemClicked()) isSelected = !isSelected;

	const isHovered = context.isItemHovered();
	const properties = isHovered ? style.getProperties(`${id}:hover`) : selectableProperties;

	painter.setColor(
		isSelected ? selectableProperties.get<Color>('accent-color') : properties.get<Color>('background-color')
	);
	painter.drawRect(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.selectable.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	context.endItem();

	return isSelected;
}
