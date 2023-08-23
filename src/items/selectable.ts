import { getCurrentContext } from '../../index';
import { Color } from '../common/types';

export function declareExport() {
	globalThis.exports('selectable', function (isSelected: boolean, text?: string): boolean {
		const context = getCurrentContext();
		const painter = context.getPainter();
		const style = painter.getStyle();

		const id = context.getItemId() ?? 'selectable';
		const selectableProperties = style.getProperties(id);
		const font = selectableProperties.get<number>('font-family');
		const scale = selectableProperties.get<number>('font-size');

		painter.setText(font, scale, text);

		const w = context.getItemWidth() ?? painter.getTextWidth() + style.selectable.spacing * 2;
		const h = style.item.height;

		context.beginDraw(w, h);

		if (context.isItemClicked()) isSelected = !isSelected;

		const isHovered = context.isItemHovered();
		const properties = isHovered ? style.getProperties(`${id}:hover`) : selectableProperties;

		painter.setColor(
			isSelected ? selectableProperties.get<Color>('accent-color') : properties.get<Color>('background-color')
		);
		painter.drawRect(w, h);

		painter.setColor(properties.get<Color>('color'));
		painter.move(
			style.selectable.spacing,
			(h - GetRenderedCharacterHeight(scale, font)) / 2 + style.item.textOffset
		);
		painter.drawText();

		context.endDraw();

		return isSelected;
	});
}
