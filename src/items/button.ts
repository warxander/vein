import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function button(text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('button');
	const textData = Utils.createTextData(text, selector);

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(textData) + style.button.padding * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	const isClicked = frame.isItemClicked();

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('button', state);

	Utils.drawItemBackground(frame, selector, w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(
		style.button.padding,
		(h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset
	);
	painter.drawText(textData);

	frame.endItem();

	return isClicked;
}
