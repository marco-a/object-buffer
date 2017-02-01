export default function(input, shouldContinue) {
	let buffer             = ``
	let remainder          = ``
	let exitedByCallback   = false
	let stopChar           = false
	const inputLength      = input.length

	for (let i = 0; i < inputLength; ++i) {
		const char = input[i]

		if (!exitedByCallback) {
			if (shouldContinue(char)) {
				buffer += char
			} else {
				stopChar         = char
				exitedByCallback = true
			}
		} else {
			remainder += char
		}
	}

	if (!exitedByCallback) {
		if (!shouldContinue(false)) {
			throw new Error(`fetch.js: unexpected end of input!`)
		}
	}

	return {
		buffer   : buffer,
		remainder: remainder,
		stopChar : stopChar
	}
}