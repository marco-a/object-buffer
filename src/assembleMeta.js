import isPrimitive from './Util/isPrimitive'

export default function(meta, parent, parentKeyPath) {
	let ret = meta

	if (!(`prop` in meta)) {
		throw new Error(`An unknown error occurred!`)
	}

	// check if prop already exists on the parent object
	if (meta.prop in parent) {
		throw new Error(`The property '${meta.prop}' does already exist on '${parentKeyPath}'!`)
	}

	if (`id` in meta) {
		if (meta.id[0] === `@`) {
			const dataIDProp = meta.id.substr(1)

			if (!(dataIDProp in parent)) {
				throw new Error(`The data ID property '${dataIDProp}' does not exist on '${parentKeyPath}'!`)
			}

			const dataIDValue = parent[dataIDProp]

			if (!isPrimitive(dataIDValue)) {
				throw new Error(`The data ID property '${dataIDProp}' on '${parentKeyPath}' is not a primitive value!`)
			}

			ret.id = dataIDValue
		} else {
			ret.id = meta.id.substr(1)
		}
	}

	return ret
}