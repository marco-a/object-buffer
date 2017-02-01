import getType from './getType'

export default function(v) {
	const type = getType(v)

	if (type === `string`) return true
	if (type === `number`) return true
	if (type === `bool`) return true

	return false
}