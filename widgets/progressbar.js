exports('progressBar', function (min, value, max, w) {
	w ??= context.getWidgetWidth()

	context.beginDraw(w, style.widget.height)

	const h = style.progressBar.height

	painter.setColor(style.color.widget)
	painter.move(0, (style.widget.height - h) / 2)
	painter.drawRect(w, h)

	if (value != min) {
		const pw = value == max ? w : ((value - min) / (max - min) * w)

		painter.setColor(style.color.progress)
		painter.drawRect(pw, h)
	}

	context.endDraw()
})
