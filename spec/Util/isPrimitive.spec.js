import isPrimitive from '../../src/Util/isPrimitive'

describe(`Util.isPrimitive`, () => {

	it(`should return 'true' for a string`, () => {
		expect(isPrimitive(``)).toBe(true)
		expect(isPrimitive(new String)).toBe(true)
	})

	it(`should return 'true' for a number`, () => {
		expect(isPrimitive(1)).toBe(true)
		expect(isPrimitive(new Number)).toBe(true)
	})

	it(`should return 'true' for a boolean`, () => {
		expect(isPrimitive(true)).toBe(true)
		expect(isPrimitive(new Boolean)).toBe(true)
	})

	it(`should return 'false' for an array`, () => {
		expect(isPrimitive([])).toBe(false)
		expect(isPrimitive(new Array)).toBe(false)
	})

	it(`should return 'false' for an object`, () => {
		expect(isPrimitive({})).toBe(false)
		expect(isPrimitive(new Object)).toBe(false)
	})

})