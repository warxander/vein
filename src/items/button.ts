import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import { drawItemBackground } from '../core/utils';

/**
 * @category Items
 */
export function button(text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('button');

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale) + style.button.padding * 2;
	const h = style.item.height;

	frame.beginItem(w, h);

	const state: string | undefined = frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined;
	if (state !== undefined) selector = frame.buildStyleSelector('button', state);

	drawItemBackground(frame, selector, w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(style.button.padding, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();

	return frame.isItemClicked();
}
