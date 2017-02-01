import ObjectBuffer from '../src/ObjectBuffer'

describe(`ObjectBuffer`, () => {
	it(`should call new if omitted`, () => {
		expect(ObjectBuffer() instanceof ObjectBuffer).toBe(true)
	})

	describe(`API`, () => {
		it(`should have a custom toString() method`, () => {
			expect(ObjectBuffer().toString()).toBe(`[object-buffer]`)
		})

		it(`should have a update() method`, () => {
			expect(`update` in (ObjectBuffer())).toBe(true)
		})

		it(`should have a getBufferedProperties() method`, () => {
			expect(`getBufferedProperties` in (ObjectBuffer())).toBe(true)
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
				'^test-1#1': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(`1`)

			OB.update({
				'^test-1#2': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(`2`)
		})

		it(`should re-init a updated buffered property on data id change (@)`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'id': 13,
				'^test-1@id': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)

			OB.update({
				'id': 14,
				'^test-1@id': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(14)
		})

		it(`should *not* re-init a updated buffered property when no data id change occurred (#/@)`, () => {
			let OB = new ObjectBuffer;

			OB.update({
				'id': 13,
				'^test-1@id': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			let entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)

			OB.update({
				'^test-1#13': 10
			})

			expect(`['test-1']` in OB.getBufferedProperties()).toBe(true)
			entry = OB.getBufferedProperties()[`['test-1']`]
			expect(entry.meta.id).toBe(13)
		})
	})
})