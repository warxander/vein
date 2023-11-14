import { Ui, getUiChecked } from '../ui';
import { Color } from '../core/types';

export function spriteButton(dict: string, name: string, text: string): boolean {
	const ui = getUiChecked();

	const painter = ui.getPainter();
	const style = Ui.getStyle();

	const id = ui.tryGetItemId() ?? 'sprite-button';
	const spriteButtonProperties = style.getProperties(id);
	const font = spriteButtonProperties.get<number>('font-family');
	const scale = spriteButtonProperties.get<number>('font-size');

	painter.setText(font, scale, text);

	const spriteButtonStyle = style.spriteButton;
	const sw = spriteButtonStyle.spriteWidth;

	const w =
		ui.tryGetItemWidth() || painter.getTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
	const h = style.item.height;

	ui.beginItem(w, h);

	const properties = ui.isItemHovered() ? style.getProperties(`${id}:hover`) : spriteButtonProperties;

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

	ui.endItem();

	return ui.isItemClicked();
}
