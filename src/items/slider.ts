import { Rect, Vector2, context } from '../exports';
import { numberEquals } from '../core/utils';
import { Color } from '../exports';

export interface ISliderResult {
	isValueChanged: boolean;
	value: number;
}

export function slider(min: number, value: number, max: number, w: number): ISliderResult {
	const input = context.getInput();
	const painter = context.getPainter();
	const style = painter.getStyle();

	const h = style.item.height;

	context.beginItem(w, h);

	const sliderStyle = style.slider;

	let newValue = value;

	if (
		(input.getIsLmbDown() || input.getIsLmbPressed()) &&
		new Rect(
			new Vector2(painter.getX() - sliderStyle.tickMarkSize.x / 2, painter.getY()),
			new Vector2(w + sliderStyle.tickMarkSize.x, h)
		).contains(input.getMousePos())
	)
		newValue = Math.min(max, Math.max(min, min + ((input.getMousePos().x - painter.getX()) / w) * (max + min)));

	const sh = (h - sliderStyle.height) / 2;

	const id = context.tryGetItemId() ?? 'slider';
	const properties = style.getProperties(context.isItemHovered() ? `${id}:hover` : id);

	painter.setColor(properties.get<Color>('background-color'));
	painter.move(0, sh);
	painter.drawRect(w, sliderStyle.height);

	const sx = (w * value) / (max + min);
	painter.setColor(properties.get<Color>('color'));
	painter.drawRect(sx, sliderStyle.height);

	painter.move(sx - sliderStyle.tickMarkSize.x / 2, (sliderStyle.height - sliderStyle.tickMarkSize.y) / 2);
	painter.drawRect(sliderStyle.tickMarkSize.x, sliderStyle.tickMarkSize.y);

	context.endItem();

	return { isValueChanged: !numberEquals(newValue, value), value: newValue };
}
