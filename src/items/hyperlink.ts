import { Frame, MouseCursor, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';
import { getDefaultStyleSelectorState } from '../core/utils';

/**
 * @category Items
 */
export function hyperlink(url: string, urlText: string | null = null) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('hyperlink');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');
	const text = urlText ?? url;

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemHovered()) {
		frame.setMouseCursor(MouseCursor.MiddleFinger);
		if (frame.isItemClicked()) SendNUIMessage({ openUrl: { url: url } });
	}

	const state = getDefaultStyleSelectorState(frame);
	if (state !== undefined) selector = frame.buildStyleSelector('hyperlink', state);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();
}
