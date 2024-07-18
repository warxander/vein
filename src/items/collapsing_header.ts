import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function collapsingHeader(isOpened: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = 'collapsing-header';
	const textData = Utils.createTextData(text, selector);

	const iw = Frame.getNextItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += style.collapsingHeader.sprite.width;
		const tw = painter.getTextWidth(textData);
		if (tw !== 0) w += tw;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isOpened = !isOpened;

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildItemStyleSelector('collapsing-header', state);

	const sh = style.collapsingHeader.sprite.width * GetAspectRatio(false);
	painter.move(style.collapsingHeader.sprite.offset, (h - sh) / 2);

	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.sprite.width, sh, isOpened ? 90 : 0);

	painter.move(
		style.collapsingHeader.sprite.width - style.collapsingHeader.sprite.offset + style.collapsingHeader.textOffset,
		sh / 2 - painter.getFontSize(textData.font, textData.scale) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(textData);

	frame.endItem();

	return isOpened;
}
