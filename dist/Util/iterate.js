'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getType = require('./getType');

var _getType2 = _interopRequireDefault(_getType);

var _isIterable = require('./isIterable');

var _isIterable2 = _interopRequireDefault(_isIterable);

var _escape = require('./escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iterate = function iterate(target, callback, parentKeyPath) {
	if (parentKeyPath === undefined) {
		parentKeyPath = '';
	}

	if ((0, _isIterable2.default)(target)) {
		var handleKeyWithValue = function handleKeyWithValue(key, keyPath) {
			var keyValue = target[key];
			var shouldIterate = callback.bind(target);

			if (shouldIterate(key, keyPath, parentKeyPath) === true) {
				iterate(keyValue, callback, keyPath);
			}
		};

		if ((0, _getType2.default)(target) === 'object') {
			for (var key in target) {
				var pathForKey = parentKeyPath + '[\'' + (0, _escape2.default)(key) + '\']';

				if (!target.hasOwnProperty(key)) continue;

				handleKeyWithValue(key, pathForKey);
			}
		} else {
			for (var _key = 0, len = target.length; _key < len; ++_key) {
				var _pathForKey = parentKeyPath + '[' + _key + ']';

				handleKeyWithValue(_key, _pathForKey);
			}
		}
	}
};

exports.default = iterate;