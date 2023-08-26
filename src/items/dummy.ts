import { context } from '../index';

export function registerExport() {
	globalThis.exports('dummy', function (w: number, h: number) {
		context.beginItem(w, h);
		context.endItem();
	});
}
