import { getCurrentContext } from '../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('spriteButton', function (dict: string, name: string, text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const id = context.getItemId() ?? 'sprite-button';
		const spriteButtonProperties = style.getProperties(id);
		const font = spriteButtonProperties.get<number>('font-family');
		const scale = spriteButtonProperties.get<number>('font-size');

		painter.setText(font, scale, text);

		const spriteButtonStyle = style.spriteButton;
		const sw = spriteButtonStyle.spriteWidth;

		const w =
			context.getItemWidth() ||
			painter.getTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
		const h = style.item.height;

		context.beginDraw(w, h);

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

		context.endDraw();

		return context.isItemClicked();
	});
}
