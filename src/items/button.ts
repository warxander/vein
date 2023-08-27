import { context } from '../exports';
import { Color } from '../exports';

export function button(text: string): boolean {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const id = context.tryGetItemId() ?? 'button';
	const buttonProperties = style.getProperties(id);
	const font = buttonProperties.get<number>('font-family');
	const scale = buttonProperties.get<number>('font-size');

	painter.setTextFont(font, scale);
	painter.setText(text);

	const w = context.tryGetItemWidth() ?? painter.getTextWidth() + style.button.spacing * 2;
	const h = style.item.height;

	context.beginItem(w, h);

	const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : buttonProperties;

	painter.drawItemBackground(properties, w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.button.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	context.endItem();

	return context.isItemClicked();
}
