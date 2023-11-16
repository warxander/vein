import { getFrameChecked } from '../core/frame';

export function dummy(w: number, h: number) {
	const frame = getFrameChecked();

	frame.beginItem(w, h);
	frame.endItem();
}
