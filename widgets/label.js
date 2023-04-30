exports('label', function (text) {
	painter.setText(text);
	painter.setTextOpts();

	const w = context.getWidgetWidth() || painter.calculateTextWidth();
	const h = style.widget.height;

	context.beginDraw(w, h);

	painter.setColor(style.color.secondary);
	painter.drawText(style.label.text.offset);

	context.endDraw();
});
