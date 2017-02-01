import getType from './getType'
import Err from './Error'

export default function(v) {
	const type = getType(v)

	if (type === `array`) {
		return v.slice(0)
	}

	/* istanbul ignore next */
	try {
		return JSON.parse(JSON.stringify(v))
	} catch (error) {
		throw Err(`Unable to copy variable!`)
	}
}