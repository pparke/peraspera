import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/scss/core.scss';
import Root from './components/Root';
import { createStore } from 'redux';

import reducer from './reducer';
import { setState } from './actions';
import { fromJS } from 'immutable';

import state from '../assets/data/initialState';

const store = createStore(reducer);
const initialState = fromJS(state);
store.dispatch(setState(initialState));

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('app')
);
