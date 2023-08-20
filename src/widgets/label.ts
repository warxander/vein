import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('label', function (text?: string) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);

		const properties = style.getProperties('label');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth();
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(0, (h - painter.calculateTextLineHeight(font, scale)) / 2 + style.widget.textOffset);
		painter.drawText();

		context.endDraw();
	});
}
