import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function checkBox(isChecked: boolean, text: string): boolean {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'check-box';
	const checkBoxProperties = style.getProperties(id);
	const font = checkBoxProperties.get<number>('font-family');
	const scale = checkBoxProperties.get<number>('font-size');

	painter.setText(font, scale, text);

	const aspectRatio = GetAspectRatio(false);
	const checkboxStyle = style.checkbox;
	let cw = checkboxStyle.height / aspectRatio;

	const w = ui.tryGetItemWidth() ?? cw + checkboxStyle.spacing + painter.getTextWidth();
	const h = style.item.height;

	ui.beginItem(w, h);

	if (ui.isItemClicked()) isChecked = !isChecked;

	const vo = (h - checkboxStyle.height) / 2;

	const properties = ui.isItemHovered() ? style.getProperties(`${id}:hover`) : checkBoxProperties;
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
		(h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.drawText();

	ui.endItem();

	return isChecked;
}
