import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

/**
 * @category Items
 */
export function label(text: string) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildStyleSelector('label');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();
}
