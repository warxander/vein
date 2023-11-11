window.addEventListener('message', function (event) {
	const data = event.data;
	if (data.openUrl) window.invokeNative('openUrl', data.openUrl.url);
});
