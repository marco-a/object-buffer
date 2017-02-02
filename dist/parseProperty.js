'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fetch = require('./Util/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _isDigit = require('./Util/isDigit');

var _isDigit2 = _interopRequireDefault(_isDigit);

var _Error = require('./Util/Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isControlChar = function isControlChar(char) {
	return char in states;
};

var stop = false;

var fetchHandler = function fetchHandler(char) {
	// disallow EOI
	if (char === false) {
		return stop;
	} else if (stop) {
		return false;
	} else if (char === '>') {
		stop = true;
	}

	return true;
};

var fetchSize = function fetchSize(char) {
	// disallow EOI
	if (char === false) {
		return stop;
	} else if (stop) {
		return false;
	} else if (char === ']') {
		stop = true;
	}
	// only allow digits
	else if (!(0, _isDigit2.default)(char)) {
			throw (0, _Error2.default)('parseProperty.js: expected a digit but saw \'' + char + '\' instead!');
		}

	return true;
};

var fetchProp = function fetchProp(char) {
	// allow EOI
	if (char === false) {
		return true;
	} else if (isControlChar(char)) {
		// stop when we hit a control char
		return false;
	}

	return true;
};

var fetchDataID = function fetchDataID(char) {
	// allow EOI
	if (char === false) {
		return true;
	} else if (isControlChar(char)) {
		// stop when we hit a control char
		return false;
	}

	return true;
};

var states = {
	'^': fetchProp,
	'@': fetchDataID,
	'#': fetchDataID,
	'[': fetchSize,
	'<': fetchHandler
};

var props = {
	'^': 'prop',
	'@': 'id',
	'#': 'id',
	'[': 'size',
	'<': 'handler'
};

// fix me with cleaner implementation
var parseProperty = function parseProperty(propName) {
	var data = {};

	var currentBuffer = {
		buffer: propName.substr(1),
		remainder: propName.substr(1),
		stopChar: '^'
	};

	if (propName[0] !== '^' || propName === '^') {
		return false;
	}

	do {
		/* istanbul ignore else */
		if (currentBuffer.stopChar in states) {
			stop = false;

			var ret = (0, _fetch2.default)(currentBuffer.remainder, states[currentBuffer.stopChar]);
			var _propName = props[currentBuffer.stopChar];

			/* istanbul ignore else */
			if (!(_propName in data)) {
				data[_propName] = currentBuffer.stopChar + ret.buffer;

				if (_propName == 'size' || _propName == 'handler') {
					data[_propName] = data[_propName].substr(1, data[_propName].length - 2);
				}

				if (_propName == 'prop') {
					data['prop'] = data['prop'].substr(1);
				}

				if (_propName == 'size') {
					data[_propName] = parseInt(data[_propName], 10);
				}
			} else {
				throw (0, _Error2.default)('parseProperty.js: duplicate value for \'' + _propName + '\'!');
			}

			currentBuffer = ret;
		} else {
			throw (0, _Error2.default)('parseProperty.js: unexpected character \'' + currentBuffer.stopChar + '\'!');
		}
	} while (currentBuffer.stopChar !== false);

	return data;
};

exports.default = parseProperty;