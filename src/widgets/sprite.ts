import { getCurrentContext } from '../index';

export function declareExport(): void {
	globalThis.exports('sprite', function (dict: string, name: string, w: number, h: number): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		context.beginDraw(w, h);

		painter.setColor(style.getSpriteColor());
		painter.drawSprite(dict, name, w, h);

		context.endDraw();
	});
}
