export default class Table {
	constructor(data) {
		this._data = data || {};
	}

	get ids() {
		return Object.keys(this._data);
	}

	get records() {
		return Object.values(this._data);
	}
}

const arrayMethods = Object.getOwnPropertyNames(Array).filter(n => (typeof Array[n] === 'function'));

const handler = {
	get(target, propKey, receiver) {
		// if we attempt to access as an array, use the records array
		if (propKey in arrayMethods) {
			return target.records[propKey];
		}

		return target[propKey];
	}
}
