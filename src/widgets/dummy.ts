import { getCurrentContext } from '../index';

export function declareExport(): void {
	globalThis.exports('dummy', function (w: number, h: number): void {
		const context = getCurrentContext();
		context.beginDraw(w, h);
		context.endDraw();
	});
}
