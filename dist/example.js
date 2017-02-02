'use strict';

var _ObjectBuffer = require('./ObjectBuffer');

var _ObjectBuffer2 = _interopRequireDefault(_ObjectBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = new _ObjectBuffer2.default();

// { temperature: [ 10, 0, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 10
}));

// { temperature: [ 20, 10, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 20
}));

// { temperature: [ 30, 20, 10, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 30
}));

// { temperature: [ 40, 30, 20, 10 ] }
console.log(instance.update({
	'^temperature[4]#': 40
}));

// { temperature: [ 50, 40, 30, 20 ] }
console.log(instance.update({
	'^temperature[4]#': 50
}));

// { temperature: [ 10, 0, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#1': 10
}));