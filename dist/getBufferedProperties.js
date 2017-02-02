'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (target) {
	var result = [];

	(0, _iterate2.default)(target, function (key, keyPath, parentKeyPath) {
		if (key[0] === '^') {
			result.push({
				key: key,
				keyPath: keyPath,
				parent: this,
				parentKeyPath: parentKeyPath
			});

			return false;
		}

		return true;
	});

	return result;
};

var _iterate = require('./Util/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }