import { Frame, getFrameChecked } from '../core/frame';
import { Color } from '../core/types';

export function textArea(text: string, w: number) {
	const frame = getFrameChecked();

	const painter = frame.getPainter();
	const style = Frame.getStyle();

	const selector = frame.buildStyleSelector('text-area');
	const font = style.getPropertyAs<number>(selector, 'font-family');
	const scale = style.getPropertyAs<number>(selector, 'font-size');

	const lc = painter.getTextLineCount(text, font, scale, w);

	const h = lc === 1 ? style.item.height : GetRenderedCharacterHeight(scale, font) * (lc + 1);

	frame.beginItem(w, h);

	painter.setColor(style.getPropertyAs<Color>(selector, 'color'));
	if (lc == 1) painter.move(0, style.item.textOffset);

	painter.drawMultilineText(text, font, scale, w);

	frame.endItem();
}
