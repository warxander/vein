import { Context } from './core/context';
import * as Button from './widgets/button';
import * as Checkbox from './widgets/checkbox';
import * as Dummy from './widgets/dummy';
import * as Heading from './widgets/heading';
import * as Label from './widgets/label';
import * as ProgressBar from './widgets/progressbar';
import * as Separator from './widgets/separator';
import * as Slider from './widgets/slider';
import * as Spacing from './widgets/spacing';
import * as Sprite from './widgets/sprite';
import * as SpriteButton from './widgets/spritebutton';
import * as TextArea from './widgets/textarea';
import * as TextEdit from './widgets/textedit';

const context = new Context();
const painter = context.getPainter();

globalThis.exports('setDebugEnabled', function (enabled) {
	context.setDebugEnabled(enabled);
});

globalThis.exports('isDebugEnabled', function () {
	return context.isDebugEnabled();
});

globalThis.exports('setNextWindowNoDrag', function (isNoDrag) {
	context.setNextWindowNoDrag(isNoDrag);
});

globalThis.exports('beginWindow', function (windowPos) {
	context.beginWindow(windowPos);
});

globalThis.exports('endWindow', function () {
	return context.endWindow();
});

globalThis.exports('isWidgetHovered', function () {
	return context.isWidgetHovered();
});

globalThis.exports('isWidgetClicked', function () {
	return context.isWidgetClicked();
});

globalThis.exports('beginRow', function () {
	painter.beginRow();
});

globalThis.exports('endRow', function () {
	painter.endRow();
});

globalThis.exports('setNextTextEntry', function (entry, ...args) {
	context.setNextTextEntry(entry, ...args);
});

globalThis.exports('pushTextEntry', function (entry, ...args) {
	context.pushTextEntry(entry, ...args);
});

globalThis.exports('popTextEntry', function () {
	context.popTextEntry();
});

globalThis.exports('setNextWidgetWidth', function (w) {
	context.setNextWidgetWidth(w);
});

globalThis.exports('pushWidgetWidth', function (w) {
	context.pushWidgetWidth(w);
});

globalThis.exports('popWidgetWidth', function () {
	context.popWidgetWidth();
});

globalThis.exports('setDarkColorTheme', function () {
	painter.getStyle().setDarkColorTheme();
});

globalThis.exports('setLightColorTheme', function () {
	painter.getStyle().setLightColorTheme();
});

Button.declareExport(context);
Checkbox.declareExport(context);
Dummy.declareExport(context);
Heading.declareExport(context);
Label.declareExport(context);
ProgressBar.declareExport(context);
Separator.declareExport(context);
Slider.declareExport(context);
Spacing.declareExport(context);
Sprite.declareExport(context);
SpriteButton.declareExport(context);
TextArea.declareExport(context);
TextEdit.declareExport(context);
