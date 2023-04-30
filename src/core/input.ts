export class Input {
	#state;

	static disabledControls = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	static disabledControlsInVehicle = [80, 106, 122, 135, 282, 283, 284, 285];

	constructor() {
		this.#state = {};
	}

	beginWindow() {
		for (const control of Input.disabledControls) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.disabledControlsInVehicle) DisableControlAction(0, control, true);

		SetMouseCursorActiveThisFrame();

		this.#state.mousePosX = GetControlNormal(2, 239);
		this.#state.mousePosY = GetControlNormal(2, 240);

		this.#state.isMousePressed = IsControlJustPressed(2, 237);
		this.#state.isMouseReleased = !this.#state.isMousePressed && IsControlJustReleased(2, 237);
		this.#state.isMouseDown = !this.#state.isMouseReleased && IsControlPressed(2, 237);
	}

	endWindow() {
		this.#state = {};
	}

	getMousePosX() {
		return this.#state.mousePosX;
	}

	getMousePosY() {
		return this.#state.mousePosY;
	}

	isMouseDown() {
		return this.#state.isMouseDown;
	}

	isMousePressed() {
		return this.#state.isMousePressed;
	}

	isMouseReleased() {
		return this.#state.isMouseReleased;
	}

	isRectHovered(x, y, w, h) {
		return !(
			this.#state.mousePosX < x ||
			this.#state.mousePosX > x + w ||
			this.#state.mousePosY < y ||
			this.#state.mousePosY > y + h
		);
	}
}
