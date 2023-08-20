import { PositionInterface, TextEntryComponents } from './src/common/types';
import { Context } from './src/core/context';

import * as Button from './src/items/button';
import * as Checkbox from './src/items/checkbox';
import * as Dummy from './src/items/dummy';
import * as Heading from './src/items/heading';
import * as Label from './src/items/label';
import * as ProgressBar from './src/items/progressbar';
import * as Separator from './src/items/separator';
import * as Slider from './src/items/slider';
import * as Spacing from './src/items/spacing';
import * as Sprite from './src/items/sprite';
import * as SpriteButton from './src/items/spritebutton';
import * as TextArea from './src/items/textarea';
import * as TextEdit from './src/items/textedit';

let isDebugEnabled: boolean = false;

let currentContext: Context | undefined = undefined;
const globalContext: Context = new Context();

export function getCurrentContext(): Context {
	return currentContext ?? globalContext;
}

export function getIsDebugEnabled(): boolean {
	return isDebugEnabled;
}

globalThis.exports('setDebugEnabled', function (enabled: boolean): void {
	isDebugEnabled = enabled;
});

globalThis.exports('isDebugEnabled', function (): boolean {
	return getIsDebugEnabled();
});

globalThis.exports('setNextWindowNoDrag', function (isNoDrag: boolean): void {
	getCurrentContext().setWindowNoDrag(isNoDrag);
});

globalThis.exports('setNextWindowNoBackground', function (isNoBackground: boolean): void {
	getCurrentContext().setWindowNoBackground(isNoBackground);
});

globalThis.exports('beginWindow', function (x?: number, y?: number): void {
	getCurrentContext().beginWindow(x, y);
});

globalThis.exports('endWindow', function (): PositionInterface {
	return getCurrentContext().endWindow();
});

globalThis.exports('isItemHovered', function (): boolean {
	return getCurrentContext().isItemHovered();
});

globalThis.exports('isItemClicked', function (): boolean {
	return getCurrentContext().isItemClicked();
});

globalThis.exports('setWindowSkipNextDrawing', function (): void {
	getCurrentContext().setWindowSkipNextDrawing();
});

globalThis.exports('beginRow', function (): void {
	getCurrentContext().getPainter().beginRow();
});

globalThis.exports('endRow', function (): void {
	getCurrentContext().getPainter().endRow();
});

globalThis.exports('setNextTextEntry', function (entry: string, ...components: TextEntryComponents): void {
	getCurrentContext().setNextTextEntry(entry, ...components);
});

globalThis.exports('pushTextEntry', function (entry: string, ...components: TextEntryComponents): void {
	getCurrentContext().pushTextEntry(entry, ...components);
});

globalThis.exports('popTextEntry', function (): void {
	getCurrentContext().popTextEntry();
});

globalThis.exports('setNextItemWidth', function (w: number): void {
	getCurrentContext().setNextItemWidth(w);
});

globalThis.exports('pushItemWidth', function (w: number): void {
	getCurrentContext().pushItemWidth(w);
});

globalThis.exports('popItemWidth', function (): void {
	getCurrentContext().popItemWidth();
});

globalThis.exports('setStyleSheet', function (styleSheet: string): void {
	getCurrentContext().getPainter().getStyle().setSheet(styleSheet);
});

globalThis.exports('useDefaultStyle', function (): void {
	getCurrentContext().getPainter().getStyle().useDefault();
});

Button.declareExport();
Checkbox.declareExport();
Dummy.declareExport();
Heading.declareExport();
Label.declareExport();
ProgressBar.declareExport();
Separator.declareExport();
Slider.declareExport();
Spacing.declareExport();
Sprite.declareExport();
SpriteButton.declareExport();
TextArea.declareExport();
TextEdit.declareExport();
