import ObjectBuffer from './ObjectBuffer'

const instance = new ObjectBuffer;

// { temperature: [ 10, 0, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 10
}))

// { temperature: [ 20, 10, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 20
}))

// { temperature: [ 30, 20, 10, 0 ] }
console.log(instance.update({
	'^temperature[4]#': 30
}))

// { temperature: [ 40, 30, 20, 10 ] }
console.log(instance.update({
	'^temperature[4]#': 40
}))

// { temperature: [ 50, 40, 30, 20 ] }
console.log(instance.update({
	'^temperature[4]#': 50
}))

// { temperature: [ 10, 0, 0, 0 ] }
console.log(instance.update({
	'^temperature[4]#1': 10
}))