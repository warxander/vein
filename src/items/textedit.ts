import { getCurrentContext } from '../index';
import { wait } from '../core/utils';
import { Color } from '../common/types';

interface TextEditResult {
	isTextChanged: boolean;
	text: string;
}

export function declareExport() {
	globalThis.exports(
		'textEdit',
		async function (
			text: string,
			keyboardTitle: string,
			maxTextLength: number,
			isSecretMode: boolean
		): Promise<TextEditResult> {
			const context = getCurrentContext();
			const painter = context.getPainter();
			const style = painter.getStyle();

			const _keyboardTitleEntry = 'VEIN_EDIT_KEYBOARD_TITLE';

			const w = context.getItemWidth() ?? maxTextLength * style.textEdit.symbolWidth;
			const h = style.item.height;

			context.beginDraw(w, h);

			let newText = text;

			if (context.isItemClicked()) {
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

			const id = context.getItemId() ?? 'text-edit';
			const textEditProperties = style.getProperties(id);
			const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : textEditProperties;

			painter.setColor(properties.get<Color>('background-color'));
			painter.drawRect(w, h);

			painter.setColor(properties.get<Color>('color'));

			const font = textEditProperties.get<number>('font-family');
			const scale = textEditProperties.get<number>('font-size');
			painter.setText(font, scale, isSecretMode ? text.replace(/./g, '*') : text);
			painter.move(
				style.textEdit.spacing,
				(h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
			);
			painter.drawText();

			context.endDraw();

			return { isTextChanged: newText != text, text: newText };
		}
	);
}
