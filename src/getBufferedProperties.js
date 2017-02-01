import iterate from './Util/iterate'

export default function(target) {
	let result = []

	iterate(target, function(key, keyPath, parentKeyPath) {
		if (key[0] === `^`) {
			result.push({
				key: key,
				keyPath: keyPath,
				parent: this,
				parentKeyPath: parentKeyPath
			})

			return false
		}

		return true
	})

	return result
}