import { Context } from './core/context';

import * as Button from './items/button';
import * as Checkbox from './items/checkbox';
import * as Dummy from './items/dummy';
import * as Heading from './items/heading';
import * as Label from './items/label';
import * as ProgressBar from './items/progressbar';
import * as Selectable from './items/selectable';
import * as Separator from './items/separator';
import * as Slider from './items/slider';
import * as Spacing from './items/spacing';
import * as Sprite from './items/sprite';
import * as SpriteButton from './items/spritebutton';
import * as TextArea from './items/textarea';
import * as TextEdit from './items/textedit';

export const context: Context = new Context();

globalThis.exports('setDebugEnabled', function (enabled: boolean) {
	context.setDebugEnabled(enabled);
});

globalThis.exports('isDebugEnabled', function (): boolean {
	return context.isDebugEnabled();
});

globalThis.exports('setNextWindowNoDrag', function (isNoDrag: boolean) {
	context.setWindowNoDrag(isNoDrag);
});

globalThis.exports('setNextWindowNoBackground', function (isNoBackground: boolean) {
	context.setWindowNoBackground(isNoBackground);
});

globalThis.exports('setNextWindowId', function (id: string) {
	context.setWindowId(id);
});

globalThis.exports('setNextWindowSpacing', function (x: number, y: number) {
	context.setWindowSpacing(x, y);
});

globalThis.exports('beginWindow', function (x?: number, y?: number) {
	context.beginWindow(x, y);
});

globalThis.exports('endWindow', function (): any {
	const windowPos = context.endWindow();
	return { x: windowPos.x, y: windowPos.y };
});

globalThis.exports('isItemHovered', function (): boolean {
	return context.isItemHovered();
});

globalThis.exports('isItemClicked', function (): boolean {
	return context.isItemClicked();
});

globalThis.exports('setWindowSkipNextDrawing', function () {
	context.setWindowSkipNextDrawing();
});

globalThis.exports('beginRow', function () {
	context.getPainter().beginRow();
});

globalThis.exports('endRow', function () {
	context.getPainter().endRow();
});

globalThis.exports('setNextTextEntry', function (entry: string, ...components: any) {
	context.setNextTextEntry(entry, ...components);
});

globalThis.exports('pushTextEntry', function (entry: string, ...components: any) {
	context.pushTextEntry(entry, ...components);
});

globalThis.exports('popTextEntry', function () {
	context.popTextEntry();
});

globalThis.exports('setNextItemWidth', function (w: number) {
	context.setNextItemWidth(w);
});

globalThis.exports('pushItemWidth', function (w: number) {
	context.pushItemWidth(w);
});

globalThis.exports('popItemWidth', function () {
	context.popItemWidth();
});

globalThis.exports('setStyleSheet', function (styleSheet: string) {
	context.getPainter().getStyle().setSheet(styleSheet);
});

globalThis.exports('useDefaultStyle', function () {
	context.getPainter().getStyle().useDefault();
});

globalThis.exports('setNextItemId', function (id: string) {
	context.setNextItemId(id);
});

globalThis.exports('pushItemId', function (id: string) {
	context.pushItemId(id);
});

globalThis.exports('popItemId', function () {
	context.popItemId();
});

Button.registerExport();
Checkbox.registerExport();
Dummy.registerExport();
Heading.registerExport();
Label.registerExport();
ProgressBar.registerExport();
Selectable.registerExport();
Separator.registerExport();
Slider.registerExport();
Spacing.registerExport();
Sprite.registerExport();
SpriteButton.registerExport();
TextArea.registerExport();
TextEdit.registerExport();
