import { Frame } from './frame';
import { Color, Image } from './types';

export function wait(ms: number): Promise<unknown> {
	return new Promise(function (res: TimerHandler) {
		setTimeout(res, ms);
	});
}

export function drawItemBackground(frame: Frame, selector: string, w: number, h: number) {
	const style = Frame.getStyle();
	const painter = frame.getPainter();

	const backgroundImage = style.tryGetPropertyAs<Image>(selector, 'background-image');
	if (backgroundImage !== undefined) {
		const backgroundColor = style.tryGetPropertyAs<Color>(selector, 'background-color');
		painter.setColor(backgroundColor ?? [255, 255, 255, 255]);
		painter.drawSprite(...backgroundImage, w, h);
	} else {
		painter.setColor(style.getPropertyAs<Color>(selector, 'background-color'));
		painter.drawRect(w, h);
	}
}

export function getDefaultStyleSelectorState(frame: Frame): string | undefined {
	return frame.isItemDisabled()
		? 'disabled'
		: frame.isItemPressed()
		? 'active'
		: frame.isItemHovered()
		? 'hover'
		: undefined;
}
