import { getFrameChecked } from '../core/frame';

export function rect(w: number, h: number, r: number, g: number, b: number, a: number) {
	const frame = getFrameChecked();
	const painter = frame.getPainter();

	frame.beginItem(w, h);

	painter.setColor([r, g, b, a]);
	painter.drawRect(w, h);

	frame.endItem();
}
