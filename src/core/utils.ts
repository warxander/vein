import { Frame } from './frame';
import { Style } from './style';
import { Color, Image } from './types';

const PIXEL_EPSILON = 0.0005;

export function wait(ms: number): Promise<unknown> {
	return new Promise(function (res: TimerHandler) {
		setTimeout(res, ms);
	});
}

export function numberEquals(l: number, r: number, epsilon?: number): boolean {
	return Math.abs(l - r) < (epsilon ?? PIXEL_EPSILON);
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
