import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function collapsingHeader(isCollapsed: boolean, text: string): boolean {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'collapsing-header';
	const collapsingHeaderProperties = style.getProperties(id);
	const font = collapsingHeaderProperties.get<number>('font-family');
	const scale = collapsingHeaderProperties.get<number>('font-size');

	painter.setText(font, scale, text);

	const w =
		ui.tryGetItemWidth() ??
		painter.getTextWidth() + style.collapsingHeader.spacing * 3 + style.collapsingHeader.spriteWidth;
	const h = style.item.height;

	ui.beginItem(w, h);

	if (ui.isItemClicked()) isCollapsed = !isCollapsed;

	const properties = ui.isItemHovered() ? style.getProperties(`${id}:hover`) : collapsingHeaderProperties;

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

	ui.endItem();

	return isCollapsed;
}
