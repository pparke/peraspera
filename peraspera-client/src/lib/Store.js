import React from 'react';
import merge from 'deepmerge';
import clone from 'clone';
import config from '../../config.js';
const singleton = Symbol();
const enforcer = Symbol();

/**
* Creates a singleton that acts as the interface and container of
* a Map.  Defines a few custom methods for working with the map
* and proxies the existing methods of the Map object.
*/
export class Store {

	/**
	 * Prevent multiple instantiation
	 * @param  {[type]} enf [description]
	 * @return {[type]}     [description]
	 */
	constructor(enf) {
		if (enf !== enforcer) {
			throw new Error('Cannot instantiate more than one store.');
		}
		// local state or session data specific to this instance
		this._state = {};
		// raw data provided by the api
		this._data = {};
		// application defined views into the api data (think sql views)
		this._views = {};
		// application defined models that determine how
		this._models = {};

		this.subscribers = new Set();
	}

	/**
	 * Return the singleton store instance
	 * @type {[type]}
	 */
	static get instance() {
		// if a store instance doesn't exist, create one
		if (!this[singleton]) {
			this[singleton] = new Store(enforcer);
		}
		return this[singleton];
	}

	/**
	 * Initialize the store state and data
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	initialize(state = {}, data = {}) {
		this._state = clone(state);
		this._data = clone(data);
	}

	/**
	 * Return the store state
	 * @return {[type]} [description]
	 */
	get state() {
		return this._state;
	}

	setState(partial) {
		this._state = merge(this._state, partial);
		console.log('state is now', this._state);
		this.publish();
	}

	peekRecord(name, id) {
		const records = this._data[name];
		if (!records) return {};
		return this._data[name].entities[id] || {};
	}

	peekRecords(name, ids = []) {
		const records = [];
		for (id of ids) {
			records.push(this.peekRecord(name, id));
		}
		return records;
	}

	peekAll(name) {
		const records = this._data[name];
		if (!records) return [];
		return Object.values(records.entities);
	}

	/**
	 * Find a record by id, update state and notify all subscribers
	 * @param  {[type]}  name [description]
	 * @param  {[type]}  id   [description]
	 * @return {Promise}      [description]
	 */
	async findRecord(name, id) {
		const response = await fetch(`${config.api.url}/${name}/${id}`, { method: 'GET' });
		this.checkContentType(response);
		const json = await response.json();
		const record = json[name];
		this.addRecord(name, record);
		this.publish();
		return record;
	}

	/**
	 * Lookup multiple records by id
	 * @param  {[type]}  name [description]
	 * @param  {[type]}  ids  [description]
	 * @return {Promise}      [description]
	 */
	async findRecords(name, ids) {
		const params = ids.map(id => `id=${id}`).join('&');
		const response = await fetch(`${config.api.url}/${name}?${params}`, { method: 'GET' });
		this.checkContentType(response);
		const json = await response.json();
		const records = json[name];
		for (record of records) {
			this.addRecord(name, record);
		}
		this.publish();
		return records;
	}

	/**
	 * Find all records of a specific type, update state and notify subscribers
	 * @param  {[type]}  name [description]
	 * @return {Promise}      [description]
	 */
	async findAll(name) {
		const response = await fetch(`${config.api.url}/${name}`, { method: 'GET' });
		this.checkContentType(response);
		const json = await response.json();
		const records = json[name];
		this._data[name] = {};
		this._data[name].entities = records.reduce((obj, item) => {
			obj[item.id] = item;
			return obj;
		}, {});
		this._data[name].ids = records.map(item => item.id);
		this.publish();
		return records;
	}

	/**
	 * Create a new record, send to api and store locally
	 * @param  {[type]}  name [description]
	 * @param  {[type]}  data [description]
	 * @return {Promise}      [description]
	 */
	async createRecord(name, data) {
		const body = new FormData();
		body.append('json', JSON.stringify(data));

		const response = await fetch(`${config.api.url}/${name}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body
		});
		const json = await response.json();
		const record = json[name];
		this.addRecord(name, record);
	}

	addRecord(name, record) {
		if (!record) throw new Error(`Record is undefined ${name}`)
		// create the table if it doesn't exist
		if (!this._data[name]) {
			this._data[name] = {
				entities: {},
				ids: []
			};
		}
		const { id } = record;
		this._data[name].entities[id] = record;
		// add the id if it isn't present
		if (this._data[name].ids.indexOf(id) < 0) {
			this._date[name].ids.push(id);
		}
	}

	removeRecord(name, id) {
		if (!this._data[name]) {
			throw new Error(`No table named ${name}`);
		}
		delete this._data[name].entities[id];
		const index = this._data[name].ids.indexOf(id);
		if (index  > -1) {
			this._date[name].ids.splice(index, 1);
		}
	}

	addView(name, fn) {
		this._views[name] = fn;
	}

	async updateView(name) {
		const view = this._views[name];
		const data = await view(this);
		return data;
	}

	/**
	 * Check the content type against an expected value
	 * @param  {[type]} response                      [description]
	 * @param  {String} [expected='application/json'] [description]
	 * @return {[type]}                               [description]
	 */
	checkContentType(response, expected = 'application/json') {
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.indexOf(expected) === -1) {
			throw new Error(`Expected ${expected} but got ${contentType}`);
		}
	}

	/**
	 * Subscribe to state updates
	 * @param  {Function} fn [description]
	 * @return {[type]}      [description]
	 */
	subscribe(fn) {
		this.subscribers.add(fn);

		return () => {
			this.subscribers.delete(fn);
		}
	}

	/**
	 * Notify all subscribers
	 * @return {[type]} [description]
	 */
	publish() {
		for (let fn of this.subscribers) {
			fn();
		}
	}

	/**
	 * Connect a component to the store by wrapping it and
	 * forcing an update when the store updates
	 * @param  {[type]} stateMap [description]
	 * @return {[type]}          [description]
	 */
	connect(stateMap) {
		const store = this;
		return function(WrappedComponent) {
			return class extends React.Component {
				render() {
					return (
						<WrappedComponent
						{...this.props}
						{...stateMap(store, this.props)}
						/>
					);
				}

				componentDidMount() {
					this.unsubscribe = store.subscribe(this.handleChange.bind(this));
				}

				componentWillUnmount() {
					this.unsubscribe();
				}

				handleChange() {
					this.forceUpdate();
				}

			}
		}
	}
}

const store = Store.instance;

export default store;
