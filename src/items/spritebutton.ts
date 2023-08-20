import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('spriteButton', function (dict: string, name: string, text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const id = context.getItemId() ?? 'sprite-button';
		const spriteButtonProperties = style.getProperties(id);
		const font = spriteButtonProperties.get<number>('font-family');
		const scale = spriteButtonProperties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const spriteButtonStyle = style.spriteButton;
		const sw = spriteButtonStyle.spriteWidth;

		const w =
			context.getItemWidth() ||
			painter.calculateTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
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
			-so + (h - painter.calculateTextLineHeight(font, scale)) / 2 + style.item.textOffset
		);
		painter.drawText();

		context.endDraw();

		return context.isItemClicked();
	});
}
