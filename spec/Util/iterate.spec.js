import iterate from '../../src/Util/iterate'

describe(`Util.iterate`, () => {

	describe(`simple arrays`, () => {
		const dummy = [[1], [2]]

		it(`should properly assign this`, () => {
			const thisValues = []

			const callback = function() {
				thisValues.push(this)
			}

			iterate(dummy, callback)

			expect(thisValues[0]).toBe(dummy)
			expect(thisValues[1]).toBe(dummy)
		})

		it(`should properly pass the arguments`, () => {
			const callback = jasmine.createSpy(`callback`)

			iterate(dummy, callback.and.returnValue(false))

			const args = callback.calls.allArgs()

			expect(args[0]).toEqual([0, `[0]`, ``])
			expect(args[1]).toEqual([1, `[1]`, ``])
		})
	})

	describe(`simple objects`, () => {
		const dummy = {a: 1, b: 2}

		it(`should properly assign this`, () => {
			const thisValues = []

			const callback = function() {
				thisValues.push(this)
			}

			iterate(dummy, callback)

			expect(thisValues[0]).toBe(dummy)
			expect(thisValues[1]).toBe(dummy)
		})

		it(`should properly pass the arguments`, () => {
			const callback = jasmine.createSpy(`callback`)

			iterate(dummy, callback.and.returnValue(false))

			const args = callback.calls.allArgs()

			// Maybe fix this test because of property order!
			expect(args[0]).toEqual([`a`, `['a']`, ``])
			expect(args[1]).toEqual([`b`, `['b']`, ``])
		})
	})

	// nested section

	describe(`nested arrays`, () => {
		const dummy = [[1, 2, 3], [4, 5, 6]]

		it(`should properly assign this`, () => {
			const thisValues = []

			const callback = function() {
				thisValues.push(this)

				return true
			}

			iterate(dummy, callback)

			expect(thisValues[0]).toBe(dummy)
			expect(thisValues[1]).toBe(dummy[0])
			expect(thisValues[2]).toBe(dummy[0])
			expect(thisValues[3]).toBe(dummy[0])
			expect(thisValues[4]).toBe(dummy)
			expect(thisValues[5]).toBe(dummy[1])
			expect(thisValues[6]).toBe(dummy[1])
			expect(thisValues[7]).toBe(dummy[1])
		})

		it(`should properly pass the arguments`, () => {
			const callback = jasmine.createSpy(`callback`)

			iterate(dummy, callback.and.returnValue(true))

			const args = callback.calls.allArgs()

			expect(args[0]).toEqual([0, `[0]`, ``])

			expect(args[1]).toEqual([0, `[0][0]`, `[0]`])
			expect(args[2]).toEqual([1, `[0][1]`, `[0]`])
			expect(args[3]).toEqual([2, `[0][2]`, `[0]`])

			expect(args[4]).toEqual([1, `[1]`, ``])

			expect(args[5]).toEqual([0, `[1][0]`, `[1]`])
			expect(args[6]).toEqual([1, `[1][1]`, `[1]`])
			expect(args[7]).toEqual([2, `[1][2]`, `[1]`])
		})
	})

	describe(`nested objects`, () => {
		const dummy = {
			a: {
				b: {
					c: 10
				}
			},

			d: 10
		}

		it(`should properly assign this`, () => {
			const thisValues = []

			const callback = function() {
				thisValues.push(this)

				return true
			}

			iterate(dummy, callback)

			// Maybe fix me because of property order
			expect(thisValues[0]).toBe(dummy)
			expect(thisValues[1]).toBe(dummy.a)

			expect(thisValues[2]).toBe(dummy.a.b)
			expect(thisValues[3]).toBe(dummy)
		})

		it(`should properly pass the arguments`, () => {
			const callback = jasmine.createSpy(`callback`)

			iterate(dummy, callback.and.returnValue(true))

			const args = callback.calls.allArgs()

			// Maybe fix this test because of property order!
			expect(args[0]).toEqual([`a`, `['a']`, ``])
			expect(args[1]).toEqual([`b`, `['a']['b']`, `['a']`])
			expect(args[2]).toEqual([`c`, `['a']['b']['c']`, `['a']['b']`])
			expect(args[3]).toEqual([`d`, `['d']`, ``])
		})
	})

})