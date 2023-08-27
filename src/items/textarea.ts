import { context } from '../exports';
import { Color } from '../exports';

export function textArea(text: string, w: number) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const properties = style.getProperties(context.tryGetItemId() ?? 'text-area');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	painter.setTextWidth(w);
	painter.setText(font, scale, text);

	const lc = painter.getTextLineCount();
	const h = lc === 1 ? style.item.height : GetRenderedCharacterHeight(scale, font) * (lc + 1);

	context.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	if (lc == 1) painter.move(0, style.item.textOffset);
	painter.drawText();

	context.endItem();
}
