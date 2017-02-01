import Err from './Util/Error'
import warn from './Util/warn'
import clone from './Util/clone'

const RingBuffer = function(size, initialValue) {
	if (!(this instanceof RingBuffer)) {
		warn(`RingBuffer called without new!`)

		return new RingBuffer(size, initialValue)
	}

	if (size <= 0) {
		throw Err(`RingBuffer.js: invalid size '${size}'!`)
	}

	this.array        = []
	this.size         = size
	this.initialValue = initialValue

	this.clear()
}

RingBuffer.prototype.clear = function() {
	for (let i = 0; i < this.size; ++i) {
		this.array[i] = this.initialValue
	}

	this.used = 0

	return this
}

RingBuffer.prototype.getSize = function() {
	return this.size
}

RingBuffer.prototype.getAsArray = function(asReference) {
	asReference = asReference === undefined ? false : asReference

	return (asReference ? this.array : clone(this.array))
}

RingBuffer.prototype.push = function(value) {
	if (this.used < this.size) {
		++this.used
	}

	// move array
	for (let i = this.array.length - 1; i >= 0; --i) {
		this.array[i] = this.array[i - 1]
	}

	this.array[0] = value

	return this
}

RingBuffer.prototype.toString = function() {
	return `[RingBuffer<${this.used}/${this.size}>]`
}

export default RingBuffer