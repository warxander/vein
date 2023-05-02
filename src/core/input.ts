import { Position } from '../common/types';

class State {
	mousePos: Position;
	isLmbPressed: boolean;
	isLmbReleased: boolean;
	isLmbDown: boolean;

	constructor() {
		this.mousePos = new Position();
		this.isLmbPressed = false;
		this.isLmbReleased = false;
		this.isLmbDown = false;
	}

	reset(): void {
		this.mousePos.set(0, 0);
		this.isLmbPressed = false;
		this.isLmbReleased = false;
		this.isLmbDown = false;
	}
}

export class Input {
	#state: State;

	static readonly #disabledControls = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	static readonly #disabledControlsInVehicle = [80, 106, 122, 135, 282, 283, 284, 285];

	constructor() {
		this.#state = new State();
	}

	beginWindow(): void {
		for (const control of Input.#disabledControls) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.#disabledControlsInVehicle) DisableControlAction(0, control, true);

		SetMouseCursorActiveThisFrame();

		this.#state.mousePos.set(GetControlNormal(2, 239), GetControlNormal(2, 240));

		this.#state.isLmbPressed = IsControlJustPressed(2, 237);
		this.#state.isLmbReleased = !this.#state.isLmbPressed && IsControlJustReleased(2, 237);
		this.#state.isLmbDown = !this.#state.isLmbReleased && IsControlPressed(2, 237);
	}

	endWindow(): void {
		this.#state.reset();
	}

	getMousePos(): Position {
		return this.#state.mousePos;
	}

	getIsLmbPressed(): boolean {
		return this.#state.isLmbPressed;
	}

	getIsLmbReleased(): boolean {
		return this.#state.isLmbReleased;
	}

	getIsLmbDown(): boolean {
		return this.#state.isLmbDown;
	}

	isRectHovered(x: number, y: number, w: number, h: number): boolean {
		return !(
			this.#state.mousePos.x < x ||
			this.#state.mousePos.x > x + w ||
			this.#state.mousePos.y < y ||
			this.#state.mousePos.y > y + h
		);
	}
}
