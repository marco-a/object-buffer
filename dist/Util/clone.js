'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (v) {
	var type = (0, _getType2.default)(v);

	if (type === 'array') {
		return v.slice(0);
	}

	/* istanbul ignore next */
	try {
		return JSON.parse(JSON.stringify(v));
	} catch (error) {
		throw (0, _Error2.default)('Unable to copy variable!');
	}
};

var _getType = require('./getType');

var _getType2 = _interopRequireDefault(_getType);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }