import { getCurrentContext } from '../../index';
import { Color, Image } from '../common/types';
import { Style } from '../core/style';

export function declareExport() {
	globalThis.exports('spriteButton', function (dict: string, name: string, text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const spriteButtonProperties = style.getProperties('sprite-button');
		const font = spriteButtonProperties.get<number>('font-family');
		const scale = spriteButtonProperties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const spriteButtonStyle = style.spriteButton;
		const sw = spriteButtonStyle.spriteWidth;

		const w =
			context.getWidgetWidth() ||
			painter.calculateTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
		const h = style.widget.height;

		context.beginDraw(w, h);

		const properties = context.isWidgetHovered()
			? style.getProperties('sprite-button:hover')
			: spriteButtonProperties;

		const backgroundImage = properties.tryGet<Image>('background-image');
		if (backgroundImage !== undefined) {
			const backgroundColor = properties.tryGet<Color>('background-color');
			painter.setColor(backgroundColor ?? Style.SPRITE_COLOR);
			painter.drawSprite(backgroundImage[0], backgroundImage[1], w, h);
		} else {
			painter.setColor(properties.get<Color>('background-color'));
			painter.drawRect(w, h);
		}

		const sh = sw * GetAspectRatio(false);
		const so = (h - sh) / 2;

		painter.setColor(properties.get<Color>('color'));

		painter.move(style.button.spacing, so);
		painter.drawSprite(dict, name, sw, sh);

		painter.move(
			sw + spriteButtonStyle.spacing,
			-so + (h - painter.calculateTextLineHeight(font, scale)) / 2 + style.widget.textOffset
		);
		painter.drawText();

		context.endDraw();

		return context.isWidgetClicked();
	});
}
