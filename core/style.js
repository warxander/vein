function createDarkColorTheme() {
	return {
		debug: [105, 255, 89, 32],
		default: [0, 0, 0, 255],
		hover: [244, 5, 82, 255],
		primary: [255, 255, 240, 255],
		progress: [0, 155, 103, 255],
		secondary: [181, 181, 173, 255],
		widget: [22, 25, 35, 255],
		window: [34, 37, 45, 255]
	};
}

function createLightColorTheme() {
	return {
		debug: [85, 235, 69, 48],
		default: [0, 0, 0, 255],
		hover: [244, 5, 82, 255],
		primary: [22, 25, 35, 255],
		progress: [0, 155, 103, 255],
		secondary: [135, 137, 136, 255],
		widget: [248, 248, 236, 255],
		window: [230, 230, 223, 255]
	};
}

class Style {
	constructor() {
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

		this.sprite = {
			color: [254, 254, 254, 255]
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

		this.setDarkColorTheme();
	}

	setDarkColorTheme() {
		this.color = createDarkColorTheme();
	}

	setLightColorTheme() {
		this.color = createLightColorTheme();
	}
}
