import { getFrameChecked } from '../core/frame';
import { Style } from '../core/style';

export function sprite(dict: string, name: string, w: number, h: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();

	frame.beginItem(w, h);

	painter.setColor(Style.SPRITE_COLOR);
	painter.drawSprite(dict, name, w, h);

	frame.endItem();
}
