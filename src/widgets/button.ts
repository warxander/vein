import { getCurrentContext } from '../../index';
import { Color, Image } from '../common/types';
import { Style } from '../core/style';

export function declareExport() {
	globalThis.exports('button', function (text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);
		painter.setTextOpts();

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth() + style.button.spacing * 2;
		const h = style.widget.height;

		context.beginDraw(w, h);

		const properties = style.getProperties(context.isWidgetHovered() ? 'button:hover' : 'button');

		const backgroundImage = properties.tryGet<Image>('background-image');
		if (backgroundImage !== undefined) {
			const backgroundColor = properties.tryGet<Color>('background-color');
			painter.setColor(backgroundColor ?? Style.SPRITE_COLOR);
			painter.drawSprite(backgroundImage[0], backgroundImage[1], w, h);
		} else {
			painter.setColor(properties.get<Color>('background-color'));
			painter.drawRect(w, h);
		}

		painter.setColor(properties.get<Color>('color'));
		painter.move(style.button.spacing, 0);
		painter.drawText();

		context.endDraw();

		return context.isWidgetClicked();
	});
}
