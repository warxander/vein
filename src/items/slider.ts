import { Frame, getFrameChecked } from '../core/frame';
import { Color, Rect, Vector2 } from '../core/types';
import { InputControl } from '../core/input';
import * as Utils from '../core/utils';

/**
 * @category Items
 */
export function slider(value: number, min: number, max: number, w: number, text: string | null = null): number {
	const frame = getFrameChecked();

	const input = frame.getInput();
	const layout = frame.getLayout();
	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const h = style.item.height;

	frame.beginItem(w, h);

	const selector = frame.buildItemStyleSelector('slider', Utils.getStyleSelectorState(frame));
	const sliderTextData = Utils.createTextData(text ?? value.toFixed(2), selector);

	const sliderStyle = style.slider;

	const tw = painter.getTextWidth(sliderTextData);
	const sw = tw !== 0 ? w - tw - style.slider.padding : w;
	const frameScale = frame.getScale();

	const inputValue =
		!frame.isItemDisabled() &&
		frame.isAreaHovered(
			new Rect(
				new Vector2(
					layout.getItemRect().position.x - (sliderStyle.thumbSize.x * frameScale) / 2,
					layout.getItemRect().position.y
				),
				new Vector2((sw + sliderStyle.thumbSize.x) * frameScale, h * frameScale)
			)
		) &&
		(input.isControlDown(InputControl.MouseLeftButton) || input.isControlPressed(InputControl.MouseLeftButton))
			? Math.min(
					max,
					Math.max(
						min,
						min +
							((input.getMousePosition().x - layout.getItemRect().position.x) / (sw * frameScale)) *
								(max - min)
					)
			  )
			: value;

	const sh = (h - sliderStyle.height) / 2;

	painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
	painter.move(0, sh);
	painter.drawRect(sw, sliderStyle.height);

	if (tw !== 0) {
		const tho = sw + style.slider.padding;
		const tvo =
			-sh + (h - painter.getFontSize(sliderTextData.font, sliderTextData.scale)) / 2 + style.item.textOffset;

		painter.move(tho, tvo);
		painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
		painter.drawText(sliderTextData);
		painter.move(-tho, -tvo);
	}

	const sx = (sw * (inputValue - min)) / (max - min);

	painter.move(sx - sliderStyle.thumbSize.x / 2, (sliderStyle.height - sliderStyle.thumbSize.y) / 2);
	painter.setColor(style.getPropertyAs<Color>(selector, 'accent-color'));
	painter.drawRect(sliderStyle.thumbSize.x, sliderStyle.thumbSize.y);

	frame.endItem();

	return inputValue;
}
