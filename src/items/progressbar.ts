import { Frame, getFrameChecked } from '../core/frame';
import { numberEquals } from '../core/utils';
import { Color } from '../core/types';

export function progressBar(min: number, value: number, max: number, w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	frame.beginItem(w, style.item.height);

	const h = style.progressBar.height;

	const properties = style.getProperties(frame.tryGetItemId() ?? 'progress-bar');

	painter.setColor(properties.get<Color>('background-color'));
	painter.move(0, (style.item.height - h) / 2);
	painter.drawRect(w, h);

	if (!numberEquals(value, min)) {
		const pw = numberEquals(value, max) ? w : ((value - min) / (max - min)) * w;

		painter.setColor(properties.get<Color>('color'));
		painter.drawRect(pw, h);
	}

	frame.endItem();
}
