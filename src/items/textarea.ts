import { getCurrentContext } from '../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('textArea', function (text?: string, w?: number) {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		w = (w ?? context.tryGetItemWidth()) as number;

		const properties = style.getProperties(context.tryGetItemId() ?? 'text-area');
		const font = properties.get<number>('font-family');
		const scale = properties.get<number>('font-size');

		painter.setTextFont(font, scale);
		if (text !== undefined) context.setNextTextEntry('STRING', text);
		if (w !== undefined) painter.setTextWidth(w);

		const lc = painter.getTextLineCount();
		const h = lc === 1 ? style.item.height : GetRenderedCharacterHeight(scale, font) * (lc + 1);

		context.beginItem(w, h);

		painter.setColor(properties.get<Color>('color'));
		if (lc == 1) painter.move(0, style.item.textOffset);
		painter.drawText();

		context.endItem();
	});
}
