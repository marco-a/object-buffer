# ObjectBuffer ![Build status](https://api.travis-ci.org/marco-a/object-buffer.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/marco-a/object-buffer/badge.svg?branch=master)](https://coveralls.io/github/marco-a/object-buffer?branch=master)
---

## What is this?
The `ObjectBuffer` library provides an easy and flexible way to buffer properties on an Javascript object. 

## What?
Here an example: say you receive the temperature of a CPU via a WebSocket:

```js
{
	'temperature': 33
}
```

And now you want to buffer the temperature to display a chart, with minimal changes in existing code.
Instead of manually buffering / handling the property you can use `ObjectBuffer` to get the job done:

### 1.) Create an ObjectBuffer instance
```js
	let ObjectBufferInstance = new ObjectBuffer;
```

### 2.) Adjust the server response
```js
{
	'^temperature[5]': 33
}
```

### 3.) Put it through the ObjectBuffer
```js
packet = ObjectBufferInstance.update(packet)
```

`packet` will now be:

```js
{
	'temperature': [33, 0, 0, 0, 0] // <- yay, buffered data!
}
```

*done!*
---
# Installation

`$ npm install object-buffer --save`

---
# Property naming
`ObjectBuffer` only considers properties prefixed with a  `^`.

The structure is as follows:
`^{propName}[{size}]@{dataIDPropName}<handler>` 


`^{propName}[{size}]#{dataIDValue}<handler>`

* *propName* – the property name to be created.
* *size* - size of the buffer.
* optional: **dataIDPropName** - property name of the data id.
* optional: **dataIDValue** - value of the data id.
* optional: **handler**  - custom handler function.

---
# Data ID value
The data ID value is needed when you want to flush the contents of a buffer.
The `ObjectBuffer` library will clear the buffer as soon as the `dataID` value has changed.

## Example
```js
{'^temp[3]#1': 1} // {'temp': [1, 0, 0]} ; dataID value is 1
{'^temp[3]#1': 2} // {'temp': [2, 1, 0]} ; dataID value is 1
{'^temp[3]#1': 3} // {'temp': [3, 2, 1]} ; dataID value is 1
{'^temp[3]#2': 9} // {'temp': [9, 0, 0]} ; dataID value is 2 -> buffer cleared
```
It is also possible to use the value of another property:
```js
{'^temp[3]@id': 1, 'id': 1} // {'temp': [1, 0, 0]} ; dataID value is 1
{'^temp[3]@id': 2, 'id': 1} // {'temp': [2, 1, 0]} ; dataID value is 1
{'^temp[3]@id': 3, 'id': 1} // {'temp': [3, 2, 1]} ; dataID value is 1
{'^temp[3]@id': 9, 'id': 2} // {'temp': [9, 0, 0]} ; dataID value is 2 -> buffer cleared
```
---
# Handler function
It is also possible to define a custom handler which will be invoked every time the buffered property is updated:
## Example
```js
{
	'^temp[3]#id<handleTemp>': 1
}
```

```js
let ObjectBufferInstance = new ObjectBuffer({
	handleTemp(requestedSize, suggestedInitialValue) {
		let instance = new ObjectBuffer.RingBuffer(requestedSize, suggestedInitialValue)

		this.update = (value) => {
			return instance.push(value).getAsArray()
		}
	}
})
```
