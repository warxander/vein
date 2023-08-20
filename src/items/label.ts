import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('label', function (text?: string) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const properties = style.getProperties(context.getItemId() ?? 'label');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const w = context.getItemWidth() ?? painter.calculateTextWidth();
		const h = style.item.height;

		context.beginDraw(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(0, (h - painter.calculateTextLineHeight(font, scale)) / 2 + style.item.textOffset);
		painter.drawText();

		context.endDraw();
	});
}
