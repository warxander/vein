import { getCurrentContext } from '../index';

export function declareExport(): void {
	globalThis.exports('checkBox', function (isChecked: boolean, text: string | undefined): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		painter.setText(text);
		painter.setTextOpts();

		const aspectRatio = GetAspectRatio(false);
		const checkboxStyle = style.checkbox;
		let cw = checkboxStyle.height / aspectRatio;

		const w = context.getWidgetWidth() ?? cw + checkboxStyle.spacing + painter.calculateTextWidth();
		const h = style.widget.height;

		context.beginDraw(w, h);

		if (context.isWidgetClicked()) isChecked = !isChecked;

		const vo = (h - checkboxStyle.height) / 2;

		painter.setColor(context.isWidgetHovered() ? style.color.hover : style.color.primary);
		painter.move(0, vo);
		painter.drawRect(cw, checkboxStyle.height);

		const outlineWidth = checkboxStyle.outlineHeight / aspectRatio;
		cw = cw - outlineWidth * 2;

		painter.setColor(style.color.window);
		painter.move(outlineWidth, checkboxStyle.outlineHeight);
		painter.drawRect(cw, cw * aspectRatio);

		const inlineWidth = checkboxStyle.inlineHeight / aspectRatio;
		cw = cw - inlineWidth * 2;

		painter.setColor(isChecked ? style.color.primary : style.color.window);
		painter.move(inlineWidth, checkboxStyle.inlineHeight);
		painter.drawRect(cw, cw * aspectRatio);
		painter.move(-inlineWidth, -checkboxStyle.inlineHeight);

		painter.move(-outlineWidth, -checkboxStyle.outlineHeight);
		painter.move(0, -vo);

		painter.setColor(style.color.primary);
		painter.move(checkboxStyle.height / aspectRatio + checkboxStyle.spacing * 2, 0);
		painter.drawText();

		context.endDraw();

		return isChecked;
	});
}
