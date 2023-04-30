function addTextComponents(components) {
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

function wait(ms) {
	return new Promise(function (res) {
		setTimeout(res, ms);
	});
}
