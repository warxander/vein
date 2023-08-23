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

		w = (w ?? context.getItemWidth()) as number;
		const h = style.item.height;

		context.beginDraw(w, h);

		const sliderStyle = style.slider;

		let newValue = value;

		const isHovered = input.isRectHovered(
			painter.getX() - sliderStyle.tickMarkSize.x / 2,
			painter.getY(),
			w + sliderStyle.tickMarkSize.x,
			h
		);

		if (isHovered && (input.getIsLmbDown() || input.getIsLmbPressed()))
			newValue = Math.min(max, Math.max(min, min + ((input.getMousePos().x - painter.getX()) / w) * (max + min)));

		const sh = (h - sliderStyle.height) / 2;

		const id = context.getItemId() ?? 'slider';
		const properties = style.getProperties(context.isItemHovered() ? `${id}:hover` : id);

		painter.setColor(properties.get<Color>('background-color'));
		painter.move(0, sh);
		painter.drawRect(w, sliderStyle.height);

		const sx = (w * value) / (max + min);
		painter.setColor(properties.get<Color>('color'));
		painter.drawRect(sx, sliderStyle.height);

		painter.move(sx - sliderStyle.tickMarkSize.x / 2, (sliderStyle.height - sliderStyle.tickMarkSize.y) / 2);
		painter.drawRect(sliderStyle.tickMarkSize.x, sliderStyle.tickMarkSize.y);

		context.endDraw();

		return { isValueChanged: !numberEquals(newValue, value), value: newValue };
	});
}
