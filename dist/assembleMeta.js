'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (meta, parent, parentKeyPath) {
	var ret = meta;

	if (!('prop' in meta)) {
		throw (0, _Error2.default)('An unknown error occurred!');
	}

	// check if prop already exists on the parent object
	if (meta.prop in parent) {
		throw (0, _Error2.default)('The property \'' + meta.prop + '\' does already exist on \'' + parentKeyPath + '\'!');
	}

	if ('id' in meta) {
		if (meta.id[0] === '@') {
			var dataIDProp = meta.id.substr(1);

			if (!(dataIDProp in parent)) {
				throw (0, _Error2.default)('The data ID property \'' + dataIDProp + '\' does not exist on \'' + parentKeyPath + '\'!');
			}

			var dataIDValue = parent[dataIDProp];

			if (!(0, _isPrimitive2.default)(dataIDValue)) {
				throw (0, _Error2.default)('The data ID property \'' + dataIDProp + '\' on \'' + parentKeyPath + '\' is not a primitive value!');
			}

			ret.id = dataIDValue;
		} else {
			ret.id = meta.id.substr(1);
		}
	}

	return ret;
};

var _isPrimitive = require('./Util/isPrimitive');

var _isPrimitive2 = _interopRequireDefault(_isPrimitive);

var _Error = require('./Util/Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }