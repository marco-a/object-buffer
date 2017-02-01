import RingBuffer from '../src/RingBuffer'
import Err from '../src/Util/Error'

describe(`RingBuffer`, () => {
	it(`should call new if omitted`, () => {
		expect(RingBuffer() instanceof RingBuffer).toBe(true)
	})

	it(`should throw an exception when size is < 0`, () => {
		expect(() => {
			RingBuffer(0)
		}).toThrow(Err(`RingBuffer.js: invalid size '0'!`))
	})

	it(`should return an array with the given size`, () => {
		const RB = new RingBuffer(3);

		expect(RB.getAsArray()).toEqual([undefined, undefined, undefined])
	})

	it(`should initialize all elements with the initial value when specified`, () => {
		const RB = new RingBuffer(3, -1);

		expect(RB.getAsArray()).toEqual([-1, -1, -1])
	})

	it(`should push the values in a circual fahsion`, () => {
		const RB = new RingBuffer(3, -1);

		expect(RB.getAsArray()).toEqual([-1, -1, -1])

		RB.push(1)

		expect(RB.getAsArray()).toEqual([1, -1, -1])

		RB.push(2)

		expect(RB.getAsArray()).toEqual([2, 1, -1])

		RB.push(3)

		expect(RB.getAsArray()).toEqual([3, 2, 1])

		RB.push(4)

		expect(RB.getAsArray()).toEqual([4, 3, 2])
	})

	it(`should return the size`, () => {
		const RB = new RingBuffer(3, -1);

		expect(RB.getSize()).toBe(3)
	})

	it(`should return the array as a reference`, () => {
		const RB = new RingBuffer(3, -1);

		RB.push(1)
		RB.push(2)

		let ref = RB.getAsArray(true)

		ref[1] = 30

		expect(RB.getAsArray()).toEqual([2, 30, -1])
	})

	it(`should have a custom toString() method`, () => {
		const RB = new RingBuffer(3, -1);

		expect(RB.toString()).toBe(`[RingBuffer<0/3>]`)

		RB.push(1)
		RB.push(2)

		expect(RB.toString()).toBe(`[RingBuffer<2/3>]`)

		RB.push(1)
		RB.push(2)

		expect(RB.toString()).toBe(`[RingBuffer<3/3>]`)

		RB.clear()

		expect(RB.toString()).toBe(`[RingBuffer<0/3>]`)
	})

	it(`should clear the buffer with the specified initial value`, () => {
		const RB = new RingBuffer(3, -1);

		expect(RB.getAsArray()).toEqual([-1, -1, -1])

		RB.push(1)

		expect(RB.getAsArray()).toEqual([1, -1, -1])

		RB.push(2)

		expect(RB.getAsArray()).toEqual([2, 1, -1])

		RB.push(3)

		expect(RB.getAsArray()).toEqual([3, 2, 1])

		RB.push(4)
		RB.clear()

		expect(RB.getAsArray()).toEqual([-1, -1, -1])
	})
})