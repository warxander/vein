import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function textArea(text: string, w: number) {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const properties = style.getProperties(ui.tryGetItemId() ?? 'text-area');
	const font = properties.get<number>('font-family');
	const scale = properties.get<number>('font-size');

	painter.setTextWidth(w);
	painter.setText(font, scale, text);
	const lc = painter.getTextLineCount();

	const h = lc === 1 ? style.item.height : GetRenderedCharacterHeight(scale, font) * (lc + 1);

	ui.beginItem(w, h);

	painter.setColor(properties.get<Color>('color'));
	if (lc == 1) painter.move(0, style.item.textOffset);

	painter.setTextWidth(w);
	painter.setText(font, scale, text);
	painter.drawText();

	ui.endItem();
}
