import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/scss/core.scss';
import App from './components/App';
//import { createStore } from 'redux';
//import { Provider } from 'react-redux';
//import reducer from './reducer';
//import { setState } from './actions';
//import { fromJS } from 'immutable';
import { HashRouter as Router } from 'react-router-dom';

//const store = createStore(reducer);
//const initialState = fromJS(state);
//store.dispatch(setState(initialState));

ReactDOM.render(
  //<Provider store={store}>
  <Router>
    <App />
  </Router>,
  //</Provider>,
  document.getElementById('app')
);
