import { Context } from "../core/context";

export function declareExport(context: Context) {
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('button', function (text) {
		painter.setText(text);
		painter.setTextOpts();

		const w = context.getWidgetWidth() || painter.calculateTextWidth() + style.button.spacing * 2;
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(context.isWidgetHovered() ? style.color.hover : style.color.widget);
		painter.drawRect(w, h);

		painter.setColor(style.color.primary);
		painter.move(style.button.spacing, 0);
		painter.drawText();

		context.endDraw();

		return context.isWidgetClicked();
	});
}
