import getType from '../../src/Util/getType'

describe(`Util.getType`, () => {

	it(`should return 'string' for a string`, () => {
		expect(getType(``)).toBe(`string`)
		expect(getType(new String)).toBe(`string`)
	})

	it(`should return 'number' for a number`, () => {
		expect(getType(1)).toBe(`number`)
		expect(getType(new Number)).toBe(`number`)
	})

	it(`should return 'bool' for a boolean`, () => {
		expect(getType(true)).toBe(`bool`)
		expect(getType(new Boolean)).toBe(`bool`)
	})

	it(`should return 'array' for an array`, () => {
		expect(getType([])).toBe(`array`)
		expect(getType(new Array)).toBe(`array`)
	})

	it(`should return 'object' for an object`, () => {
		expect(getType({})).toBe(`object`)
		expect(getType(new Object)).toBe(`object`)
	})

})