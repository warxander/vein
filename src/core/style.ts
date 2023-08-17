import { Color } from '../common/types';

import { parse, CssRuleAST, CssTypes, CssDeclarationAST } from '@adobe/css-tools';

type StylePropertyValue = Color | number | string;
type StylePropertyValuesMap = Map<string, StylePropertyValue>;
type StyleSelectorPropertyValuesMap = Map<string, StylePropertyValues>;

class StylePropertyValues {
	#properties: StylePropertyValuesMap;
	readonly #defaultProperties: StylePropertyValuesMap | undefined;

	constructor(properties: StylePropertyValuesMap, defaultProperties?: StylePropertyValuesMap) {
		this.#properties = properties;
		this.#defaultProperties = defaultProperties;
	}

	getProperties(): StylePropertyValuesMap {
		return this.#properties;
	}

	get<T extends StylePropertyValue>(property: string): T {
		let value = this.#properties.get(property);

		if (value === undefined && this.#defaultProperties) {
			value = this.#defaultProperties.get(property);
		}

		if (value === undefined) throw new Error(`Failed to get() for style property: ${property}`);

		return value as T;
	}

	set(property: string, value: StylePropertyValue): void {
		this.#properties.set(property, value);
	}
}

const defaultStyle: string = `button, slider, sprite-button, text-edit {
	background-color: rgba(22, 25, 35, 1.0);
	color: rgba(255, 255, 240, 1.0);
}

check-box {
	background-color: rgba(34, 37, 45, 1.0);
	color: rgba(255, 255, 240, 1.0);
}

check-box:hover {
	background-color: rgba(34, 37, 45, 1.0);
	color: rgba(244, 5, 82, 1.0);
}

button:hover, sprite-button:hover {
	background-color: rgba(244, 5, 82, 1.0);
	color: rgba(255, 255, 240, 1.0);
}

heading {
	color: rgba(255, 255, 240, 1.0);
}

label, separator, text-area {
	color: rgba(181, 181, 173, 1.0);
}

progress-bar {
	background-color: rgba(22, 25, 35, 1.0);
	color: rgba(0, 155, 103, 1.0);
}

slider:hover, text-edit:hover {
	background-color: rgba(22, 25, 35, 1.0);
	color: rgba(244, 5, 82, 1.0);
}

window {
	background-color: rgba(34, 37, 45, 1.0);
	border-color: rgba(22, 25, 35, 1.0);
	color: rgba(105, 255, 89, 0.125);
}`;

const knownSelectors: Set<String> = new Set<String>([
	'button',
	'button:hover',

	'check-box',
	'check-box:hover',

	'heading',

	'label',

	'progress-bar',

	'separator',

	'slider',
	'slider:hover',

	'sprite-button',
	'sprite-button:hover',

	'text-area',

	'text-edit',
	'text-edit:hover',

	'window'
]);

const knownProperties: Set<string> = new Set<string>(['background-color', 'border-color', 'color']);

function parseValue(value: string): StylePropertyValue {
	if (value.match(/^#([0-9a-f]{6})$/i))
		return [
			parseInt(value.substring(1, 2), 16),
			parseInt(value.substring(3, 2), 16),
			parseInt(value.substring(5, 2), 16),
			255
		];

	const match = value.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/);
	if (match)
		return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), Math.round(parseFloat(match[4]) * 255)];

	throw new Error(`Failed to parseValue() for style value: ${value}`);
}

export class Style {
	static readonly #spriteColor: Color = [254, 254, 254, 255];

	static #defaultSelectorProperties: StyleSelectorPropertyValuesMap | undefined;

	#selectorProperties: StyleSelectorPropertyValuesMap | undefined;

	readonly button;
	readonly checkbox;
	readonly heading;
	readonly label;
	readonly progressBar;
	readonly separator;
	readonly slider;
	readonly spriteButton;
	readonly textArea;
	readonly textEdit;
	readonly widget;
	readonly window;

	constructor() {
		if (Style.#defaultSelectorProperties === undefined)
			Style.#defaultSelectorProperties = this.#set(defaultStyle, false);

		this.button = {
			spacing: 0.005
		};

		this.checkbox = {
			height: 0.02,
			spacing: 0.0025,
			inlineHeight: 0.002,
			outlineHeight: 0.002
		};

		this.heading = {
			height: 0.045,
			lineHeight: 0.001,
			text: {
				font: 4,
				scale: 0.725,
				offset: 0.003
			}
		};

		this.label = {
			text: {
				offset: -0.005
			}
		};

		this.progressBar = {
			height: 0.004
		};

		this.separator = {
			height: 0.001
		};

		this.slider = {
			height: 0.004,
			tickMark: {
				width: 0.012,
				height: 0.007
			}
		};

		this.spriteButton = {
			spriteWidth: 0.016,
			spacing: 0.001
		};

		this.textArea = {
			text: {
				offset: -0.005
			}
		};

		this.textEdit = {
			lineHeight: 0.002,
			symbolWidth: 0.01
		};

		this.widget = {
			height: 0.035,
			text: {
				font: 0,
				offset: -0.0035,
				scale: 0.325
			}
		};

		this.window = {
			outlineWidth: 0.0005,
			margins: {
				h: 0.01,
				v: 0.018
			},
			spacing: {
				h: 0.005,
				v: 0.01
			}
		};
	}

	getSpriteColor(): Color {
		return Style.#spriteColor;
	}

	getProperties(selector: string): StylePropertyValues {
		let selectorProperties = this.#selectorProperties?.get(selector);
		if (selectorProperties) return selectorProperties;

		selectorProperties = Style.#defaultSelectorProperties?.get(selector);
		if (selectorProperties === undefined)
			throw new Error(`Failed to getProperties() for style selector: ${selector}`);

		return selectorProperties;
	}

	getProperty<T extends StylePropertyValue>(selectorName: string, propertyName: string): T {
		return this.getProperties(selectorName).get<T>(propertyName);
	}

	set(style: string): void {
		try {
			this.#selectorProperties = this.#set(style, true);
		} catch (e: any) {
			console.log(`Failed to set style: ${e}`);
		}
	}

	reset(): void {
		this.#selectorProperties?.clear();
	}

	#set(style: string, useDefaultProperties: boolean): StyleSelectorPropertyValuesMap {
		let selectorProperties = new Map<string, StylePropertyValues>();

		const stylesheetAst = parse(style);

		for (const rule of stylesheetAst.stylesheet.rules) {
			if (rule.type != CssTypes.rule) continue;

			let properties = new Map<string, StylePropertyValue>();

			for (const declaration of (rule as CssRuleAST).declarations) {
				if (declaration.type != CssTypes.declaration) continue;

				const astDeclaration = declaration as CssDeclarationAST;
				if (!knownProperties.has(astDeclaration.property)) continue;

				properties.set(astDeclaration.property, parseValue(astDeclaration.value));
			}

			if (properties.size === 0) continue;

			for (const selector of (rule as CssRuleAST).selectors) {
				if (!knownSelectors.has(selector)) continue;

				let defaultProperties: StylePropertyValues | undefined = undefined;
				if (useDefaultProperties) {
					defaultProperties = Style.#defaultSelectorProperties?.get(selector);
					if (defaultProperties === undefined)
						throw new Error(`Failed to get default properties for style selector: ${selector}`);
				}

				let existingProperties = selectorProperties.get(selector);
				if (existingProperties === undefined)
					selectorProperties.set(
						selector,
						new StylePropertyValues(properties, defaultProperties?.getProperties())
					);
				else {
					for (const [key, value] of properties.entries()) existingProperties.set(key, value);
				}
			}
		}

		return selectorProperties;
	}
}
