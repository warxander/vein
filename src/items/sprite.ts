import { getUiChecked } from '../ui';
import { Style } from '../core/style';

export function sprite(dict: string, name: string, w: number, h: number) {
	const ui = getUiChecked();

	const painter = ui.getPainter();

	ui.beginItem(w, h);

	painter.setColor(Style.SPRITE_COLOR);
	painter.drawSprite(dict, name, w, h);

	ui.endItem();
}
