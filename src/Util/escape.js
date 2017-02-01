export default function(str) {
	return str.split(`'`).join(`\\'`)
}