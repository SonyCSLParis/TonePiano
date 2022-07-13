import { Piano } from '../src/piano/Piano'

describe('Piano', () => {
	context('can be constructed', () => {
		it('with no arguments', () => {
			const piano = new Piano()
		})

		it('with velocity layers', () => {
			const piano = new Piano({
				velocities: 4,
			})
		})
	})


	it('inherits from Tone.js', () => {
		const piano = new Piano({
			velocities: 1,
		}).toDestination()
	})

	context('loads', () => {
		it('can load the samples', () => {
			const piano = new Piano({
				velocities: 1,
			})
			return piano.load()
		})
	})
})
