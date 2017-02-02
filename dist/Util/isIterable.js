'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (v) {
	var type = (0, _getType2.default)(v);

	if (type === 'object') return true;
	if (type === 'array') return true;

	return false;
};

var _getType = require('./getType');

var _getType2 = _interopRequireDefault(_getType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }