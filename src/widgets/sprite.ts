import { getCurrentContext } from '../../index';
import { Style } from '../core/style';

export function declareExport() {
	globalThis.exports('sprite', function (dict: string, name: string, w: number, h: number) {
		const context = getCurrentContext();
		const painter = context.getPainter();

		context.beginDraw(w, h);

		painter.setColor(Style.SPRITE_COLOR);
		painter.drawSprite(dict, name, w, h);

		context.endDraw();
	});
}
