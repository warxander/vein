import { context } from '../exports';
import { Style } from '../core/style';

export function sprite(dict: string, name: string, w: number, h: number) {
	const painter = context.getPainter();

	context.beginItem(w, h);

	painter.setColor(Style.SPRITE_COLOR);
	painter.drawSprite(dict, name, w, h);

	context.endItem();
}
