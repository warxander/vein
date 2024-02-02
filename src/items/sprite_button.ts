import { Frame, getFrameChecked } from '../core/frame';
import { TextData } from '../core/painter';
import { Color } from '../core/types';
import { drawItemBackground, getDefaultStyleSelectorState } from '../core/utils';

/**
 * @category Items
 */
export function spriteButton(dict: string, name: string, text: string | null = null): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('sprite-button');

	let textData: TextData | undefined;
	if (text !== null) {
		const font = style.getPropertyAs<number>(selector, 'font-family');
		const scale = style.getPropertyAs<number>(selector, 'font-size');
		textData = new TextData(text, font, scale);
	}

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;
	const iw = frame.tryGetItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += sw + style.button.padding * 2;
		const tw = textData !== undefined ? painter.getTextWidth(textData) : 0;
		if (tw !== 0) w += tw + spriteButtonStyle.padding;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	const isClicked = frame.isItemClicked();

	const state = getDefaultStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('sprite-button', state);

	drawItemBackground(frame, selector, w, h);

	const sh = sw * GetAspectRatio(false);
	const so = (h - sh) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));

	painter.move(style.button.padding, so);
	painter.drawSprite(dict, name, sw, sh);

	if (textData !== undefined) {
		painter.move(
			sw + spriteButtonStyle.padding,
			-so + (h - GetRenderedCharacterHeight(textData.scale, textData.font)) / 2 + style.item.textOffset
		);
		painter.drawText(textData);
	}

	frame.endItem();

	return isClicked;
}
