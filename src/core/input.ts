import { Vector2 } from '../exports';

class State {
	constructor(
		public mousePos = new Vector2(),
		public isLmbPressed = false,
		public isLmbReleased = false,
		public isLmbDown = false
	) {}
}

export class Input {
	private state = new State();

	private static readonly DISABLED_CONTROLS = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	private static readonly DISABLED_CONTROLS_IN_VEHICLE = [80, 106, 122, 135, 282, 283, 284, 285];

	beginWindow() {
		for (const control of Input.DISABLED_CONTROLS) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.DISABLED_CONTROLS_IN_VEHICLE) DisableControlAction(0, control, true);

		this.state = new State(
			new Vector2(GetControlNormal(2, 239), GetControlNormal(2, 240)),
			IsControlJustPressed(2, 237),
			!this.state.isLmbPressed && IsControlJustReleased(2, 237),
			!this.state.isLmbReleased && IsControlPressed(2, 237)
		);
	}

	getMousePos(): Vector2 {
		return this.state.mousePos;
	}

	getIsLmbPressed(): boolean {
		return this.state.isLmbPressed;
	}

	getIsLmbReleased(): boolean {
		return this.state.isLmbReleased;
	}

	getIsLmbDown(): boolean {
		return this.state.isLmbDown;
	}

	isRectHovered(x: number, y: number, w: number, h: number): boolean {
		return !(
			this.state.mousePos.x < x ||
			this.state.mousePos.x > x + w ||
			this.state.mousePos.y < y ||
			this.state.mousePos.y > y + h
		);
	}
}
