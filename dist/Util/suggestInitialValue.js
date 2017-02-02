'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getType = require('./getType');

var _getType2 = _interopRequireDefault(_getType);

var _iterate = require('./iterate');

var _iterate2 = _interopRequireDefault(_iterate);

var _clone = require('./clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultMap = {
	string: '',
	number: 0,
	bool: false,
	object: {},
	array: [],
	fallBack: undefined
};

var suggestInitialValue = function suggestInitialValue(v, deep, map) {
	deep = deep === undefined ? false : deep;

	map = map === undefined ? defaultMap : map;

	var type = (0, _getType2.default)(v);

	if (type === 'string') return map.string;
	if (type === 'number') return map.number;
	if (type === 'bool') return map.bool;

	if (!deep) {
		if (type === 'array') return map.array;
		if (type === 'object') return map.object;
	} else {
		var vCopy = (0, _clone2.default)(v);

		(0, _iterate2.default)(vCopy, function (key) {
			this[key] = suggestInitialValue(this[key], true, map);
		});

		return vCopy;
	}

	/* istanbul ignore next */
	return map.fallBack;
};

exports.default = suggestInitialValue;