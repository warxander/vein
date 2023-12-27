import { Frame, getFrameChecked } from '../core/frame';
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

	const iw = frame.tryGetItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += style.collapsingHeader.spriteWidth;
		const tw = painter.getTextWidth(text, font, scale);
		if (tw !== 0) w += tw + style.collapsingHeader.padding;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isOpened = !isOpened;

	const state = getDefaultStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('collapsing-header', state);

	const sh = style.collapsingHeader.spriteWidth * GetAspectRatio(false);
	painter.move(0, (h - sh) / 2);

	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.spriteWidth, sh, isOpened ? 90 : 0);

	painter.move(
		style.collapsingHeader.spriteWidth + style.collapsingHeader.padding,
		sh / 2 - GetRenderedCharacterHeight(scale, font) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(text, font, scale);

	frame.endItem();

	return isOpened;
}
