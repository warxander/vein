import { Context } from '../core/context';

export function declareExport(context: Context) {
	globalThis.exports('dummy', function (w: number, h: number) {
		context.beginDraw(w, h);
		context.endDraw();
	});
}
