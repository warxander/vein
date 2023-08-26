import { context } from '../index';
import { Color } from '../common/types';

export function registerExport() {
	globalThis.exports('label', function (text?: string) {
		const painter = context.getPainter();
		const style = painter.getStyle();

		const properties = style.getProperties(context.tryGetItemId() ?? 'label');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setTextFont(font, scale);
		if (text !== undefined) context.setNextTextEntry('STRING', text);

		const w = context.tryGetItemWidth() ?? painter.getTextWidth();
		const h = style.item.height;

		context.beginItem(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(0, (h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset);
		painter.drawText();

		context.endItem();
	});
}
