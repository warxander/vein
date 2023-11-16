import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function collapsingHeader(isCollapsed: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const id = frame.tryGetItemId() ?? 'collapsing-header';
	const collapsingHeaderProperties = style.getProperties(id);
	const font = collapsingHeaderProperties.get<number>('font-family');
	const scale = collapsingHeaderProperties.get<number>('font-size');

	const w =
		frame.tryGetItemWidth() ??
		painter.getTextWidth(text, font, scale) +
			style.collapsingHeader.spacing * 3 +
			style.collapsingHeader.spriteWidth;
	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isCollapsed = !isCollapsed;

	const properties = frame.isItemHovered() ? style.getProperties(`${id}:hover`) : collapsingHeaderProperties;

	painter.setColor(properties.get<Color>('color'));

	const sh = style.collapsingHeader.spriteWidth * GetAspectRatio(false);
	painter.move(style.collapsingHeader.spacing, (h - sh) / 2);

	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.spriteWidth, sh, isCollapsed ? 0 : 90);

	painter.move(
		style.collapsingHeader.spriteWidth,
		sh / 2 - GetRenderedCharacterHeight(scale, font) / 2 + style.item.textOffset
	);
	painter.drawText(text, font, scale);

	frame.endItem();

	return isCollapsed;
}
