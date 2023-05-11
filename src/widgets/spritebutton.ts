import { getCurrentContext } from '../../index';

export function declareExport(): void {
	globalThis.exports('spriteButton', function (dict: string, name: string, text: string | undefined): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);
		painter.setTextOpts();

		const spriteButtonStyle = style.spriteButton;
		const sw = spriteButtonStyle.spriteWidth;

		const w =
			context.getWidgetWidth() ||
			painter.calculateTextWidth() + style.button.spacing * 2 + spriteButtonStyle.spacing + sw;
		const h = style.widget.height;

		context.beginDraw(w, h);

		painter.setColor(context.isWidgetHovered() ? style.color.hover : style.color.widget);
		painter.drawRect(w, h);

		const sh = sw * GetAspectRatio(false);
		const so = (h - sh) / 2;

		painter.setColor(style.color.primary);

		painter.move(style.button.spacing, so);
		painter.drawSprite(dict, name, sw, sh);

		painter.move(sw + spriteButtonStyle.spacing, -so);
		painter.drawText();

		context.endDraw();

		return context.isWidgetClicked();
	});
}
