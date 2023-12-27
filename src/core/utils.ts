import { Frame } from './frame';
import { Style } from './style';
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
		painter.setColor(backgroundColor ?? Style.SPRITE_COLOR);
		painter.drawSprite(backgroundImage[0], backgroundImage[1], w, h);
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
