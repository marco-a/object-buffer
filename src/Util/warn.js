export default function(...args) {
	if (`warn` in console) {
		console.warn(`[object-buffer] `, ...args)
	} else {
		console.log(`[object-buffer] WARN: `, ...args)
	}
}