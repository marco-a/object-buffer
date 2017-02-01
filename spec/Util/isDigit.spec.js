import isDigit from '../../src/Util/isDigit'

describe(`Util.isDigit`, () => {

	const test = (input, expectedOutput) => {
		it(`should return '${expectedOutput}' for '${input}'`, () => {
			expect(isDigit(input)).toBe(expectedOutput)
		})
	}

	test(`0`, true)
	test(`1`, true)
	test(`2`, true)
	test(`3`, true)
	test(`4`, true)
	test(`5`, true)
	test(`6`, true)
	test(`7`, true)
	test(`8`, true)
	test(`9`, true)

	test(`0a`, false)
	test(`a0`, false)
	test(`-`, false)
	test(`x`, false)
	test(``, false)

})