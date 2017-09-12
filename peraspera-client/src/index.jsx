import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/scss/core.scss';
import Root from './components/Root';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import reducer from './reducer';
import { setState } from './actions';
//import { fromJS } from 'immutable';
import thunk from "redux-thunk";

import state from '../assets/data/initialState';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
//const initialState = fromJS(state);
store.dispatch(setState(state));

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('app')
);
