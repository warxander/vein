import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport(): void {
	globalThis.exports('button', function (text: string | undefined): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);
		painter.setTextOpts();

		const w = context.getWidgetWidth() ?? painter.calculateTextWidth() + style.button.spacing * 2;
		const h = style.widget.height;

		context.beginDraw(w, h);

		const properties = style.getProperties(context.isWidgetHovered() ? 'button:hover' : 'button');

		painter.setColor(properties.get<Color>('background-color'));
		painter.drawRect(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(style.button.spacing, 0);
		painter.drawText();

		context.endDraw();

		return context.isWidgetClicked();
	});
}
