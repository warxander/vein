import { Ui, MouseCursor, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function hyperlink(url: string, urlText: string | null) {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'hyperlink';
	const hyperlinkProperties = style.getProperties(id);
	const font = hyperlinkProperties.get<number>('font-family');
	const scale = hyperlinkProperties.get<number>('font-size');
	const text = urlText ?? url;

	const w = ui.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	ui.beginItem(w, h);

	const isHovered = ui.isItemHovered();

	if (isHovered) {
		ui.setMouseCursor(MouseCursor.MiddleFinger);

		if (ui.isItemClicked()) SendNUIMessage({ openUrl: { url: url } });
	}

	const properties = isHovered ? style.getProperties(`${id}:hover`) : hyperlinkProperties;
	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	ui.endItem();
}
