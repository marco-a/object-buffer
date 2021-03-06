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

import getBufferedProperties from './getBufferedProperties'
import iterate from './Util/iterate'
import parseProperty from './parseProperty'
import assembleMeta from './assembleMeta'
import Err from './Util/Error'
import RingBuffer from './RingBuffer'
import debug from './Util/debug'
import warn from './Util/warn'
import clone from './Util/clone'
import suggestInitialValue from './Util/suggestInitialValue'
import getType from './Util/getType'
import isPrimitive from './Util/isPrimitive'

const Default = {
	handler: {
		default(requestedBufferSize, suggestedInitialValue) {
			let Buffer = new RingBuffer(requestedBufferSize, suggestedInitialValue)

			this.update = (value) => {
				return Buffer.push(value).getAsArray()
			}

			this.get = () => {
				return Buffer.getAsArray()
			}
		}
	},

	options: {
		debug: false,

		defaultValues: {
			size: 10,
			id: `initial`,
			handler: `default`
		},

		globalDataID: false,
		maxAbsenceCount: 1,

		suggestedInitialValues: {
			deep: true,

			map: {
				string: ``,
				number: 0,
				bool: false,
				object: {},
				array: []
			}
		}
	}
}

const ObjectBuffer = function(o_handler, o_options) {
	// handle calls without new
	if (!(this instanceof ObjectBuffer)) {
		warn(`ObjectBuffer called without new!`)

		return new ObjectBuffer(o_handler, o_options)
	}

	if (getType(o_handler) !== `object`) {
		o_handler = {}
	}

	if (getType(o_options) !== `object`) {
		o_options = {}
	}

	// initialize buffered properties storage
	this.bufferedProperties    = {}
	// initialize options
	this.handler               = {
		default: Default.handler.default
	}

	this.options               = clone(Default.options)
	// initialize last global data id value
	this.lastGlobalDataIDValue = false

	if (`debug` in o_options) {
		this.options.debug = o_options.debug
	}

	if (`globalDataID` in o_options) {
		this.options.globalDataID    = o_options.globalDataID
	}

	if (`maxAbsenceCount` in o_options) {
		this.options.maxAbsenceCount = o_options.maxAbsenceCount
	}

	// -- fix me with a function
	if (`defaultValues` in o_options) {
		if (`size` in o_options.defaultValues) {
			this.options.defaultValues.size = o_options.defaultValues.size
		}

		if (`id` in o_options.defaultValues) {
			this.options.defaultValues.id = o_options.defaultValues.id
		}

		if (`handler` in o_options.defaultValues) {
			this.options.defaultValues.handler = o_options.defaultValues.handler
		}
	}

	// merge handler
	const that = this

	iterate(o_handler, function(key) {
		if (key in that.handler) {
			throw Err(`Duplicate handler '${key}'!`)
		} else {
			that.handler[key] = this[key]
		}
	})
}

ObjectBuffer.prototype.getBufferedProperties = function() {
	return this.bufferedProperties
}

const deleteBufferedProperty = (props, prop, debugEnabled) => {
	if (debugEnabled) {
		debug(`Deleting property ${prop}`)
	}

	props[prop].instance = null

	delete props[prop].instance
	delete props[prop]
}

ObjectBuffer.prototype.update = function(object) {
	let   obj                = clone(object)
	const bufferedProperties = getBufferedProperties(obj)
	const that               = this

	// global data ID specified?
	if (that.options.globalDataID !== false) {
		// does global data ID exist on `object`?
		if (!(that.options.globalDataID in obj)) {
			throw Err(`Global data ID '${that.options.globalDataID}' not found on object!`)
		}

		// get global data id value
		const globalDataIDValue = obj[that.options.globalDataID]

		if (!isPrimitive(globalDataIDValue)) {
			throw Err(`The global data ID value on '${that.options.globalDataID}' is not a primitive!`)
		}

		if (that.lastGlobalDataIDValue !== globalDataIDValue) {
			/* istanbul ignore if */
			if (that.options.debug) {
				debug(`Global data ID value mismatch <${that.lastGlobalDataIDValue} != ${globalDataIDValue}>`)
			}

			that.lastGlobalDataIDValue = globalDataIDValue

			// delete all buffered properties
			iterate(that.bufferedProperties, function (key) {
				deleteBufferedProperty(that.bufferedProperties, key, that.options.debug)
			})
		}
	}

	// paint all properties
	iterate(that.bufferedProperties, function(key) {
		this[key].present = false
	})

	iterate(bufferedProperties, function(key) {
		const bufferedProperty = this[key]

		let meta = parseProperty(bufferedProperty.key)
		meta     = assembleMeta(meta, bufferedProperty.parent, bufferedProperty.parentKeyPath)

		// fill in defaults
		if (!(`id` in meta)) {
			meta.id      = that.options.defaultValues.id
		}
		if (!(`size` in meta)) {
			meta.size    = that.options.defaultValues.size
		}
		if (!(`handler` in meta)) {
			meta.handler = that.options.defaultValues.handler
		}

		const bufferedPropertyKey = `${bufferedProperty.parentKeyPath}['${meta.prop}']`
		let needsReinit           = true
		let exists                = bufferedPropertyKey in that.bufferedProperties

		if (exists) {
			const entry = that.bufferedProperties[bufferedPropertyKey]

			if (entry.meta.id != meta.id) {
				/* istanbul ignore if */
				if (that.options.debug) {
					debug(`Data ID value mismatch <${entry.meta.id} != ${meta.id}>`)
				}
			} else if (entry.meta.size != meta.size) {
				/* istanbul ignore if */
				if (that.options.debug) {
					debug(`Size value mismatch <${entry.meta.size} != ${meta.size}>`)
				}
			} else if (entry.meta.handler != meta.handler) {
				/* istanbul ignore if */
				if (that.options.debug) {
					debug(`Handler value mismatch <${entry.meta.handler} != ${meta.handler}>`)
				}
			} else {
				needsReinit = false
			}
		}

		// check handler
		if (!(meta.handler in that.handler)) {
			throw Err(`Unable to locate handler '${meta.handler}'!`)
		}

		const valueKey    = this[key][`key`]
		const valueToPush = this[key][`parent`][valueKey]

		if (needsReinit) {
			const suggestedInitialValue = suggestInitialValue(valueToPush, that.options.suggestedInitialValues.deep, that.options.suggestedInitialValues.map)

			if (exists) {
				deleteBufferedProperty(that.bufferedProperties, bufferedPropertyKey, that.options.debug)
			}

			that.bufferedProperties[bufferedPropertyKey] = {
				meta        : meta,
				instance    : new that.handler[meta.handler](meta.size, suggestedInitialValue),
				absenceCount: 0,
				present     : true
			}
		}

		// remove property from object
		delete this[key][`parent`][valueKey]

		// and add the buffered one
		const newValue    = that.bufferedProperties[bufferedPropertyKey].instance.update(valueToPush)

		this[key][`parent`][meta.prop] = newValue

		// set present flag
		that.bufferedProperties[bufferedPropertyKey].present      = true
		// reset absence count
		that.bufferedProperties[bufferedPropertyKey].absenceCount = 0
	})

	// increase absence count for non present props
	iterate(that.bufferedProperties, function(key) {
		const entry = this[key]

		if (entry.present === true) {
			return
		}

		/* istanbul ignore if */
		if (that.options.debug) {
			debug(`${key} is not present!`)
		}

		// increase absence count
		++entry.absenceCount

		if (that.options.maxAbsenceCount !== -1) {
			if (entry.absenceCount >= that.options.maxAbsenceCount) {
				deleteBufferedProperty(that.bufferedProperties, key, that.options.debug)
			}
		}
	})

	return obj
}

ObjectBuffer.prototype.toString = function() {
	const numBufferedProperties = Object.keys(this.bufferedProperties).length

	return `[object-buffer<${numBufferedProperties}>]`
}

ObjectBuffer.RingBuffer = RingBuffer

export default ObjectBuffer