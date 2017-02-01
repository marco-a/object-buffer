import getBufferedProperties from '../src/getBufferedProperties'

describe(`getBufferedProperties`, () => {

	it(`it should fetch all buffered properties on an object`, () => {
		const dummyObject = {
			system: {
				cores: [{
					'^temperature': {
						min: 10,
						avg: 20,
						max: 30
					}
				}],

				'^test': 1337
			}
		}

		const result = getBufferedProperties(dummyObject)

		expect(result.length).toBe(2)

		expect(result[0].key).toBe(`^temperature`)
		expect(result[0].parent).toBe(dummyObject.system.cores[0])
		expect(result[0].keyPath).toBe(`['system']['cores'][0]['^temperature']`)
		expect(result[0].parentKeyPath).toBe(`['system']['cores'][0]`)

		expect(result[1].key).toBe(`^test`)
		expect(result[1].parent).toBe(dummyObject.system)
		expect(result[1].keyPath).toBe(`['system']['^test']`)
		expect(result[1].parentKeyPath).toBe(`['system']`)
	})

	it(`it should ignore all properties on a buffered property`, () => {
		const dummyObject = {
			system: {
				cores: [{
					'^temperature': {
						min: 10,
						avg: 20,
						max: 30,
						'^test': 10
					}
				}]
			}
		}

		const result = getBufferedProperties(dummyObject)

		expect(result.length).toBe(1)

		expect(result[0].key).toBe(`^temperature`)
		expect(result[0].parent).toBe(dummyObject.system.cores[0])
		expect(result[0].keyPath).toBe(`['system']['cores'][0]['^temperature']`)
		expect(result[0].parentKeyPath).toBe(`['system']['cores'][0]`)
	})

})