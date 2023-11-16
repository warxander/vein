import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function spriteButton(dict: string, name: string, text: string): boolean {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const id = frame.tryGetItemId() ?? 'sprite-button';
	const spriteButtonProperties = style.getProperties(id);
	const font = spriteButtonProperties.get<number>('font-family');
	const scale = spriteButtonProperties.get<number>('font-size');

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;

	const w =
		frame.tryGetItemWidth() ||
		painter.getTextWidth(text, font, scale) + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
	const h = style.item.height;

	frame.beginItem(w, h);

	const properties = frame.isItemHovered() ? style.getProperties(`${id}:hover`) : spriteButtonProperties;

	painter.drawItemBackground(properties, w, h);

	const sh = sw * GetAspectRatio(false);
	const so = (h - sh) / 2;

	painter.setColor(properties.get<Color>('color'));

	painter.move(style.button.spacing, so);
	painter.drawSprite(dict, name, sw, sh);

	painter.move(
		sw + spriteButtonStyle.spacing,
		-so + (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
	);
	painter.drawText(text, font, scale);

	frame.endItem();

	return frame.isItemClicked();
}
