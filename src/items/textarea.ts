import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('textArea', function (text: string, w?: number) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getItemWidth()) as number;

		painter.setText(text);

		const properties = style.getProperties('text-area');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setTextOptions(font, scale);

		painter.setTextMaxWidth(w);

		const lc = painter.calculateTextLineCount();
		const h = lc === 1 ? style.item.height : painter.calculateTextLineHeight(font, scale) * (lc + 1);

		context.beginDraw(w, h);

		painter.setColor(properties.get<Color>('color'));
		if (lc == 1) painter.move(0, style.item.textOffset);
		painter.drawText();

		context.endDraw();
	});
}
