import { context } from '../exports';
import { Color } from '../exports';

export function heading(text: string) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const properties = style.getProperties(context.tryGetItemId() ?? 'heading');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	painter.setText(font, scale, text);

	const w = context.tryGetItemWidth() ?? painter.getTextWidth();
	const h = style.item.height;

	context.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	context.endItem();
}
