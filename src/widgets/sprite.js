exports('sprite', function (dict, name, w, h) {
	context.beginDraw(w, h);

	painter.setColor(style.sprite.color);
	painter.drawSprite(dict, name, w, h);

	context.endDraw();
});
