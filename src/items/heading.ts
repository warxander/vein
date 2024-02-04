import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function heading(text: string) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildStyleSelector('heading');
	const textData = Utils.createTextData(text, selector);

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(textData);
	const h = style.item.height;

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(0, (h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset);
	painter.drawText(textData);

	frame.endItem();
}
