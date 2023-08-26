import { context } from '../exports';

export function dummy(w: number, h: number) {
	context.beginItem(w, h);
	context.endItem();
}
