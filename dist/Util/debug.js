"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var _console;

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	/* istanbul ignore next */
	(_console = console).log.apply(_console, ["[object-buffer] DEBUG: "].concat(args));
};