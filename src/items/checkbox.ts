import { context } from '../exports';
import { Color } from '../exports';

export function checkBox(isChecked: boolean, text?: string): boolean {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const id = context.tryGetItemId() ?? 'check-box';
	const checkBoxProperties = style.getProperties(id);
	const font = checkBoxProperties.get<number>('font-family');
	const scale = checkBoxProperties.get<number>('font-size');

	painter.setTextFont(font, scale);
	if (text !== undefined) context.setNextTextEntry('STRING', text);

	const aspectRatio = GetAspectRatio(false);
	const checkboxStyle = style.checkbox;
	let cw = checkboxStyle.height / aspectRatio;

	const w = context.tryGetItemWidth() ?? cw + checkboxStyle.spacing + painter.getTextWidth();
	const h = style.item.height;

	context.beginItem(w, h);

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
		(h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.drawText();

	context.endItem();

	return isChecked;
}
