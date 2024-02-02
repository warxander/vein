import { Frame, getFrameChecked } from '../core/frame';
import { getDefaultStyleSelectorState, wait } from '../core/utils';
import { Color } from '../core/types';
import { TextData } from '../core/painter';

const KEYBOARD_TITLE_ENTRY = 'VEIN_EDIT_KEYBOARD_TITLE';

/**
 * @category Items
 */
export async function textEdit(
	text: string,
	keyboardTitle: string,
	maxTextLength: number,
	isSecretMode = false,
	placeholderText: string | null = null
): Promise<string> {
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

	let keyboardResultText = null;

	if (frame.isItemClicked()) {
		AddTextEntry(KEYBOARD_TITLE_ENTRY, keyboardTitle);
		DisplayOnscreenKeyboard(1, KEYBOARD_TITLE_ENTRY, '', text, '', '', '', maxTextLength);

		while (true) {
			await wait(0);

			DisableAllControlActions(0);

			const status = UpdateOnscreenKeyboard();
			if (status === 1) {
				keyboardResultText = GetOnscreenKeyboardResult();
				break;
			} else if (status === 2) break;
		}
	}

	selector = frame.buildStyleSelector('text-edit', getDefaultStyleSelectorState(frame));

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.drawRect(w, h);

	painter.move(style.textEdit.padding, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);

	const inputText = keyboardResultText ?? text;
	const hasInputText = inputText.length !== 0;
	const hasPlaceholderText = placeholderText !== null;

	if (hasInputText || hasPlaceholderText) {
		painter.setColor(style.getPropertyAs<Color>(selector, hasInputText ? 'color' : 'placeholder-color'));
		painter.drawText(
			new TextData(
				hasPlaceholderText ? placeholderText : isSecretMode ? inputText.replace(/./g, '*') : inputText,
				font,
				scale
			)
		);
	}

	frame.endItem();

	return inputText;
}
