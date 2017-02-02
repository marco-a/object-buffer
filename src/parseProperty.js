import fetch from './Util/fetch'
import isDigit from './Util/isDigit'
import Err from './Util/Error'

const isControlChar = (char) => {
	return char in states
}

let stop = false

const fetchHandler = (char) => {
	// disallow EOI
	if (char === false) {
		return stop
	} else if (stop) {
		return false
	} else if (char === `>`) {
		stop = true
	}

	return true
}

const fetchSize = (char) => {
	// disallow EOI
	if (char === false) {
		return stop
	} else if (stop) {
		return false
	} else if (char === `]`) {
		stop = true
	} 
	// only allow digits
	else if (!isDigit(char)) {
		throw Err(`parseProperty.js: expected a digit but saw '${char}' instead!`)
	}

	return true
}

const fetchProp = (char) => {
	// allow EOI
	if (char === false) {
		return true
	} else if (isControlChar(char)) {
		// stop when we hit a control char
		return false
	}

	return true
}

const fetchDataID = (char) => {
	// allow EOI
	if (char === false) {
		return true
	} else if (isControlChar(char)) {
		// stop when we hit a control char
		return false
	}

	return true
}

const states = {
	'^': fetchProp,
	'@': fetchDataID,
	'#': fetchDataID,
	'[': fetchSize,
	'<': fetchHandler
}

const props = {
	'^': `prop`,
	'@': `id`,
	'#': `id`,
	'[': `size`,
	'<': `handler`
}

// fix me with cleaner implementation
const parseProperty = function(propName) {
	const data        = {}

	let currentBuffer = {
		buffer   : propName.substr(1),
		remainder: propName.substr(1),
		stopChar : `^`
	}

	do {
		/* istanbul ignore else */
		if (currentBuffer.stopChar in states) {
			stop = false

			const ret      = fetch(currentBuffer.remainder, states[currentBuffer.stopChar])
			const propName = props[currentBuffer.stopChar]

			/* istanbul ignore else */
			if (!(propName in data)) {
				data[propName] = currentBuffer.stopChar + ret.buffer

				if (propName == `size` || propName == `handler`) {
					data[propName] = data[propName].substr(1, data[propName].length - 2)
				}

				if (propName == `prop`) {
					data[`prop`] = data[`prop`].substr(1)
				}

				if (propName == `size`) {
					data[propName] = parseInt(data[propName], 10)
				}
			} else {
				throw Err(`Duplicate value for '${propName}'!`)
			}

			currentBuffer = ret
		} else {
			throw Err(`Unexpected character '${currentBuffer.stopChar}'!`)
		}
	} while (currentBuffer.stopChar !== false)

	return data
}

export default parseProperty