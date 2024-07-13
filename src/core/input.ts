import { Vector2 } from './types';

export enum InputControl {
	MouseLeftButton = 237,
	MouseRightButton = 238,
	MouseScrollWheelUp = 241,
	MouseScrollWheelDown = 242
}

export enum InputFlags {
	None,
	DisableInput
}

export class Input {
	private mousePosition: Vector2;

	private static readonly DISABLED_CONTROLS = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	private static readonly DISABLED_CONTROLS_IN_VEHICLE = [80, 106, 122, 135, 282, 283, 284, 285];

	constructor(private inputFlags: InputFlags) {
		if (!this.isDisabled()) SetMouseCursorActiveThisFrame();

		this.mousePosition = this.isDisabled()
			? new Vector2(-Infinity, -Infinity)
			: new Vector2(GetControlNormal(2, 239), GetControlNormal(2, 240));

		if (this.isDisabled()) return;

		for (const control of Input.DISABLED_CONTROLS) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.DISABLED_CONTROLS_IN_VEHICLE) DisableControlAction(0, control, true);
	}

	getMousePosition(): Vector2 {
		return this.mousePosition;
	}

	isControlPressed(control: InputControl): boolean {
		return !this.isDisabled() && IsControlJustPressed(2, control);
	}

	isControlReleased(control: InputControl): boolean {
		return !this.isDisabled() && IsControlJustReleased(2, control);
	}

	isControlDown(control: InputControl): boolean {
		return !this.isDisabled() && IsControlPressed(2, control);
	}

	private isDisabled(): boolean {
		return !!(this.inputFlags & InputFlags.DisableInput);
	}
}
