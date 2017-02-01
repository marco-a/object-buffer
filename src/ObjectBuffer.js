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

const Default = {
	handler: {
		default(requestedBufferSize, suggestedInitialValue) {
			let Buffer = new RingBuffer(requestedBufferSize, suggestedInitialValue)

			this.update = (value) => {
				return Buffer.push(value).getAsArray()
			}
		}
	},

	options: {
		debug: true,

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

	// initialize buffered properties storage
	this.bufferedProperties = {}
	this.handler            = Default.handler
	this.options            = Default.options
}

ObjectBuffer.prototype.getBufferedProperties = function() {
	return this.bufferedProperties
}

ObjectBuffer.prototype.update = function(object) {
	let   obj                = clone(object)
	const bufferedProperties = getBufferedProperties(obj)
	const that               = this

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
				that.bufferedProperties[bufferedPropertyKey].instance = null

				delete that.bufferedProperties[bufferedPropertyKey].instance
				delete that.bufferedProperties[bufferedPropertyKey]
			}

			that.bufferedProperties[bufferedPropertyKey] = {
				meta    : meta,
				instance: new that.handler[meta.handler](meta.size, suggestedInitialValue)
			}
		}

		// remove property from object
		delete this[key][`parent`][valueKey]

		// and add the buffered one
		const newValue    = that.bufferedProperties[bufferedPropertyKey].instance.update(valueToPush)

		this[key][`parent`][meta.prop] = newValue
	})

	return obj
}

ObjectBuffer.prototype.toString = function() {
	const numBufferedProperties = Object.keys(this.bufferedProperties).length

	return `[object-buffer<${numBufferedProperties}>]`
}

ObjectBuffer.RingBuffer = RingBuffer

let test = new ObjectBuffer;

console.log(test.update({
	test: {
		'^temp[10]': 1
	}
}))

console.log(test.update({
	test: {
		'^temp#initial[10]<default>': 2
	}
}))

export default ObjectBuffer