import assembleMeta from '../src/assembleMeta'

describe(`assembleMeta`, () => {

	it(`should throw an error when no 'prop' meta property exist`, () => {
		expect(() => {
			assembleMeta({

			}, {}, ``) 
		}).toThrow(new Error(`An unknown error occurred!`))
	})

	it(`should throw an error when 'prop' already exist on the parent object`, () => {
		expect(() => {
			assembleMeta({
				prop: `test`
			}, {
				test: 10
			}, ``) 
		}).toThrow(new Error(`The property 'test' does already exist on ''!`))
	})

	it(`should throw an error when 'id' does not exist on the parent object`, () => {
		expect(() => {
			assembleMeta({
				prop: `test`,
				id: `@prop`
			}, {
			}, ``) 
		}).toThrow(new Error(`The data ID property 'prop' does not exist on ''!`))
	})

	it(`should throw an error when 'id' has not a primitive value`, () => {
		expect(() => {
			assembleMeta({
				prop: `test`,
				id: `@prop`
			}, {
				prop: []
			}, ``) 
		}).toThrow(new Error(`The data ID property 'prop' on '' is not a primitive value!`))
	})

	it(`should return the property name`, () => {
		const ret = assembleMeta({
			prop: `test`,
			id: `@prop`
		}, {
			prop: 1337
		}, ``) 
	
		expect(ret.prop).toBe(`test`)
	})

	it(`should return the correct data id`, () => {
		const ret = assembleMeta({
			prop: `test`,
			id: `@prop`
		}, {
			prop: 1337
		}, ``) 
	
		expect(ret.id).toBe(1337)
	})

	it(`should return the correct data id`, () => {
		const ret = assembleMeta({
			prop: `test`,
			id: `#test`
		}, {}, ``) 

		expect(ret.id).toBe(`test`)
	})

})