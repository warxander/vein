import { Frame, getFrameChecked } from '../core/frame';

/** Horizontal if in row mode, vertical otherwise */
export function spacing(count = 1) {
	const frame = getFrameChecked();

	const isInRowMode = frame.getLayout().isInRowMode();

	const frameSpacing = Frame.getSpacing();
	const w = isInRowMode ? frameSpacing.x * count : 0;
	const h = isInRowMode ? 0 : frameSpacing.y * count;

	frame.beginItem(w, h);

	frame.endItem();
}
