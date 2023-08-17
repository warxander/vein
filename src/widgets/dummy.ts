import { getCurrentContext } from '../../index';

export function declareExport() {
	globalThis.exports('dummy', function (w: number, h: number) {
		const context = getCurrentContext();
		context.beginDraw(w, h);
		context.endDraw();
	});
}
