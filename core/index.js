const context = new Context();
const input = context.getInput();
const painter = context.getPainter();
const style = painter.getStyle();

exports('setDebugEnabled', function (enabled) {
	context.setDebugEnabled(enabled);
});

exports('isDebugEnabled', function () {
	return context.isDebugEnabled();
});

exports('setNextWindowNoDrag', function (isNoDrag) {
	context.setNextWindowNoDrag(isNoDrag);
});

exports('beginWindow', function (windowPos) {
	context.beginWindow(windowPos);
});

exports('endWindow', function () {
	return context.endWindow();
});

exports('isWidgetHovered', function () {
	return context.isWidgetHovered();
});

exports('isWidgetClicked', function () {
	return context.isWidgetClicked();
});

exports('beginRow', function () {
	painter.beginRow();
});

exports('endRow', function () {
	painter.endRow();
});

exports('setNextTextEntry', function (entry, ...args) {
	context.setNextTextEntry(entry, ...args);
});

exports('pushTextEntry', function (entry, ...args) {
	context.pushTextEntry(entry, ...args);
});

exports('popTextEntry', function () {
	context.popTextEntry();
});

exports('setNextWidgetWidth', function (w) {
	context.setNextWidgetWidth(w);
});

exports('pushWidgetWidth', function (w) {
	context.pushWidgetWidth(w);
});

exports('popWidgetWidth', function () {
	context.popWidgetWidth();
});

exports('setDarkColorTheme', function () {
	painter.getStyle().setDarkColorTheme();
});

exports('setLightColorTheme', function () {
	painter.getStyle().setLightColorTheme();
});
