import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function checkBox(isChecked: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = 'check-box';
	const textData = Utils.createTextData(text, selector);

	const aspectRatio = GetAspectRatio(false);
	const checkboxStyle = style.checkbox;
	let cw = checkboxStyle.height / aspectRatio;

	const iw = Frame.getNextItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += cw;
		const tw = painter.getTextWidth(textData);
		if (tw !== 0) w += checkboxStyle.padding + tw;
	}
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isChecked = !isChecked;

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildItemStyleSelector('check-box', state);

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
		checkboxStyle.height / aspectRatio + checkboxStyle.padding * 2,
		(h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(textData);

	frame.endItem();

	return isChecked;
}
