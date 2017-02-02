'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (input, shouldContinue) {
	var buffer = '';
	var remainder = '';
	var exitedByCallback = false;
	var stopChar = false;
	var inputLength = input.length;

	for (var i = 0; i < inputLength; ++i) {
		var char = input[i];

		if (!exitedByCallback) {
			if (shouldContinue(char)) {
				buffer += char;
			} else {
				stopChar = char;
				exitedByCallback = true;
			}
		} else {
			remainder += char;
		}
	}

	if (!exitedByCallback) {
		if (!shouldContinue(false)) {
			throw (0, _Error2.default)('fetch.js: unexpected end of input!');
		}
	}

	return {
		buffer: buffer,
		remainder: remainder,
		stopChar: stopChar
	};
};

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }