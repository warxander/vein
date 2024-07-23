import { Vector2 } from './types';

export enum InputControl {
	MouseLeftButton = 237,
	MouseRightButton = 238,
	MouseScrollWheelUp = 241,
	MouseScrollWheelDown = 242
}

export class Input {
	private static readonly DISABLED_CONTROLS = [
		1, 2, 22, 24, 25, 36, 37, 44, 47, 53, 54, 68, 69, 70, 74, 81, 82, 83, 84, 85, 91, 92, 99, 100, 101, 102, 114,
		140, 141, 142, 143, 157, 158, 159, 160, 161, 162, 163, 164, 165, 257, 263
	];

	private static readonly DISABLED_CONTROLS_IN_VEHICLE = [80, 106, 122, 135, 282, 283, 284, 285];

	private static readonly controlDownPositions = new Map<InputControl, Vector2>();

	private readonly mousePosition: Vector2;

	constructor(private readonly _isDisabled: boolean) {
		if (!this._isDisabled) SetMouseCursorActiveThisFrame();

		this.mousePosition = this._isDisabled
			? new Vector2(-Infinity, -Infinity)
			: new Vector2(GetControlNormal(2, 239), GetControlNormal(2, 240));

		this.updateControlDownPosition(InputControl.MouseLeftButton);

		if (this._isDisabled) return;

		for (const control of Input.DISABLED_CONTROLS) DisableControlAction(0, control, true);

		if (IsPedInAnyVehicle(PlayerPedId(), false))
			for (const control of Input.DISABLED_CONTROLS_IN_VEHICLE) DisableControlAction(0, control, true);
	}

	isDisabled(): boolean {
		return this._isDisabled;
	}

	getMousePosition(): Vector2 {
		return this.mousePosition;
	}

	isControlPressed(control: InputControl): boolean {
		return !this._isDisabled && IsControlJustPressed(2, control);
	}

	isControlReleased(control: InputControl): boolean {
		return !this._isDisabled && IsControlJustReleased(2, control);
	}

	isControlDown(control: InputControl): boolean {
		return !this._isDisabled && IsControlPressed(2, control);
	}

	getControlDownPosition(control: InputControl): Vector2 | undefined {
		if (this._isDisabled) return undefined;
		return Input.controlDownPositions.get(control);
	}

	private updateControlDownPosition(control: InputControl) {
		if (!this.isControlDown(control)) Input.controlDownPositions.delete(control);
		else if (!Input.controlDownPositions.has(control))
			Input.controlDownPositions.set(control, this.getMousePosition());
	}
}
