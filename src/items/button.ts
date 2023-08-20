import { getCurrentContext } from '../../index';
import { Color, Image } from '../common/types';
import { Style } from '../core/style';

export function declareExport() {
	globalThis.exports('button', function (text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const buttonProperties = style.getProperties('button');
		const font = buttonProperties.get<number>('font-family');
		const scale = buttonProperties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const w = context.getItemWidth() ?? painter.calculateTextWidth() + style.button.spacing * 2;
		const h = style.item.height;

		context.beginDraw(w, h);

		const properties = context.isItemHovered() ? style.getProperties('button:hover') : buttonProperties;

		painter.drawItemBackground(properties, w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(
			style.button.spacing,
			(h - painter.calculateTextLineHeight(font, scale)) / 2 + style.item.textOffset
		);
		painter.drawText();

		context.endDraw();

		return context.isItemClicked();
	});
}
