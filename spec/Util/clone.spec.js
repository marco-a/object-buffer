import clone from '../../src/Util/clone'

describe(`Util.clone`, () => {

	it(`should clone 'string'`, () => {
		expect(clone(`str`)).toBe(`str`)
	})

	it(`should clone 'number'`, () => {
		expect(clone(13)).toBe(13)
	})

	it(`should clone 'bool'`, () => {
		expect(clone(true)).toBe(true)
	})

	it(`should clone 'array'`, () => {
		expect(clone([{a: 1, b: {c: 1}}, 1])).toEqual([{a: 1, b: {c: 1}}, 1])
	})

	it(`should clone 'object'`, () => {
		expect(clone({a: 1, b: {c: 1}})).toEqual({a: 1, b: {c: 1}})
	})

})