import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

/**
 * @category Items
 */
export function checkBox(isChecked: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('check-box');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const aspectRatio = GetAspectRatio(false);
	const checkboxStyle = style.checkbox;
	let cw = checkboxStyle.height / aspectRatio;

	const iw = frame.tryGetItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += cw;
		const tw = painter.getTextWidth(text, font, scale);
		if (tw !== 0) w += checkboxStyle.spacing + tw;
	}
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isChecked = !isChecked;

	const state: string | undefined = frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined;
	if (state !== undefined) selector = frame.buildStyleSelector('check-box', state);

	const vo = (h - checkboxStyle.height) / 2;

	painter.move(0, vo);
	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.drawRect(cw, checkboxStyle.height);
	if (isChecked) {
		const inlineWidth = checkboxStyle.inlineHeight / aspectRatio;
		cw = cw - inlineWidth * 2;
		painter.move(inlineWidth, checkboxStyle.inlineHeight);
		painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
		painter.drawRect(cw, cw * aspectRatio);
		painter.move(-inlineWidth, -checkboxStyle.inlineHeight);
	}
	painter.move(0, -vo);

	painter.move(
		checkboxStyle.height / aspectRatio + checkboxStyle.spacing * 2,
		(h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(text, font, scale);

	frame.endItem();

	return isChecked;
}
