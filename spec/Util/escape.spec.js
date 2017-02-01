import escape from '../../src/Util/escape'

describe(`Util.escape`, () => {

	it(`should return an escaped string`, () => {
		expect(escape(`'hello'`)).toBe(`\\'hello\\'`)
	})

})