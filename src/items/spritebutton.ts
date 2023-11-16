import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import { drawItemBackground } from '../core/utils';

export function spriteButton(dict: string, name: string, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('sprite-button');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;

	const w =
		frame.tryGetItemWidth() ||
		painter.getTextWidth(text, font, scale) + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemHovered()) selector = frame.buildStyleSelector('sprite-button', 'hover');

	drawItemBackground(frame, selector, w, h);

	const sh = sw * GetAspectRatio(false);
	const so = (h - sh) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));

	painter.move(style.button.spacing, so);
	painter.drawSprite(dict, name, sw, sh);

	painter.move(
		sw + spriteButtonStyle.spacing,
		-so + (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.drawText(text, font, scale);

	frame.endItem();

	return frame.isItemClicked();
}
