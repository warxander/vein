exports('spacing', function (count = 1) {
	const isRowMode = painter.isRowMode();

	const w = isRowMode ? style.window.spacing.h * count : 0;
	const h = isRowMode ? 0 : style.window.spacing.v * count;

	context.beginDraw(w, h);

	context.endDraw();
});
