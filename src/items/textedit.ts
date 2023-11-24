import { Frame, getFrameChecked } from '../core/frame';
import { wait } from '../core/utils';
import { Color } from '../core/types';

const KEYBOARD_TITLE_ENTRY = 'VEIN_EDIT_KEYBOARD_TITLE';

/**
 * @category Items
 */
export interface ITextEditResponse {
	isTextChanged: boolean;
	text: string;
}

/**
 * @category Items
 */
export async function textEdit(
	text: string,
	keyboardTitle: string,
	maxTextLength: number,
	isSecretMode: boolean
): Promise<ITextEditResponse> {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('text-edit');

	const w =
		frame.tryGetItemWidth() ??
		painter.getTextWidth(
			'M'.repeat(maxTextLength),
			style.getPropertyAs<number>(selector, 'font-family'),
			style.getPropertyAs<number>(selector, 'font-size')
		) +
			style.textEdit.padding * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	selector = frame.buildStyleSelector(
		'text-edit',
		frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined
	);

	let newText = text;

	if (frame.isItemClicked()) {
		AddTextEntry(KEYBOARD_TITLE_ENTRY, keyboardTitle);
		DisplayOnscreenKeyboard(1, KEYBOARD_TITLE_ENTRY, '', text, '', '', '', maxTextLength);

		while (true) {
			await wait(0);

			DisableAllControlActions(0);

			const status = UpdateOnscreenKeyboard();
			if (status === 1) {
				newText = GetOnscreenKeyboardResult();
				break;
			} else if (status === 2) break;
		}
	}

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.drawRect(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	painter.move(style.textEdit.padding, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(isSecretMode ? text.replace(/./g, '*') : text, font, scale);

	frame.endItem();

	return { isTextChanged: newText != text, text: newText };
}
