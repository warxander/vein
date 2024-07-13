import { Frame, getFrameChecked } from '../core/frame';
import { Color, MouseCursor } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function hyperlink(url: string, urlText: string | null = null) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('hyperlink');
	const text = urlText ?? url;
	const textData = Utils.createTextData(text, selector);

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(textData);
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemHovered()) {
		frame.setMouseCursor(MouseCursor.MiddleFinger);
		if (frame.isItemClicked()) Utils.openUrl(url);
	}

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('hyperlink', state);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(0, (h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset);
	painter.drawText(textData);

	frame.endItem();
}
