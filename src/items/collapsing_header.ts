import { Frame, getFrameChecked } from '../core/frame';
import { TextData } from '../core/painter';
import { Color } from '../core/types';
import { getDefaultStyleSelectorState } from '../core/utils';

/**
 * @category Items
 */
export function collapsingHeader(isOpened: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('collapsing-header');

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');
	const textData = new TextData(text, font, scale);

	const iw = frame.tryGetItemWidth();

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

	const state = getDefaultStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('collapsing-header', state);

	const sh = style.collapsingHeader.sprite.width * GetAspectRatio(false);
	painter.move(style.collapsingHeader.sprite.offset, (h - sh) / 2);

	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.sprite.width, sh, isOpened ? 90 : 0);

	painter.move(
		style.collapsingHeader.sprite.width - style.collapsingHeader.sprite.offset + style.collapsingHeader.textOffset,
		sh / 2 - painter.getFontSize(font, scale) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(textData);

	frame.endItem();

	return isOpened;
}
