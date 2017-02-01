import Err from '../../src/Util/Error'

describe(`Util.Error`, () => {

	it(`should return an error instance`, () => {
		expect((new Err) instanceof Error).toBe(true)
	})

	it(`should throw the right message`, () => {
		expect(() => {
			throw new Err(`test`)
		}).toThrow(new Error(`[object-buffer] test`))
	})

})