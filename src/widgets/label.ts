import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport(): void {
	globalThis.exports('label', function (text: string | undefined): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);
		painter.setTextOpts();

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth();
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(style.getProperty<Color>('label', 'color'));
		painter.drawText(style.label.text.offset);

		context.endDraw();
	});
}
