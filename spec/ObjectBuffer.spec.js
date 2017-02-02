import ObjectBuffer from '../src/ObjectBuffer'
import Err from '../src/Util/Error'

describe(`ObjectBuffer`, () => {
	it(`should call new if omitted`, () => {
		expect(ObjectBuffer() instanceof ObjectBuffer).toBe(true)
	})

	describe(`API`, () => {
		it(`should have a custom toString() method`, () => {
			expect(ObjectBuffer().toString()).toBe(`[object-buffer<0>]`)
		})

		it(`should have a update() method`, () => {
			expect(`update` in (ObjectBuffer())).toBe(true)
		})

		it(`should have a getBufferedProperties() method`, () => {
			expect(`getBufferedProperties` in (ObjectBuffer())).toBe(true)
		})

		it(`should have a RingBuffer property`, () => {
			expect(`RingBuffer` in ObjectBuffer).toBe(true)
		})
	})

	describe(`getBufferedProperties`, () => {
		it(`should return an empty object`, () => {
			expect(ObjectBuffer().getBufferedProperties()).toEqual({})
		})

		it(`should return all buffered properties`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'^test-1': 10
			})

			OB.update({
				'^test-2': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			expect(`['test-2']` in OB.getBufferedProperties()).toBe(true)
		})
	})

	describe(`update`, () => {
		it(`should re-init a updated buffered property on data id change (#)`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'^test-1[3]#1': 1
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(`1`)
			expect(entry.instance.get()).toEqual([1, 0, 0])

			OB.update({
				'^test-1[3]#2': 2
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(`2`)
			expect(entry.instance.get()).toEqual([2, 0, 0])
		})

		it(`should re-init a updated buffered property on data id change (@)`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'id': 13,
				'^test-1[3]@id': 1
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)
			expect(entry.instance.get()).toEqual([1, 0, 0])

			OB.update({
				'id': 14,
				'^test-1[3]@id': 2
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(14)
			expect(entry.instance.get()).toEqual([2, 0, 0])
		})

		it(`should *not* re-init a updated buffered property when no data id change occurred (#/@)`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'id': 13,
				'^test-1[3]@id': 1
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)
			expect(entry.instance.get()).toEqual([1, 0, 0])

			OB.update({
				'^test-1[3]#13': 2
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)
			expect(entry.instance.get()).toEqual([2, 1, 0])
		})

		it(`should throw an exception when the data id value is not a primitive value`, () => {
			let OB = new ObjectBuffer;

			expect(() => {
				OB.update({
					test: {
						'id': [],
						'^test-1@id': 10
					}
				})
			}).toThrow(Err(`The data ID property 'id' on '['test']' is not a primitive value!`))
		})

		it(`should return a newly created object`, () => {
			let OB = new ObjectBuffer;

			let input = {
				system: {
					cores: [{
						'^temp': 10
					}]
				}
			}

			const expectedOutput = {
				system: {
					cores: [{
						temp: [10, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					}]
				}
			}

			let output = OB.update(input)

			expect(output).toEqual(expectedOutput)

			// test clone
			output.system.cores.temp = false

			expect(input.system.cores.temp).not.toBe(false)
			expect(`^temp` in input.system.cores[0]).toBe(true)
		})

		it(`throw an exception when the global data id was not found`, () => {
			let OB = new ObjectBuffer({}, {
				globalDataID: `testID`
			})

			expect(() => {
				OB.update({

				})
			}).toThrow(Err(`Global data ID 'testID' not found on object!`))
		})

		it(`throw an exception when the global data id value is not a primitive`, () => {
			let OB = new ObjectBuffer({}, {
				globalDataID: `testID`
			})

			expect(() => {
				OB.update({
					testID: {}
				})
			}).toThrow(Err(`The global data ID value on 'testID' is not a primitive!`))
		})

		it(`should delete all properties on global data id change`, () => {
			let OB = new ObjectBuffer({}, {
				globalDataID: `dataID`
			});

			OB.update({
				dataID: 0,

				test: {
					'^test-1[3]': 10
				}
			})

			expect(OB.getBufferedProperties()[`['test']['test-1']`].instance.get()).toEqual([10, 0, 0])

			OB.update({
				dataID: 0,

				test: {
					'^test-1[3]': 20
				}
			})

			expect(OB.getBufferedProperties()[`['test']['test-1']`].instance.get()).toEqual([20, 10, 0])

			OB.update({
				dataID: 1,

				test: {
					'^test-1[3]': 33
				}
			})

			expect(OB.getBufferedProperties()[`['test']['test-1']`].instance.get()).toEqual([33, 0, 0])
		})

		it(`should use the specified default values`, () => {
			let OB = new ObjectBuffer({}, {
				defaultValues: {
					id: `test`,
					handler: `_test`,
					size: `test-size`
				}
			});

			OB.update({
				test: {
					'^test-1': 10
				}
			})

			let entry = OB.getBufferedProperties()[`['test']['test-1']`]

			expect(entry.instance.get()).toBe(`test-get`)
			expect(entry.instance.update(1)).toBe(`test-update`)

			expect(entry.meta.id).toBe(`test`)
			expect(entry.meta.size).toBe(`test-size`)
			expect(entry.meta.handler).toBe(`_test`)
		})
	})
})