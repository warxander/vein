import { Context } from '../core/context';

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('sprite', function (dict: string, name: string, w: number, h: number) {
		context.beginDraw(w, h);

		painter.setColor(style.getSpriteColor());
		painter.drawSprite(dict, name, w, h);

		context.endDraw();
	});
}
