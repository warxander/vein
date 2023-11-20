import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

/**
 * @category Items
 */
export function collapsingHeader(isCollapsed: boolean, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	let selector = frame.buildStyleSelector('collapsing-header');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const iw = frame.tryGetItemWidth();

	let w = 0;
	if (iw !== undefined) w = iw;
	else {
		w += style.collapsingHeader.spriteWidth;
		const tw = painter.getTextWidth(text, font, scale);
		if (tw !== 0) w += tw + style.collapsingHeader.spacing * 3;
	}

	const h = style.item.height;

	frame.beginItem(w, h);

	if (frame.isItemClicked()) isCollapsed = !isCollapsed;

	const state: string | undefined = frame.isItemPressed() ? 'active' : frame.isItemHovered() ? 'hover' : undefined;
	if (state !== undefined) selector = frame.buildStyleSelector('collapsing-header', state);

	const sh = style.collapsingHeader.spriteWidth * GetAspectRatio(false);
	painter.move(style.collapsingHeader.spacing, (h - sh) / 2);

	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	RequestStreamedTextureDict('commonmenu', false);
	painter.drawSprite('commonmenu', 'arrowright', style.collapsingHeader.spriteWidth, sh, isCollapsed ? 0 : 90);

	painter.move(
		style.collapsingHeader.spriteWidth,
		sh / 2 - GetRenderedCharacterHeight(scale, font) / 2 + style.item.textOffset
	);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawText(text, font, scale);

	frame.endItem();

	return isCollapsed;
}
