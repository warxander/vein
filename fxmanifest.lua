fx_version 'cerulean'
game 'gta5'

author 'Warxander (https://github.com/warxander/vein)'
description 'FiveM GUI Library'

dependencies {
	'yarn',
	'webpack'
}

files {
	'src/nui/index.html',
	'src/nui/index.js',

	'src/style.css'
}

ui_page 'src/nui/index.html'

client_script 'dist/vein.js'

webpack_config 'webpack.config.js'
