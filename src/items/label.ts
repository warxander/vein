import { Frame, getFrameChecked } from '../core/frame';
import { TextData } from '../core/painter';
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
	const textData = new TextData(text, font, scale);

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(textData);
	const h = style.item.height;

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(textData);

	frame.endItem();
}
