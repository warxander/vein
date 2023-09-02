import { Color, context } from '../exports';

export function collapsingHeader(isCollapsed: boolean, text: string): boolean {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const id = context.tryGetItemId() ?? 'collapsing-header';
	const collapsingHeaderProperties = style.getProperties(id);
	const font = collapsingHeaderProperties.get<number>('font-family');
	const scale = collapsingHeaderProperties.get<number>('font-size');

	painter.setText(font, scale, text);

	const w =
		context.tryGetItemWidth() ??
		painter.getTextWidth() + style.collapsingHeader.spacing * 3 + style.collapsingHeader.spriteWidth;
	const h = style.item.height;

	context.beginItem(w, h);

	if (context.isItemClicked()) isCollapsed = !isCollapsed;

	const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : collapsingHeaderProperties;

	painter.drawItemBackground(properties, w, h);

	painter.setColor(properties.get<Color>('color'));

	const sh = style.collapsingHeader.spriteWidth * GetAspectRatio(false);
	painter.move(style.collapsingHeader.spacing, (h - sh) / 2);

	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.spriteWidth, sh, isCollapsed ? 0 : 90);

	painter.move(
		style.collapsingHeader.spriteWidth,
		sh / 2 - GetRenderedCharacterHeight(scale, font) / 2 + style.item.textOffset
	);
	painter.drawText();

	context.endItem();

	return isCollapsed;
}
