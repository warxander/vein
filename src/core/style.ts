import { Color, Image, Vector2 } from './types';
import { parse, CssRuleAST, CssTypes, CssDeclarationAST } from '@adobe/css-tools';

type StylePropertyValuesMap = Map<string, StylePropertyValue>;

export type StylePropertyValue = Color | Image | number;

export enum StylePropertyType {
	Color,
	Float,
	Image,
	Integer
}

const stylePropertyParseFuncs = new Map<StylePropertyType, Function>([
	[StylePropertyType.Color, parseValueAsColor],
	[StylePropertyType.Float, parseFloat],
	[StylePropertyType.Image, parseValueAsImage],
	[StylePropertyType.Integer, parseInt]
]);

function parseValueAsColor(value: string): Color {
	if (value.match(/^#([0-9a-f]{6})$/i))
		return [
			parseInt(value.substring(1, 3), 16),
			parseInt(value.substring(3, 5), 16),
			parseInt(value.substring(5, 7), 16),
			255
		];

	const match = value.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/);
	if (match)
		return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), Math.round(parseFloat(match[4]) * 255)];

	throw new Error(`parseValueAsColor() failed: Wrong value ${value}`);
}

function parseValueAsImage(value: string): Image {
	const match = value.match(/^url\('(\S+)',\s*'(\S+)'\)$/);
	if (match) return [match[1], match[2]];

	throw new Error(`parseValueAsImage() failed: Wrong value ${value}`);
}

function parseValue(value: string, propertyType: StylePropertyType): StylePropertyValue {
	const parseFunc = stylePropertyParseFuncs.get(propertyType);
	if (parseFunc === undefined) throw new Error(`parseValue() failed: Unsupported property type ${propertyType}`);
	return parseFunc(value);
}

export class Style {
	static readonly SPRITE_COLOR: Color = [254, 254, 254, 255];

	private static defaultSheet = LoadResourceFile('vein', 'src/style.css');

	private static propertyTypes = new Map<string, StylePropertyType>([
		['accent-color', StylePropertyType.Color],
		['background-color', StylePropertyType.Color],
		['background-image', StylePropertyType.Image],
		['border-color', StylePropertyType.Color],
		['color', StylePropertyType.Color],
		['font-family', StylePropertyType.Integer],
		['font-size', StylePropertyType.Float],
		['placeholder-color', StylePropertyType.Color]
	]);

	private selectorProperties = new Map<string, StylePropertyValuesMap>();
	private idToSelectorsMap = new Map<string, string>();

	readonly button;
	readonly checkbox;
	readonly collapsingHeader;
	readonly label;
	readonly progressBar;
	readonly selectable;
	readonly separator;
	readonly slider;
	readonly spriteButton;
	readonly textEdit;
	readonly item;
	readonly frame;

	constructor() {
		this.reset();

		this.button = {
			padding: 0.005
		};

		this.checkbox = {
			height: 0.02,
			padding: 0.0025,
			inlineHeight: 0.0035
		};

		this.collapsingHeader = {
			spriteWidth: 0.0125,
			padding: 0.001
		};

		this.label = {
			text: { offset: -0.005 }
		};

		this.progressBar = {
			height: 0.004
		};

		this.selectable = {
			padding: 0.005
		};

		this.separator = {
			height: 0.001
		};

		this.slider = {
			height: 0.002,
			thumbSize: new Vector2(0.004, 0.02),
			padding: 0.005
		};

		this.spriteButton = {
			spriteWidth: 0.016,
			padding: 0.001
		};

		this.textEdit = {
			padding: 0.002
		};

		this.item = {
			height: 0.035,
			textOffset: -0.0035
		};

		this.frame = {
			borderWidth: 0.00104,
			padding: new Vector2(0.01, 0.018),
			itemSpacing: new Vector2(0.005, 0.01)
		};
	}

	buildSelector(name: string, id: string | undefined, state: string | undefined): string {
		let selector = id !== undefined ? `${name}#${id}` : name;
		if (state !== undefined) selector = selector.concat(':', state);
		return selector;
	}

	getPropertyAs<T extends StylePropertyValue>(selector: string, property: string): T {
		const value = this.tryGetPropertyAs<T>(selector, property);
		if (value === undefined)
			throw new Error(
				`Style.getPropertyAs() failed: Unable to find property ${property} for selector ${selector}`
			);
		return value;
	}

	tryGetPropertyAs<T extends StylePropertyValue>(
		selector: string,
		property: string,
		allowId: boolean = true
	): T | undefined {
		let value: any = undefined;

		let properties = this.selectorProperties.get(selector);
		if (properties !== undefined) value = properties.get(property);

		if (properties === undefined || value === undefined) {
			const stateSeparatorIndex = selector.indexOf(':');

			if (stateSeparatorIndex !== -1) {
				properties = this.selectorProperties.get(selector.substring(0, stateSeparatorIndex));
			} else if (allowId) {
				const fromIdSelector = this.idToSelectorsMap.get(selector);
				if (fromIdSelector !== undefined) return this.tryGetPropertyAs<T>(fromIdSelector, property, false);
			}

			if (properties !== undefined) value = properties.get(property);
		}

		return value !== undefined ? (value as T) : value;
	}

	getProperty(selector: string, property: string): StylePropertyValue {
		return this.getPropertyAs<StylePropertyValue>(selector, property);
	}

	registerProperty(property: string, type: StylePropertyType) {
		if (!Style.propertyTypes.has(property)) Style.propertyTypes.set(property, type);
	}

	addSheet(sheet: string) {
		try {
			this.addSheetImpl(sheet);
		} catch (e: any) {
			console.log(`Failed to add style sheet: ${e}`);
		}
	}

	reset() {
		this.selectorProperties.clear();
		this.addSheet(Style.defaultSheet);
	}

	private addSheetImpl(sheet: string) {
		const styleSheetAst = parse(sheet);

		for (const rule of styleSheetAst.stylesheet.rules) {
			if (rule.type != CssTypes.rule) continue;

			let properties = new Map<string, StylePropertyValue>();

			for (const declaration of (rule as CssRuleAST).declarations) {
				if (declaration.type != CssTypes.declaration) continue;

				const astDeclaration = declaration as CssDeclarationAST;

				const type = Style.propertyTypes.get(astDeclaration.property);
				if (type === undefined) continue;

				properties.set(astDeclaration.property, parseValue(astDeclaration.value, type));
			}

			if (properties.size === 0) continue;

			for (let selector of (rule as CssRuleAST).selectors) {
				const idMatch = selector.match(/^(\S+)#(\S+)$/);
				if (idMatch !== null) {
					this.idToSelectorsMap.set(idMatch[2], idMatch[1]);
					selector = idMatch[2];
				}

				let selectorProperties = this.selectorProperties.get(selector);

				if (selectorProperties === undefined) {
					selectorProperties = new Map<string, StylePropertyValue>();
					this.selectorProperties.set(selector, selectorProperties);
				}

				for (const [property, value] of properties.entries()) selectorProperties.set(property, value);
			}
		}
	}
}
