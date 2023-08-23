import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('label', function (text?: string) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const properties = style.getProperties(context.getItemId() ?? 'label');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setText(font, scale, text);

		const w = context.getItemWidth() ?? painter.getTextWidth();
		const h = style.item.height;

		context.beginDraw(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
		painter.drawText();

		context.endDraw();
	});
}
