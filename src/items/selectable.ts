import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function selectable(isSelected: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const id = frame.tryGetItemId() ?? 'selectable';
	const selectableProperties = style.getProperties(id);
	const font = selectableProperties.get<number>('font-family');
	const scale = selectableProperties.get<number>('font-size');

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale) + style.selectable.spacing * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isSelected = !isSelected;

	const isHovered = frame.isItemHovered();
	const properties = isHovered ? style.getProperties(`${id}:hover`) : selectableProperties;

	painter.setColor(
		isSelected ? selectableProperties.get<Color>('accent-color') : properties.get<Color>('background-color')
	);
	painter.drawRect(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.selectable.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();

	return isSelected;
}
