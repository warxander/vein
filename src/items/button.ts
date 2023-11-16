import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function button(text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const id = frame.tryGetItemId() ?? 'button';
	const buttonProperties = style.getProperties(id);
	const font = buttonProperties.get<number>('font-family');
	const scale = buttonProperties.get<number>('font-size');

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale) + style.button.spacing * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	const properties = frame.isItemHovered() ? style.getProperties(`${id}:hover`) : buttonProperties;

	painter.drawItemBackground(properties, w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(style.button.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();

	return frame.isItemClicked();
}
