import { getCurrentContext } from '../../index';
import { numberEquals } from '../core/utils';
import { Color } from '../common/types';

interface SliderResult {
	isValueChanged: boolean;
	value: number;
}

export function declareExport() {
	globalThis.exports('slider', function (min: number, value: number, max: number, w?: number): SliderResult {
		const context = getCurrentContext();
		const input = context.getInput();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.getWidgetWidth()) as number;
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

		if (isHovered && (input.getIsLmbDown() || input.getIsLmbPressed()))
			newValue = Math.min(max, Math.max(min, min + ((input.getMousePos().x - painter.getX()) / w) * (max + min)));

		const sh = (h - sliderStyle.height) / 2;

		const properties = style.getProperties(context.isWidgetHovered() ? 'slider:hover' : 'slider');

		painter.setColor(properties.get<Color>('background-color'));
		painter.move(0, sh);
		painter.drawRect(w, sliderStyle.height);

		const sx = (w * value) / (max + min);
		const tx = sx - sliderStyle.tickMark.width / 2;
		const ty = -sliderStyle.tickMark.height / 4;

		painter.setColor(properties.get<Color>('color'));
		painter.move(tx, ty);
		painter.drawRect(sliderStyle.tickMark.width, sliderStyle.tickMark.height);

		context.endDraw();

		return { isValueChanged: !numberEquals(newValue, value), value: newValue };
	});
}
