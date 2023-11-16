import { Frame, MouseCursor, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function hyperlink(url: string, urlText: string | null) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const id = frame.tryGetItemId() ?? 'hyperlink';
	const hyperlinkProperties = style.getProperties(id);
	const font = hyperlinkProperties.get<number>('font-family');
	const scale = hyperlinkProperties.get<number>('font-size');
	const text = urlText ?? url;

	const w = frame.tryGetItemWidth() ?? painter.getTextWidth(text, font, scale);
	const h = style.item.height;

	frame.beginItem(w, h);

	const isHovered = frame.isItemHovered();

	if (isHovered) {
		frame.setMouseCursor(MouseCursor.MiddleFinger);

		if (frame.isItemClicked()) SendNUIMessage({ openUrl: { url: url } });
	}

	const properties = isHovered ? style.getProperties(`${id}:hover`) : hyperlinkProperties;
	painter.setColor(properties.get<Color>('color'));
	painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
	painter.drawText(text, font, scale);

	frame.endItem();
}
