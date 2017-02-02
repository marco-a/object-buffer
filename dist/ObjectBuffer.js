'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getBufferedProperties = require('./getBufferedProperties');

var _getBufferedProperties2 = _interopRequireDefault(_getBufferedProperties);

var _iterate = require('./Util/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

var _parseProperty = require('./parseProperty');

var _parseProperty2 = _interopRequireDefault(_parseProperty);

var _assembleMeta = require('./assembleMeta');

var _assembleMeta2 = _interopRequireDefault(_assembleMeta);

var _Error = require('./Util/Error');

var _Error2 = _interopRequireDefault(_Error);

var _RingBuffer = require('./RingBuffer');

var _RingBuffer2 = _interopRequireDefault(_RingBuffer);

var _debug = require('./Util/debug');

var _debug2 = _interopRequireDefault(_debug);

var _warn = require('./Util/warn');

var _warn2 = _interopRequireDefault(_warn);

var _clone = require('./Util/clone');

var _clone2 = _interopRequireDefault(_clone);

var _suggestInitialValue = require('./Util/suggestInitialValue');

var _suggestInitialValue2 = _interopRequireDefault(_suggestInitialValue);

var _getType = require('./Util/getType');

var _getType2 = _interopRequireDefault(_getType);

var _isPrimitive = require('./Util/isPrimitive');

var _isPrimitive2 = _interopRequireDefault(_isPrimitive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Default = {
	handler: {
		default: function _default(requestedBufferSize, suggestedInitialValue) {
			var Buffer = new _RingBuffer2.default(requestedBufferSize, suggestedInitialValue);

			this.update = function (value) {
				return Buffer.push(value).getAsArray();
			};

			this.get = function () {
				return Buffer.getAsArray();
			};
		}
	},

	options: {
		debug: false,

		defaultValues: {
			size: 10,
			id: 'initial',
			handler: 'default'
		},

		globalDataID: false,
		maxAbsenceCount: 1,

		suggestedInitialValues: {
			deep: true,

			map: {
				string: '',
				number: 0,
				bool: false,
				object: {},
				array: []
			}
		}
	}
};

var ObjectBuffer = function ObjectBuffer(o_handler, o_options) {
	// handle calls without new
	if (!(this instanceof ObjectBuffer)) {
		(0, _warn2.default)('ObjectBuffer called without new!');

		return new ObjectBuffer(o_handler, o_options);
	}

	if ((0, _getType2.default)(o_handler) !== 'object') {
		o_handler = {};
	}

	if ((0, _getType2.default)(o_options) !== 'object') {
		o_options = {};
	}

	// initialize buffered properties storage
	this.bufferedProperties = {};
	// initialize options
	this.handler = {
		default: Default.handler.default
	};

	this.options = (0, _clone2.default)(Default.options);
	// initialize last global data id value
	this.lastGlobalDataIDValue = false;

	if ('debug' in o_options) {
		this.options.debug = o_options.debug;
	}

	if ('globalDataID' in o_options) {
		this.options.globalDataID = o_options.globalDataID;
	}

	if ('maxAbsenceCount' in o_options) {
		this.options.maxAbsenceCount = o_options.maxAbsenceCount;
	}

	// -- fix me with a function
	if ('defaultValues' in o_options) {
		if ('size' in o_options.defaultValues) {
			this.options.defaultValues.size = o_options.defaultValues.size;
		}

		if ('id' in o_options.defaultValues) {
			this.options.defaultValues.id = o_options.defaultValues.id;
		}

		if ('handler' in o_options.defaultValues) {
			this.options.defaultValues.handler = o_options.defaultValues.handler;
		}
	}

	// merge handler
	var that = this;

	(0, _iterate2.default)(o_handler, function (key) {
		if (key in that.handler) {
			throw (0, _Error2.default)('Duplicate handler \'' + key + '\'!');
		} else {
			that.handler[key] = this[key];
		}
	});
};

ObjectBuffer.prototype.getBufferedProperties = function () {
	return this.bufferedProperties;
};

var deleteBufferedProperty = function deleteBufferedProperty(props, prop, debugEnabled) {
	if (debugEnabled) {
		(0, _debug2.default)('Deleting property ' + prop);
	}

	props[prop].instance = null;

	delete props[prop].instance;
	delete props[prop];
};

ObjectBuffer.prototype.update = function (object) {
	var obj = (0, _clone2.default)(object);
	var bufferedProperties = (0, _getBufferedProperties2.default)(obj);
	var that = this;

	// global data ID specified?
	if (that.options.globalDataID !== false) {
		// does global data ID exist on `object`?
		if (!(that.options.globalDataID in obj)) {
			throw (0, _Error2.default)('Global data ID \'' + that.options.globalDataID + '\' not found on object!');
		}

		// get global data id value
		var globalDataIDValue = obj[that.options.globalDataID];

		if (!(0, _isPrimitive2.default)(globalDataIDValue)) {
			throw (0, _Error2.default)('The global data ID value on \'' + that.options.globalDataID + '\' is not a primitive!');
		}

		if (that.lastGlobalDataIDValue !== globalDataIDValue) {
			/* istanbul ignore if */
			if (that.options.debug) {
				(0, _debug2.default)('Global data ID value mismatch <' + that.lastGlobalDataIDValue + ' != ' + globalDataIDValue + '>');
			}

			that.lastGlobalDataIDValue = globalDataIDValue;

			// delete all buffered properties
			(0, _iterate2.default)(that.bufferedProperties, function (key) {
				deleteBufferedProperty(that.bufferedProperties, key, that.options.debug);
			});
		}
	}

	// paint all properties
	(0, _iterate2.default)(that.bufferedProperties, function (key) {
		this[key].present = false;
	});

	(0, _iterate2.default)(bufferedProperties, function (key) {
		var bufferedProperty = this[key];

		var meta = (0, _parseProperty2.default)(bufferedProperty.key);
		meta = (0, _assembleMeta2.default)(meta, bufferedProperty.parent, bufferedProperty.parentKeyPath);

		// fill in defaults
		if (!('id' in meta)) {
			meta.id = that.options.defaultValues.id;
		}
		if (!('size' in meta)) {
			meta.size = that.options.defaultValues.size;
		}
		if (!('handler' in meta)) {
			meta.handler = that.options.defaultValues.handler;
		}

		var bufferedPropertyKey = bufferedProperty.parentKeyPath + '[\'' + meta.prop + '\']';
		var needsReinit = true;
		var exists = bufferedPropertyKey in that.bufferedProperties;

		if (exists) {
			var entry = that.bufferedProperties[bufferedPropertyKey];

			if (entry.meta.id != meta.id) {
				/* istanbul ignore if */
				if (that.options.debug) {
					(0, _debug2.default)('Data ID value mismatch <' + entry.meta.id + ' != ' + meta.id + '>');
				}
			} else if (entry.meta.size != meta.size) {
				/* istanbul ignore if */
				if (that.options.debug) {
					(0, _debug2.default)('Size value mismatch <' + entry.meta.size + ' != ' + meta.size + '>');
				}
			} else if (entry.meta.handler != meta.handler) {
				/* istanbul ignore if */
				if (that.options.debug) {
					(0, _debug2.default)('Handler value mismatch <' + entry.meta.handler + ' != ' + meta.handler + '>');
				}
			} else {
				needsReinit = false;
			}
		}

		// check handler
		if (!(meta.handler in that.handler)) {
			throw (0, _Error2.default)('Unable to locate handler \'' + meta.handler + '\'!');
		}

		var valueKey = this[key]['key'];
		var valueToPush = this[key]['parent'][valueKey];

		if (needsReinit) {
			var suggestedInitialValue = (0, _suggestInitialValue2.default)(valueToPush, that.options.suggestedInitialValues.deep, that.options.suggestedInitialValues.map);

			if (exists) {
				deleteBufferedProperty(that.bufferedProperties, bufferedPropertyKey, that.options.debug);
			}

			that.bufferedProperties[bufferedPropertyKey] = {
				meta: meta,
				instance: new that.handler[meta.handler](meta.size, suggestedInitialValue),
				absenceCount: 0,
				present: true
			};
		}

		// remove property from object
		delete this[key]['parent'][valueKey];

		// and add the buffered one
		var newValue = that.bufferedProperties[bufferedPropertyKey].instance.update(valueToPush);

		this[key]['parent'][meta.prop] = newValue;

		// set present flag
		that.bufferedProperties[bufferedPropertyKey].present = true;
		// reset absence count
		that.bufferedProperties[bufferedPropertyKey].absenceCount = 0;
	});

	// increase absence count for non present props
	(0, _iterate2.default)(that.bufferedProperties, function (key) {
		var entry = this[key];

		if (entry.present === true) {
			return;
		}

		/* istanbul ignore if */
		if (that.options.debug) {
			(0, _debug2.default)(key + ' is not present!');
		}

		// increase absence count
		++entry.absenceCount;

		if (that.options.maxAbsenceCount !== -1) {
			if (entry.absenceCount >= that.options.maxAbsenceCount) {
				deleteBufferedProperty(that.bufferedProperties, key, that.options.debug);
			}
		}
	});

	return obj;
};

ObjectBuffer.prototype.toString = function () {
	var numBufferedProperties = Object.keys(this.bufferedProperties).length;

	return '[object-buffer<' + numBufferedProperties + '>]';
};

ObjectBuffer.RingBuffer = _RingBuffer2.default;

exports.default = ObjectBuffer;