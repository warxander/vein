import { Frame, getFrameChecked } from '../core/frame';
import { numberEquals } from '../core/utils';
import { Color } from '../core/types';

/**
 * @category Items
 */
export function progressBar(value: number, min: number, max: number, w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildStyleSelector('progress-bar');

	frame.beginItem(w, style.item.height);

	const h = style.progressBar.height;

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.move(0, (style.item.height - h) / 2);
	painter.drawRect(w, h);

	if (!numberEquals(value, min)) {
		const pw = numberEquals(value, max) ? w : ((value - min) / (max - min)) * w;

		painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
		painter.drawRect(pw, h);
	}

	frame.endItem();
}
