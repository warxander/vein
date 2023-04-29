exports('separator', function (w = context.getWidgetWidth()) {
	const h = style.widget.height

	context.beginDraw(w, h)

	painter.setColor(style.color.secondary)
	painter.move(0, (style.widget.height - style.separator.height) / 2)
	painter.drawRect(w, style.separator.height)

	context.endDraw()
})
