import { Vector2 } from '../exports';

export enum InputKey {
	LeftMouseButton = 237
}

export class Input {
	private mousePosition = new Vector2();

	private static readonly DISABLED_CONTROLS = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	private static readonly DISABLED_CONTROLS_IN_VEHICLE = [80, 106, 122, 135, 282, 283, 284, 285];

	beginWindow() {
		for (const control of Input.DISABLED_CONTROLS) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.DISABLED_CONTROLS_IN_VEHICLE) DisableControlAction(0, control, true);

		this.mousePosition = new Vector2(GetControlNormal(2, 239), GetControlNormal(2, 240));
	}

	getMousePosition(): Vector2 {
		return this.mousePosition;
	}

	isKeyPressed(key: InputKey): boolean {
		return IsControlJustPressed(2, key);
	}

	isKeyReleased(key: InputKey): boolean {
		return IsControlJustReleased(2, key);
	}

	isKeyDown(key: InputKey): boolean {
		return IsControlPressed(2, key);
	}
}
