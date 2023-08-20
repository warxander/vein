import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('button', function (text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const id = context.getItemId() ?? 'button';
		const buttonProperties = style.getProperties(id);
		const font = buttonProperties.get<number>('font-family');
		const scale = buttonProperties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const w = context.getItemWidth() ?? painter.calculateTextWidth() + style.button.spacing * 2;
		const h = style.item.height;

		context.beginDraw(w, h);

		const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : buttonProperties;

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
