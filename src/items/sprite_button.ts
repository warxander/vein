import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function spriteButton(dict: string, name: string, text: string | null = null): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = 'sprite-button';
	const textData = text !== null ? Utils.createTextData(text, selector) : null;
	const textWidth = textData !== null ? painter.getTextWidth(textData) : 0;

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;
	const iw = Frame.getNextItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += sw + style.button.padding * 2;
		if (textWidth !== 0) w += textWidth + spriteButtonStyle.padding;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	const isClicked = frame.isItemClicked();

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildItemStyleSelector('sprite-button', state);

	Utils.drawItemBackground(frame, selector, w, h);

	const sh = sw * GetAspectRatio(false);
	const so = (h - sh) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));

	painter.move((w - (textWidth !== 0 ? textWidth + spriteButtonStyle.padding : 0) - sw) / 2, so);
	painter.drawSprite(dict, name, sw, sh);

	if (textData !== null) {
		painter.move(
			sw + spriteButtonStyle.padding,
			-so + (h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset
		);
		painter.drawText(textData);
	}

	frame.endItem();

	return isClicked;
}
