import { context } from '../exports';
import { Color } from '../exports';

export function spriteButton(dict: string, name: string, text: string): boolean {
	const painter = context.getPainter();
	const style = painter.getStyle();

	const id = context.tryGetItemId() ?? 'sprite-button';
	const spriteButtonProperties = style.getProperties(id);
	const font = spriteButtonProperties.get<number>('font-family');
	const scale = spriteButtonProperties.get<number>('font-size');

	painter.setTextFont(font, scale);
	painter.setText(text);

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;

	const w =
		context.tryGetItemWidth() || painter.getTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
	const h = style.item.height;

	context.beginItem(w, h);

	const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : spriteButtonProperties;

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
	painter.drawText();

	context.endItem();

	return context.isItemClicked();
}
