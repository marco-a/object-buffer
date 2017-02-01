import getBufferedProperties from './getBufferedProperties'
import iterate from './Util/iterate'
import parseProperty from './parseProperty'
import assembleMeta from './assembleMeta'

const ObjectBuffer = function(o_handler, o_options) {
	// handle calls without new
	if (!(this instanceof ObjectBuffer)) {
		return new ObjectBuffer(o_handler, o_options)
	}

	// initialize buffered properties storage
	this.bufferedProperties = {}
}

ObjectBuffer.prototype.getBufferedProperties = function() {
	return this.bufferedProperties
}

ObjectBuffer.prototype.update = function(object) {
	const bufferedProperties = getBufferedProperties(object)
	const that = this

	iterate(bufferedProperties, function(key) {
		const bufferedProperty = this[key]

		let meta = parseProperty(bufferedProperty.key)

		meta = assembleMeta(meta, bufferedProperty.parent, bufferedProperty.parentKeyPath)

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

		if (needsReinit) {

			if (exists) {
				delete that.bufferedProperties[bufferedPropertyKey]
			}

			that.bufferedProperties[bufferedPropertyKey] = {
				meta    : meta,
				instance: null
			}

		}
	})
}

ObjectBuffer.prototype.toString = function() {
	return `[object-buffer]`
}

let test = new ObjectBuffer;

test.update({
	test: {
		ud: 1,
		'^temp@ud[10]': {
			val: []
		}
	}
})

test.update({
	test: {
		'^temp#1[10]': {
			val: []
		}
	}
})

export default ObjectBuffer