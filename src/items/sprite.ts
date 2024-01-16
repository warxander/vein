import { getFrameChecked } from '../core/frame';
import { Style } from '../core/style';

/**
 * @category Items
 */
export function sprite(dict: string, name: string, w: number, h: number, r = 255, g = 255, b = 255, a = 255) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();

	frame.beginItem(w, h);

	painter.setColor([r, g, b, a]);
	painter.drawSprite(dict, name, w, h);

	frame.endItem();
}
