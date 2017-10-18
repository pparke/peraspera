import React from 'react';
import config from '../../config.js';
const singleton = Symbol();
const enforcer = Symbol();

/**
 * Creates a singleton that acts as the interface and container of
 * a Map.  Defines a few custom methods for working with the map
 * and proxies the existing methods of the Map object.
 */
export class Store {
  constructor(enf) {
    if (enf !== enforcer) {
      throw new Error('Cannot instantiate more than one store.');
    }
    this._data = {};
    this.subscribers = new Set();
  }

  static get instance() {
    // if a store instance doesn't exist, create one
    if (!this[singleton]) {
      this[singleton] = new Store(enforcer);
    }
    return this[singleton];
  }

  clone(obj) {
    if (obj === null || typeof obj !== "object"){
      return obj;
    }
    else if (Array.isArray(obj)){
      var clonedArr = [];
      obj.forEach((element) => {
        clonedArr.push(this.clone(element))
      });
      return clonedArr;
    }
    else {
      let clonedObj = {};
      for (var prop in obj){
        if(obj.hasOwnProperty(prop)){
          clonedObj[prop] = this.clone(obj[prop]);
        }
      }
      return clonedObj;
    }
  }

  initialize(state) {
    this._data = this.clone(state);
  }

  getState() {
    return this._data;
  }

  async findRecord(name, id) {
    const response = await fetch(`${config.api.url}/${name}/${id}`, { method: 'GET' });
  	this.checkContentType(response);
  	const json = await response.json();
    this._data[name][id] = json[name];
    this.publish();
  	return json[name];
  }

  async findAll(name) {
    const response = await fetch(`${config.api.url}/${name}`, { method: 'GET' });
  	this.checkContentType(response);
  	const json = await response.json();
    const records = json[name];
    this._data[name] = records.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});
    this._data[name].ids = records.map(item => item.id);
    this.publish();
  	return records;
  }

  checkContentType(response, expected = 'application/json') {
  	const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf(expected) === -1) {
  		throw new Error(`Expected ${expected} but got ${contentType}`);
    }
  }

  subscribe(fn) {
    this.subscribers.add(fn);

    return () => {
      this.subscribers.delete(fn);
    }
  }

  publish() {
    for (let fn of this.subscribers) {
      fn();
    }
  }

  connect(stateMap) {
    const store = this;
    return function(WrappedComponent) {
      return class extends React.Component {
        render() {
          return (
            <WrappedComponent
              {...this.props}
              {...stateMap(store.getState(), this.props)}
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
