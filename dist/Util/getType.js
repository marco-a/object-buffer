"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (v) {
	var type = Object.prototype.toString.call(v).split(" ")[1];

	type = type.substr(0, type.length - 1);

	type = type.toLowerCase();

	if (type === "boolean") {
		type = "bool";
	}

	return type;
};