import getBufferedProperties from './getBufferedProperties'
import iterate from './Util/iterate'
import parseProperty from './parseProperty'
import assembleMeta from './assembleMeta'
import Err from './Util/Error'

const Default = {
	handler: {
		default(requestedBufferSize, suggestedInitialValue) {

			console.log('init buffer ', requestedBufferSize)

			this.update = (value) => {
				console.log('update ', value)

				return [1337]
			}

		}
	},

	options: {
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
	let   obj                = JSON.parse(JSON.stringify(object))
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
				console.log('data id mismatch', entry.meta.id, meta.id)
			} else if (entry.meta.size != meta.size) {
				console.log('size mismatch', entry.meta.size, meta.size)
			} else if (entry.meta.handler != meta.handler) {
				console.log('handler mismatch', entry.meta.handler, meta.handler)
			} else {
				needsReinit = false
			}
		}

		// check handler
		if (!(meta.handler in that.handler)) {
			throw Err(`Unable to locate handler '${meta.handler}'!`)
		}

		if (needsReinit) {
			if (exists) {
				that.bufferedProperties[bufferedPropertyKey].instance = null

				delete that.bufferedProperties[bufferedPropertyKey].instance
				delete that.bufferedProperties[bufferedPropertyKey]
			}

			that.bufferedProperties[bufferedPropertyKey] = {
				meta    : meta,
				instance: new that.handler[meta.handler](meta.size)
			}
		}

		const valueKey    = this[key][`key`]
		const valueToPush = this[key][`parent`][valueKey]

		// remove property from object
		delete this[key][`parent`][valueKey]

		// and add the buffered one
		const newValue    = that.bufferedProperties[bufferedPropertyKey].instance.update(valueToPush)

		this[key][`parent`][meta.prop] = newValue
	})

	return obj
}

ObjectBuffer.prototype.toString = function() {
	return `[object-buffer]`
}

let test = new ObjectBuffer;

test.update({
	test: {
		'^temp[10]': {
			val: [1]
		}
	}
})

console.log(test.update({
	test: {
		'^temp#initial[10]': {
			val: [2]
		}
	}
}))

export default ObjectBuffer