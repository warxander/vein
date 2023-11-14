import { Ui, getUiChecked } from '../ui';

/** Horizontal if in row mode, vertical otherwise */
export function spacing(count = 1) {
	const ui = getUiChecked();

	const isInRowMode = ui.getLayout().isInRowMode();

	const windowSpacing = Ui.getWindowSpacing();
	const w = isInRowMode ? windowSpacing.x * count : 0;
	const h = isInRowMode ? 0 : windowSpacing.y * count;

	ui.beginItem(w, h);

	ui.endItem();
}
