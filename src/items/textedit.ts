import { Ui, getUiChecked } from '../ui';
import { wait } from '../core/utils';
import { Color } from '../core/types';

export interface ITextEditResult {
	isTextChanged: boolean;
	text: string;
}

export async function textEdit(
	text: string,
	keyboardTitle: string,
	maxTextLength: number,
	isSecretMode: boolean
): Promise<ITextEditResult> {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const _keyboardTitleEntry = 'VEIN_EDIT_KEYBOARD_TITLE';

	const w = ui.tryGetItemWidth() ?? maxTextLength * style.textEdit.symbolWidth;
	const h = style.item.height;

	ui.beginItem(w, h);

	let newText = text;

	if (ui.isItemClicked()) {
		AddTextEntry(_keyboardTitleEntry, keyboardTitle);
		DisplayOnscreenKeyboard(1, _keyboardTitleEntry, '', text, '', '', '', maxTextLength);

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

	const id = ui.tryGetItemId() ?? 'text-edit';
	const textEditProperties = style.getProperties(id);
	const properties = ui.isItemHovered() ? style.getProperties(`${id}:hover`) : textEditProperties;

	painter.setColor(properties.get<Color>('background-color'));
	painter.drawRect(w, h);

	painter.setColor(properties.get<Color>('color'));

	const font = textEditProperties.get<number>('font-family');
	const scale = textEditProperties.get<number>('font-size');

	painter.setText(font, scale, isSecretMode ? text.replace(/./g, '*') : text);
	painter.move(style.textEdit.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	ui.endItem();

	return { isTextChanged: newText != text, text: newText };
}
