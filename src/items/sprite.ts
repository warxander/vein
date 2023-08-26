import { context } from '../index';
import { Style } from '../core/style';

export function registerExport() {
	globalThis.exports('sprite', function (dict: string, name: string, w: number, h: number) {
		const painter = context.getPainter();

		context.beginItem(w, h);

		painter.setColor(Style.SPRITE_COLOR);
		painter.drawSprite(dict, name, w, h);

		context.endItem();
	});
}
