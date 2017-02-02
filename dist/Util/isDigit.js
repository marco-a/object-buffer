"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (char) {
	return digits.indexOf(char) >= 0;
};

var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];