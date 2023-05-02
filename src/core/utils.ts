import { TextEntryComponents } from '../common/types';

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
