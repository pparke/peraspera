import React from 'react';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

const Root = ({ store }) => (
	<Provider store={store}>
        <Router>
          <App />
        </Router>
    </Provider>
);

export default Root;
