import { getCurrentContext } from '../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('button', function (text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const id = context.getItemId() ?? 'button';
		const buttonProperties = style.getProperties(id);
		const font = buttonProperties.get<number>('font-family');
		const scale = buttonProperties.get<number>('font-size');

		painter.setText(font, scale, text);

		const w = context.getItemWidth() ?? painter.getTextWidth() + style.button.spacing * 2;
		const h = style.item.height;

		context.beginDraw(w, h);

		const properties = context.isItemHovered() ? style.getProperties(`${id}:hover`) : buttonProperties;

		painter.drawItemBackground(properties, w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(style.button.spacing, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
		painter.drawText();

		context.endDraw();

		return context.isItemClicked();
	});
}
