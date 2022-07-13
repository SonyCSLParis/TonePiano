import { Config } from 'karma'
import { KarmaTypescriptConfig } from 'karma-typescript'

declare module 'karma' {
	interface ConfigOptions {
		karmaTypescriptConfig?: KarmaTypescriptConfig | undefined
	}
}

export default function setConfig(config: Config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'karma-typescript'],
		files: [
			'src/**/*.ts',
			'test/*.ts',
			{ pattern: 'audio/**', included: false },
			{ pattern: 'src/midi/**', included: false }
		],
		preprocessors: {
			'**/*.ts': 'karma-typescript' // *.tsx for React Jsx
		},
		karmaTypescriptConfig: {
			bundlerOptions: {
				transforms: [require('karma-typescript-es6-transform')()]
			},
			stopOnFailure: false
		},
		reporters: ['spec', 'karma-typescript'],
		browsers: ['ChromeHeadless'],
		client: {
			mocha: {
				reporter: 'html',
				timeout: 10000,
				retries: 2,
				ui: 'bdd'
			}
		}
	})
}
