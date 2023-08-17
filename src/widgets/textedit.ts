import { getCurrentContext } from '../../index';
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
			text = '',
			keyboardTitle: string,
			maxTextLength: number,
			isSecretMode: boolean
		): Promise<TextEditResult> {
			const context = getCurrentContext();
			const painter = context.getPainter();
			const style = painter.getStyle();

			const _keyboardTitleEntry = 'VEIN_EDIT_KEYBOARD_TITLE';

			const w = context.getWidgetWidth() ?? maxTextLength * style.textEdit.symbolWidth;
			const h = style.widget.height;

			context.beginDraw(w, h);

			let newText = text;

			if (context.isWidgetClicked()) {
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

			const properties = style.getProperties(context.isWidgetHovered() ? 'text-edit:hover' : 'text-edit');

			painter.setColor(properties.get<Color>('background-color'));
			painter.drawRect(w, h);

			const lineOffset = h - style.textEdit.lineHeight;
			painter.move(0, lineOffset);

			const color = properties.get<Color>('color');

			painter.setColor(color);
			painter.drawRect(w, style.textEdit.lineHeight);

			painter.move(0, -lineOffset);

			painter.setText(isSecretMode ? text.replace(/./g, '*') : text);
			painter.setTextOpts();
			painter.setColor(style.getProperty<Color>('text-edit', 'color'));
			painter.drawText();

			context.endDraw();

			return { isTextChanged: newText != text, text: newText };
		}
	);
}
