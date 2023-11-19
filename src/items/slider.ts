import { Frame, getFrameChecked } from '../core/frame';
import { numberEquals } from '../core/utils';
import { Color, Rect, Vector2 } from '../core/types';
import { InputControl } from '../core/input';

export interface ISliderResponse {
	isValueChanged: boolean;
	value: number;
}

export function slider(value: number, min: number, max: number, w: number, text: string | null = null): ISliderResponse {
	const frame = getFrameChecked();

	const input = frame.getInput();
	const layout = frame.getLayout();
	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const h = style.item.height;

	frame.beginItem(w, h);

	const sliderStyle = style.slider;

	const selector = frame.buildStyleSelector('slider', frame.isItemHovered() ? 'hover' : undefined);

	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');
	const sliderText = text ?? value.toFixed(2);

	const tw = painter.getTextWidth(sliderText, font, scale);
	const sw = tw !== 0 ? w - tw - style.slider.spacing : w;

	let newValue = value;

	if (
		(input.isControlDown(InputControl.MouseLeftButton) || input.isControlPressed(InputControl.MouseLeftButton)) &&
		frame.isAreaHovered(
			new Rect(
				new Vector2(
					layout.getItemRect().position.x - sliderStyle.tickMarkSize.x / 2,
					layout.getItemRect().position.y
				),
				new Vector2(sw + sliderStyle.tickMarkSize.x, h)
			)
		)
	)
		newValue = Math.min(
			max,
			Math.max(min, min + ((input.getMousePosition().x - layout.getItemRect().position.x) / sw) * (max + min))
		);

	const sh = (h - sliderStyle.height) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.move(0, sh);
	painter.drawRect(sw, sliderStyle.height);

	if (tw !== 0) {
		const tho = sw + style.slider.spacing;
		const tvo = -sh + (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset;

		painter.move(tho, tvo);
		painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
		painter.drawText(sliderText, font, scale);
		painter.move(-tho, -tvo);
	}

	const sx = (sw * value) / (max + min);

	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	painter.drawRect(sx, sliderStyle.height);

	painter.move(sx - sliderStyle.tickMarkSize.x / 2, (sliderStyle.height - sliderStyle.tickMarkSize.y) / 2);
	painter.drawRect(sliderStyle.tickMarkSize.x, sliderStyle.tickMarkSize.y);

	frame.endItem();

	return { isValueChanged: !numberEquals(newValue, value), value: newValue };
}
