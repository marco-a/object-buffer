/*
	MIT License
	Copyright (c) 2017 Marco
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

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