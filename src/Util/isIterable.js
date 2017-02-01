import getType from './getType'

export default function(v) {
	const type = getType(v)

	if (type === `object`) return true
	if (type === `array`) return true

	return false
}