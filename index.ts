import { PositionInterface, TextEntryComponents } from './src/common/types';
import { Context } from './src/core/context';

import * as Button from './src/widgets/button';
import * as Checkbox from './src/widgets/checkbox';
import * as Dummy from './src/widgets/dummy';
import * as Heading from './src/widgets/heading';
import * as Label from './src/widgets/label';
import * as ProgressBar from './src/widgets/progressbar';
import * as Separator from './src/widgets/separator';
import * as Slider from './src/widgets/slider';
import * as Spacing from './src/widgets/spacing';
import * as Sprite from './src/widgets/sprite';
import * as SpriteButton from './src/widgets/spritebutton';
import * as TextArea from './src/widgets/textarea';
import * as TextEdit from './src/widgets/textedit';

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

globalThis.exports('isWidgetHovered', function (): boolean {
	return getCurrentContext().isWidgetHovered();
});

globalThis.exports('isWidgetClicked', function (): boolean {
	return getCurrentContext().isWidgetClicked();
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

globalThis.exports('setNextWidgetWidth', function (w: number): void {
	getCurrentContext().setNextWidgetWidth(w);
});

globalThis.exports('pushWidgetWidth', function (w: number): void {
	getCurrentContext().pushWidgetWidth(w);
});

globalThis.exports('popWidgetWidth', function (): void {
	getCurrentContext().popWidgetWidth();
});

globalThis.exports('setStyle', function (style: string): void {
	getCurrentContext().getPainter().getStyle().set(style);
});

globalThis.exports('resetStyle', function (): void {
	getCurrentContext().getPainter().getStyle().reset();
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
