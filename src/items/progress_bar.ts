import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

/**
 * @category Items
 * @param value - number in the range [0...1]
 */
export function progressBar(value: number, w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildItemStyleSelector('progress-bar');

	frame.beginItem(w, style.item.height);

	const h = style.progressBar.height;

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.move(0, (style.item.height - h) / 2);
	painter.drawRect(w, h);

	if (value !== 0) {
		painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
		painter.drawRect(w * Math.min(1, Math.max(0, value)), h);
	}

	frame.endItem();
}
