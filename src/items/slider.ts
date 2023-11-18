import { Frame, getFrameChecked } from '../core/frame';
import { numberEquals } from '../core/utils';
import { Color, Rect, Vector2 } from '../core/types';
import { InputKey } from '../core/input';

export interface ISliderResponse {
	isValueChanged: boolean;
	value: number;
}

export function slider(value: number, min: number, max: number, w: number): ISliderResponse {
	const frame = getFrameChecked();

	const input = frame.getInput();
	const layout = frame.getLayout();
	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const h = style.item.height;

	frame.beginItem(w, h);

	const sliderStyle = style.slider;

	let newValue = value;

	if (
		(input.isKeyDown(InputKey.LeftMouseButton) || input.isKeyPressed(InputKey.LeftMouseButton)) &&
		frame.isAreaHovered(
			new Rect(
				new Vector2(
					layout.getItemRect().position.x - sliderStyle.tickMarkSize.x / 2,
					layout.getItemRect().position.y
				),
				new Vector2(w + sliderStyle.tickMarkSize.x, h)
			)
		)
	)
		newValue = Math.min(
			max,
			Math.max(min, min + ((input.getMousePosition().x - layout.getItemRect().position.x) / w) * (max + min))
		);

	const sh = (h - sliderStyle.height) / 2;

	const selector = frame.buildStyleSelector('slider', frame.isItemHovered() ? 'hover' : undefined);

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.move(0, sh);
	painter.drawRect(w, sliderStyle.height);

	const sx = (w * value) / (max + min);
	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	painter.drawRect(sx, sliderStyle.height);

	painter.move(sx - sliderStyle.tickMarkSize.x / 2, (sliderStyle.height - sliderStyle.tickMarkSize.y) / 2);
	painter.drawRect(sliderStyle.tickMarkSize.x, sliderStyle.tickMarkSize.y);

	frame.endItem();

	return { isValueChanged: !numberEquals(newValue, value), value: newValue };
}
