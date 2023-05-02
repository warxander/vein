import { Context } from '../core/context';
import { wait } from '../core/utils';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports(
		'textEdit',
		async function (text = '', keyboardTitle: string, maxTextLength: number, isSecretMode: boolean) {
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
					if (status == 1) {
						newText = GetOnscreenKeyboardResult();
						break;
					} else if (status == 2) break;
				}
			}

			painter.setColor(style.color.widget);
			painter.drawRect(w, h);

			const lineOffset = h - style.textEdit.lineHeight;
			painter.move(0, lineOffset);

			painter.setColor(context.isWidgetHovered() ? style.color.hover : style.color.primary);
			painter.drawRect(w, style.textEdit.lineHeight);

			painter.move(0, -lineOffset);

			painter.setText(isSecretMode ? text.replace(/./g, '*') : text);
			painter.setTextOpts();
			painter.setColor(style.color.primary);
			painter.drawText();

			context.endDraw();

			return { isTextChanged: newText != text, text: newText };
		}
	);
}
