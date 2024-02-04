import { Frame, getFrameChecked } from '../core/frame';
import { Color, TextData } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function textEdit(
	text: string,
	keyboardTitle: string,
	maxTextLength: number,
	isSecretMode = false,
	placeholderText: string | null = null
): string | null {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('text-edit');

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const w =
		frame.tryGetItemWidth() ??
		painter.getTextWidth(
			new TextData(
				'M'.repeat(Math.max(maxTextLength, placeholderText !== null ? placeholderText.length : 0)),
				font,
				scale
			)
		) +
			style.textEdit.padding * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	let resultText: string | null = null;
	if (frame.isKeyboardOnScreen()) resultText = frame.tryGetOnScreenKeyboardResult();
	else if (frame.isItemClicked()) frame.showOnScreenKeyboard(keyboardTitle, text, maxTextLength);

	selector = frame.buildStyleSelector('text-edit', Utils.getStyleSelectorState(frame));

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.drawRect(w, h);

	painter.move(style.textEdit.padding, (h - painter.getFontSize(font, scale)) / 2 + style.item.textOffset);

	const hasText = text.length !== 0;
	const hasPlaceholderText = placeholderText !== null;

	if (hasText || hasPlaceholderText) {
		painter.setColor(style.getPropertyAs<Color>(selector, hasText ? 'color' : 'placeholder-color'));
		painter.drawText(
			new TextData(hasText ? (isSecretMode ? text.replace(/./g, '*') : text) : placeholderText!, font, scale)
		);
	}

	frame.endItem();

	return resultText;
}
