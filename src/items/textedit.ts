import { Frame, getFrameChecked } from '../core/frame';
import { wait } from '../core/utils';
import { Color } from '../core/types';

const KEYBOARD_TITLE_ENTRY = 'VEIN_EDIT_KEYBOARD_TITLE';

/**
 * @category Items
 */
export async function textEdit(
	text: string,
	keyboardTitle: string,
	maxTextLength: number,
	isSecretMode: boolean,
	placeholderText: string
): Promise<string> {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('text-edit');

	const w =
		frame.tryGetItemWidth() ??
		painter.getTextWidth(
			'M'.repeat(Math.max(maxTextLength, placeholderText.length)),
			style.getPropertyAs<number>(selector, 'font-family'),
			style.getPropertyAs<number>(selector, 'font-size')
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

	const inputText = keyboardResultText ?? text;

	selector = frame.buildStyleSelector(
		'text-edit',
		frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined
	);

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.drawRect(w, h);

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	painter.move(style.textEdit.padding, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);

	if (inputText.length !== 0) {
		painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
		painter.drawText(isSecretMode ? inputText.replace(/./g, '*') : inputText, font, scale);
	} else {
		painter.setColor(style.getPropertyAs<Color>(selector, 'placeholder-color'));
		painter.drawText(placeholderText, font, scale);
	}

	frame.endItem();

	return inputText;
}
