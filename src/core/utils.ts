import { Frame } from './frame';
import { Color, Image, TextData } from './types';

export function createTextData(text: string, selector: string, width?: number): TextData {
	const style = Frame.getStyle();

	return new TextData(
		text,
		style.getPropertyAs<number>(selector, 'font-family'),
		style.getPropertyAs<number>(selector, 'font-size'),
		width
	);
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

export function getStyleSelectorState(frame: Frame): string | undefined {
	return frame.isItemDisabled()
		? 'disabled'
		: frame.isItemPressed()
		? 'active'
		: frame.isItemHovered()
		? 'hover'
		: undefined;
}

export function openUrl(url: string) {
	SendNUIMessage({ openUrl: { url: url } });
}
