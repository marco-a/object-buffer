import parseProperty from '../src/parseProperty'
import Err from '../src/Util/Error'

/*
   +---------+---------+------+
   | handler | data id | size |
   +---------+---------+------+
 1 | 0       | 0       | 0    | ^prop
   +---------+---------+------+
 2 | 0       | 0       | 1    | ^prop[10]
   +---------+---------+------+
 3 | 0       | 1       | 0    | ^prop#id, ^prop@id
   +---------+---------+------+
 4 | 0       | 1       | 1    | ^prop[10]#id, ^prop[10]@id
   +---------+---------+------+
 5 | 1       | 0       | 0    | ^prop<handler>
   +---------+---------+------+
 6 | 1       | 0       | 1    | ^prop[10]<handler>
   +---------+---------+------+
 7 | 1       | 1       | 0    | ^prop<handler>#id, ^prop<handler>@id
   +---------+---------+------+
 8 | 1       | 1       | 1    | ^prop[10]<handler>#id, ^prop[10]<handler>@id
   +---------+---------+------+
 */
describe(`parseProperty`, () => {
	describe(`valid inputs`, () => {
		const parseTest = (input, expectedOutput) => {
			it(`should properly parse '${input}'`, () => {
				const output = parseProperty(input)

				expect(output).toEqual(expectedOutput)
			})
		}

		// test case 1
		parseTest(`^prop`, {
			prop: `prop`
		})

		// test case 2
		parseTest(`^prop[10]`, {
			prop: `prop`,
			size: 10
		})

		// test case 3
		parseTest(`^prop#id`, {
			prop: `prop`,
			id: `#id`
		})

		parseTest(`^prop@id`, {
			prop: `prop`,
			id: `@id`
		})

		// test case 4
		parseTest(`^prop[10]#id`, {
			prop: `prop`,
			id: `#id`,
			size: 10
		})

		parseTest(`^prop[10]@id`, {
			prop: `prop`,
			id: `@id`,
			size: 10
		})

		// test case 5
		parseTest(`^prop<handler>`, {
			prop: `prop`,
			handler: `handler`
		})

		// test case 6
		parseTest(`^prop[10]<handler>`, {
			prop: `prop`,
			handler: `handler`,
			size: 10
		})

		// test case 7
		parseTest(`^prop<handler>#id`, {
			prop: `prop`,
			id: `#id`,
			handler: `handler`
		})

		parseTest(`^prop<handler>@id`, {
			prop: `prop`,
			id: `@id`,
			handler: `handler`
		})

		// test case 8
		parseTest(`^prop[10]<handler>#id`, {
			prop: `prop`,
			id: `#id`,
			size: 10,
			handler: `handler`
		})

		parseTest(`^prop[10]<handler>@id`, {
			prop: `prop`,
			id: `@id`,
			size: 10,
			handler: `handler`
		})
	})

	describe(`invalid inputs`, () => {

/*
		it(`should throw 'unexpected input' for '^prop[1`, () => {
			expect(() => {
				parseProperty(`^prop[1`)
			}).toThrow(Err(`fetch.js: unexpected end of input!`))
		})

		it(`should throw 'unexpected char' for '^prop[1a`, () => {
			expect(() => {
				parseProperty(`^prop[1a`)
			}).toThrow(Err(`parseProperty.js: expected a digit but saw 'a' instead!`))
		})
*/

		const testThrowError = (input, error) => {
			it(`should throw \`${error}\` for '${input}'`, () => {
				expect(() => {
					parseProperty(input)
				}).toThrow(Err(error))
			})
		}

		/*
		it(`should return 'false' for ''`, () => {
			expect(parse(``)).toBe(false)
		})

		it(`should return 'false' for '^'`, () => {
			expect(parse(`^`)).toBe(false)
		})

		it(`should return 'false' for 'test'`, () => {
			expect(parse(`test`)).toBe(false)
		})*/

		testThrowError(`^prop[#`, `parseProperty.js: expected a digit but saw '#' instead!`)
		testThrowError(`^prop[10`, `fetch.js: unexpected end of input!`)
		testThrowError(`^prop[1a`, `parseProperty.js: expected a digit but saw 'a' instead!`)
		testThrowError(`^prop[10<handler>`, `parseProperty.js: expected a digit but saw '<' instead!`)
		testThrowError(`^prop[10]<handler`, `fetch.js: unexpected end of input!`)
		testThrowError(`^prop[10][10]`, `parseProperty.js: duplicate value for 'size'!`)
		testThrowError(`^prop#id#id`, `parseProperty.js: duplicate value for 'id'!`)
		testThrowError(`^prop#id@id`, `parseProperty.js: duplicate value for 'id'!`)
		testThrowError(`^prop<handler><handler>`, `parseProperty.js: duplicate value for 'handler'!`)
		testThrowError(`^prop[10]#handler<handler>[10]`, `parseProperty.js: duplicate value for 'size'!`)
		/*


		testThrowError(`^prop^prop`, Util.Errors.PROP_ALREADY_HAS_VALUE(`prop`))


		testThrowError(`^prop#handler<handler>[10]^prop`, Util.Errors.PROP_ALREADY_HAS_VALUE(`prop`))
		*/
	})
})