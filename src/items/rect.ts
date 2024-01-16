import { getFrameChecked } from '../core/frame';

/**
 * @category Items
 */
export function rect(w: number, h: number, r = 255, g = 255, b = 255, a = 255) {
	const frame = getFrameChecked();
	const painter = frame.getPainter();

	frame.beginItem(w, h);

	painter.setColor([r, g, b, a]);
	painter.drawRect(w, h);

	frame.endItem();
}
