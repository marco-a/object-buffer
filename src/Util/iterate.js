import getType from './getType'
import isIterable from './isIterable'

const iterate = function(target, callback, parentKeyPath) {
	if (parentKeyPath === undefined) {
		parentKeyPath = ``
	}

	if (isIterable(target)) {
		const handleKeyWithValue = function(key, keyPath) {
			const keyValue      = target[key]
			const shouldIterate = callback.bind(target)

			if (shouldIterate(key, keyPath, parentKeyPath) === true) {
				iterate(keyValue, callback, keyPath)
			}
		}

		if (getType(target) === `object`) {
			for (let key in target) {
				const pathForKey = `${parentKeyPath}['${key}']`

				if (!target.hasOwnProperty(key)) continue

				handleKeyWithValue(key, pathForKey)
			}
		} else {
			for (let key = 0, len = target.length; key < len; ++key) {
				const pathForKey = `${parentKeyPath}[${key}]`

				handleKeyWithValue(key, pathForKey)
			}
		}
	}
}

export default iterate