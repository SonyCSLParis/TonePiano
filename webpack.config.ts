import * as path from 'path'
import * as webpack from 'webpack'

const configuration: webpack.Configuration = {
	mode: 'production',
	context: __dirname,
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /(node_modules)/
			}
		]
	},
	entry: {
		Piano: './src/piano/Piano.ts'
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
		library: 'Tone',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	externals: {
		tone: 'tone'
	}
}

export default configuration
