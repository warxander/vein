const PIXEL_EPSILON = 0.0005;

export function wait(ms: number): Promise<unknown> {
	return new Promise(function (res: TimerHandler) {
		setTimeout(res, ms);
	});
}

export function numberEquals(l: number, r: number, epsilon?: number): boolean {
	return Math.abs(l - r) < (epsilon ?? PIXEL_EPSILON);
}
