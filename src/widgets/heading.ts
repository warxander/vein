import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport(): void {
	globalThis.exports('heading', function (text: string | undefined): void {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const headingStyle = style.heading;

		painter.setText(text);
		painter.setTextOpts(headingStyle.text.font, headingStyle.text.scale);

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth();
		const h = headingStyle.height;

		context.beginDraw(w, h);

		painter.setColor(style.getProperty<Color>('heading', 'color'));
		painter.drawText(headingStyle.text.offset);

		context.endDraw();
	});
}
