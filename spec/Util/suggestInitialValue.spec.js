import suggestInitialValue from '../../src/Util/suggestInitialValue'
import clone from '../../src/Util/clone'

describe(`Util.suggestInitialValue`, () => {

	const testMap = {
		string: `default-string`,
		number: `default-number`,
		bool: `default-bool`,
		array: `default-array`,
		object: `default-object`
	}

	describe(`map = default, deep = false`, () => {
		it(`should return the correct default value for a string`, () => {
			expect(suggestInitialValue(`test`)).toBe(``)
		})

		it(`should return the correct default value for a number`, () => {
			expect(suggestInitialValue(10)).toBe(0)
		})

		it(`should return the correct default value for a bool`, () => {
			expect(suggestInitialValue(true)).toBe(false)
		})

		it(`should return the correct default value for an array`, () => {
			expect(suggestInitialValue([1])).toEqual([])
		})

		it(`should return the correct default value for an object`, () => {
			expect(suggestInitialValue({a:1})).toEqual({})
		})
	})

	describe(`map = test, deep = false`, () => {
		it(`should return the correct default value for a string`, () => {
			expect(suggestInitialValue(`test`, false, testMap)).toBe(testMap.string)
		})

		it(`should return the correct default value for a number`, () => {
			expect(suggestInitialValue(10, false, testMap)).toBe(testMap.number)
		})

		it(`should return the correct default value for a bool`, () => {
			expect(suggestInitialValue(true, false, testMap)).toBe(testMap.bool)
		})

		it(`should return the correct default value for an array`, () => {
			expect(suggestInitialValue([1], false, testMap)).toEqual(testMap.array)
		})

		it(`should return the correct default value for an object`, () => {
			expect(suggestInitialValue({a:1}, false, testMap)).toEqual(testMap.object)
		})
	})

	describe(`map = default, deep = true`, () => {
		it(`should return the correct default value for a string`, () => {
			expect(suggestInitialValue(`test`, true)).toBe(``)
		})

		it(`should return the correct default value for a number`, () => {
			expect(suggestInitialValue(10, true)).toBe(0)
		})

		it(`should return the correct default value for a bool`, () => {
			expect(suggestInitialValue(true, true)).toBe(false)
		})

		it(`should return the correct default value for an array`, () => {
			expect(suggestInitialValue([1], true)).toEqual([0])
		})

		it(`should return the correct default value for an object`, () => {
			expect(suggestInitialValue({a:1}, true)).toEqual({a:0})
		})

		it(`should return the correct default value for a nested object`, () => {
			let obj = {
				a: 10,
				b: true,
				c: ``,
				array: [{
					number: 13,
					array: []
				}]
			}

			const expected = {
				a: 0,
				b: false,
				c: ``,
				array: [{
					number: 0,
					array: []
				}]
			}

			expect(suggestInitialValue(obj, true)).toEqual(expected)
		})

		it(`should not alter the original object`, () => {
			let obj = {
				a: 10,
				b: true,
				c: ``,
				array: [{
					number: 13,
					array: []
				}]
			}

			const objCopy = clone(obj)

			suggestInitialValue(obj, true)

			expect(objCopy).toEqual(obj)
		})
	})

	describe(`map = test, deep = true`, () => {
		it(`should return the correct default value for a string`, () => {
			expect(suggestInitialValue(`test`, true, testMap)).toBe(testMap.string)
		})

		it(`should return the correct default value for a number`, () => {
			expect(suggestInitialValue(10, true, testMap)).toBe(testMap.number)
		})

		it(`should return the correct default value for a bool`, () => {
			expect(suggestInitialValue(true, true, testMap)).toBe(testMap.bool)
		})

		it(`should return the correct default value for an array`, () => {
			expect(suggestInitialValue([1], true, testMap)).toEqual([testMap.number])
		})

		it(`should return the correct default value for an object`, () => {
			expect(suggestInitialValue({a:1}, true, testMap)).toEqual({a:testMap.number})
		})

		it(`should return the correct default value for a nested object`, () => {
			let obj = {
				a: 10,
				b: true,
				c: ``,
				array: [{
					number: 13,
					array: []
				}]
			}

			const expected = {
				a: testMap.number,
				b: testMap.bool,
				c: testMap.string,
				array: [{
					number: testMap.number,
					array: []
				}]
			}

			expect(suggestInitialValue(obj, true, testMap)).toEqual(expected)
		})

		it(`should not alter the original object`, () => {
			let obj = {
				a: 10,
				b: true,
				c: ``,
				array: [{
					number: 13,
					array: []
				}]
			}

			const objCopy = clone(obj)

			suggestInitialValue(obj, true, testMap)

			expect(objCopy).toEqual(obj)
		})
	})

})