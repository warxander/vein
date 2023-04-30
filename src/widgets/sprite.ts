import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('sprite', function (dict, name, w, h) {
		context.beginDraw(w, h);

		painter.setColor(style.sprite.color);
		painter.drawSprite(dict, name, w, h);

		context.endDraw();
	});
}
