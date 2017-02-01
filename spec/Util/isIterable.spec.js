import isIterable from '../../src/Util/isIterable'

describe(`Util.isIterable`, () => {

	it(`should return 'false' for a string`, () => {
		expect(isIterable(``)).toBe(false)
		expect(isIterable(new String)).toBe(false)
	})

	it(`should return 'false' for a number`, () => {
		expect(isIterable(1)).toBe(false)
		expect(isIterable(new Number)).toBe(false)
	})

	it(`should return 'false' for a boolean`, () => {
		expect(isIterable(true)).toBe(false)
		expect(isIterable(new Boolean)).toBe(false)
	})

	it(`should return 'true' for an array`, () => {
		expect(isIterable([])).toBe(true)
		expect(isIterable(new Array)).toBe(true)
	})

	it(`should return 'true' for an object`, () => {
		expect(isIterable({})).toBe(true)
		expect(isIterable(new Object)).toBe(true)
	})

})