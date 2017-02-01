import fetch from '../../src/Util/fetch'

describe(`Util.fetch`, () => {

	describe(`end of input not allowed`, () => {
		it(`should fill up the buffer until end character is reached`, () => {
			const ret = fetch(`hallo>test`, (char) => {
				return char !== `>`
			})

			expect(ret).toEqual({
				buffer   : `hallo`,
				remainder: `test`,
				stopChar : `>`
			})
		})

		it(`should throw when reached the end of the input`, () => {
			expect(() => {
				fetch(`hallo`, (char) => {
					if (char === false) {
						return false
					}
				}).toThrow(new Error(`fetch.js: unexpected end of input!`))
			})
		})
	})

	describe(`end of input allowed`, () => {
		it(`should fill up the buffer until end character is reached`, () => {
			const ret = fetch(`hallo>test`, (char) => {
				return char !== `>` || char === false
			})

			expect(ret).toEqual({
				buffer   : `hallo`,
				remainder: `test`,
				stopChar : `>`
			})
		})

		it(`should not throw when reached the end of the input`, () => {
			const ret = fetch(`hallo>test`, (char) => {
				return true
			})

			expect(ret).toEqual({
				buffer   : `hallo>test`,
				remainder: ``,
				stopChar : false
			})
		})
	})

})