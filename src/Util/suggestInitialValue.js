import getType from './getType'
import iterate from './iterate'
import clone from './clone'

const defaultMap = {
	string: ``,
	number: 0,
	bool: false,
	object: {},
	array: [],
	fallBack: undefined
}

const suggestInitialValue = function(v, deep, map) {
	deep = deep === undefined ? false : deep

	map = map === undefined ? defaultMap : map

	const type = getType(v)

	if (type === `string`) return map.string
	if (type === `number`) return map.number
	if (type === `bool`) return map.bool

	if (!deep) {
		if (type === `array`) return map.array
		if (type === `object`) return map.object
	} else {
		let vCopy = clone(v)

		iterate(vCopy, function(key) {
			this[key] = suggestInitialValue(this[key], true, map)
		})

		return vCopy
	}

	return map.fallBack
}

export default suggestInitialValue