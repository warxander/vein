import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function textArea(text: string, w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildStyleSelector('text-area');
	const textData = Utils.createTextData(text, selector, w);

	const lc = painter.getTextLineCount(textData);

	const h =
		lc === 0 ? 0 : lc === 1 ? style.item.height : painter.getFontSize(textData.font, textData.scale) * (lc + 1);

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	if (lc === 1) painter.move(0, style.item.textOffset);

	painter.drawMultilineText(textData);

	frame.endItem();
}
