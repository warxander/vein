import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import { drawItemBackground } from '../core/utils';

/**
 * @category Items
 */
export function spriteButton(dict: string, name: string, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('sprite-button');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;
	const iw = frame.tryGetItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += sw + style.button.padding * 2;
		const tw = painter.getTextWidth(text, font, scale);
		if (tw !== 0) w += tw + spriteButtonStyle.padding;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	const state: string | undefined = frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined;
	if (state !== undefined) selector = frame.buildStyleSelector('sprite-button', state);

	drawItemBackground(frame, selector, w, h);

	const sh = sw * GetAspectRatio(false);
	const so = (h - sh) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));

	painter.move(style.button.padding, so);
	painter.drawSprite(dict, name, sw, sh);

	painter.move(
		sw + spriteButtonStyle.padding,
		-so + (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.drawText(text, font, scale);

	frame.endItem();

	return frame.isItemClicked();
}
