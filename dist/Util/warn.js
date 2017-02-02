"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	/* istanbul ignore next */
	if ("warn" in console) {
		var _console;

		(_console = console).warn.apply(_console, ["[object-buffer] "].concat(args));
	} else {
		var _console2;

		(_console2 = console).log.apply(_console2, ["[object-buffer] WARN: "].concat(args));
	}
};