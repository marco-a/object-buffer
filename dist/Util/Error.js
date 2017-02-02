"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (msg) {
	return new Error("[object-buffer] " + msg);
};