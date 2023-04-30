import { Context } from '../core/context';

export function declareExport(context: Context) {
	const input = context.getInput();
	const painter = context.getPainter();
	const style = painter.getStyle();

	globalThis.exports('slider', function (min, value, max, w = context.getWidgetWidth()) {
		const h = style.widget.height;

		context.beginDraw(w, h);

		const sliderStyle = style.slider;

		let newValue = value;

		const isHovered = input.isRectHovered(
			painter.getX() - sliderStyle.tickMark.width / 2,
			painter.getY(),
			w + sliderStyle.tickMark.width,
			h
		);
		if (isHovered && (input.isMouseDown() || input.isMousePressed()))
			newValue = Math.min(max, Math.max(min, min + ((input.getMousePosX() - painter.getX()) / w) * (max + min)));

		const sh = (h - sliderStyle.height) / 2;

		painter.setColor(style.color.widget);
		painter.move(0, sh);
		painter.drawRect(w, sliderStyle.height);

		const sx = (w * value) / (max + min);
		const tx = sx - sliderStyle.tickMark.width / 2;
		const ty = -sliderStyle.tickMark.height / 4;

		painter.setColor(isHovered ? style.color.hover : style.color.primary);
		painter.move(tx, ty);
		painter.drawRect(sliderStyle.tickMark.width, sliderStyle.tickMark.height);

		context.endDraw();

		return { isValueChanged: newValue != value, value: newValue };
	});
}
