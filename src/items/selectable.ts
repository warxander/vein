import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function selectable(isSelected: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = 'selectable';
	const textData = Utils.createTextData(text, selector);
	const textWidth = painter.getTextWidth(textData);

	const w = Frame.getNextItemWidth() ?? textWidth + style.selectable.padding * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	const inputIsSelected = frame.isItemClicked() ? !isSelected : isSelected;

	const state = Utils.getStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildItemStyleSelector('selectable', state);

	painter.setColor(style.getPropertyAs<Color>(selector, inputIsSelected ? 'accent-color' : 'background-color'));
	painter.drawRect(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(
		(w - textWidth) / 2,
		(h - painter.getFontSize(textData.font, textData.scale)) / 2 + style.item.textOffset
	);
	painter.drawText(textData);

	frame.endItem();

	return inputIsSelected;
}
