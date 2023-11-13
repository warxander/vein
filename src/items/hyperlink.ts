import { MouseCursor } from '../core/painter';
import { context } from '../exports';
import { Color } from '../exports';

export function hyperlink(url: string, urlText: string | null) {
	const painter = context.getPainter();
	const style = context.getStyle();

	const id = context.tryGetItemId() ?? 'hyperlink';
	const hyperlinkProperties = style.getProperties(id);
	const font = hyperlinkProperties.get<number>('font-family');
	const scale = hyperlinkProperties.get<number>('font-size');

	painter.setText(font, scale, urlText ?? url);

	const w = context.tryGetItemWidth() ?? painter.getTextWidth();
	const h = style.item.height;

	context.beginItem(w, h);

	const isHovered = context.isItemHovered();

	if (isHovered) {
		painter.setMouseCursor(MouseCursor.MiddleFinger);

		if (context.isItemClicked()) SendNUIMessage({ openUrl: { url: url } });
	}

	const properties = isHovered ? style.getProperties(`${id}:hover`) : hyperlinkProperties;
	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText();

	context.endItem();
}
