import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function separator(w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const h = style.item.height;

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(frame.buildStyleSelector('separator'), 'color'));
	painter.move(0, (style.item.height - style.separator.height) / 2);
	painter.drawRect(w, style.separator.height);

	frame.endItem();
}
