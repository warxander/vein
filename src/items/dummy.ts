import { getUiChecked } from '../ui';

export function dummy(w: number, h: number) {
	const ui = getUiChecked();

	ui.beginItem(w, h);
	ui.endItem();
}
