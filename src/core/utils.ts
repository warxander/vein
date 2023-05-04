import { TextEntryComponents } from '../common/types';

const pixelEpsilon = 0.0005;

export function addTextComponents(components: TextEntryComponents): void {
	for (const component of components) {
		switch (typeof component) {
			case 'string':
				AddTextComponentString(component);
				break;
			case 'number':
				if (Number.isInteger(component)) AddTextComponentInteger(component);
				else AddTextComponentFloat(component, 2); // TODO:
			default:
				break;
		}
	}
}

export function wait(ms: number): Promise<unknown> {
	return new Promise(function (res: TimerHandler) {
		setTimeout(res, ms);
	});
}

export function numberEquals(l: number, r: number, epsilon?: number): boolean {
	return Math.abs(l - r) < (epsilon ?? pixelEpsilon);
}
