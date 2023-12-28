import { Frame, getFrameChecked } from '../core/frame';
import { LayoutOrientation } from '../core/layout';

/**
 * @category Items
 */
export function spacing(count = 1) {
	const frame = getFrameChecked();

	const isHorizontal = frame.getLayout().getOrientation() === LayoutOrientation.Horizontal;

	const frameSpacing = Frame.getSpacing();
	const w = isHorizontal ? frameSpacing.x * count : 0;
	const h = isHorizontal ? 0 : frameSpacing.y * count;

	frame.beginItem(w, h);

	frame.endItem();
}
