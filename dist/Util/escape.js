"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (str) {
	return str.split("'").join("\\'");
};