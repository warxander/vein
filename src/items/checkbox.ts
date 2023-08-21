import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('checkBox', function (isChecked: boolean, text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const id = context.getItemId() ?? 'check-box';
		const checkBoxProperties = style.getProperties(id);
		const font = checkBoxProperties.get<number>('font-family');
		const scale = checkBoxProperties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const aspectRatio = GetAspectRatio(false);
		const checkboxStyle = style.checkbox;
		let cw = checkboxStyle.height / aspectRatio;

		const w = context.getItemWidth() ?? cw + checkboxStyle.spacing + painter.calculateTextWidth();
		const h = style.item.height;

		context.beginDraw(w, h);

		if (context.isItemClicked()) isChecked = !isChecked;

		const vo = (h - checkboxStyle.height) / 2;

		const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : checkBoxProperties;
		const color = properties.get<Color>('color');
		const backgroundColor = properties.get<Color>('background-color');

		painter.setColor(backgroundColor);
		painter.move(0, vo);
		painter.drawRect(cw, checkboxStyle.height);

		if (isChecked) {
			const inlineWidth = checkboxStyle.inlineHeight / aspectRatio;
			cw = cw - inlineWidth * 2;
			painter.move(inlineWidth, checkboxStyle.inlineHeight);
			painter.setColor(color);
			painter.drawRect(cw, cw * aspectRatio);
			painter.move(-inlineWidth, -checkboxStyle.inlineHeight);
		}

		painter.move(0, -vo);

		painter.setColor(color);
		painter.move(
			checkboxStyle.height / aspectRatio + checkboxStyle.spacing * 2,
			(h - painter.calculateTextLineHeight(font, scale)) / 2 + style.item.textOffset
		);
		painter.drawText();

		context.endDraw();

		return isChecked;
	});
}
