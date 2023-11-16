import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function label(text: string) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const properties = style.getProperties(frame.tryGetItemId() ?? 'label');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	frame.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();
}
