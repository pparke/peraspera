import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

// components
import Navbar from './Navbar';
import Page from './Page';
import Pane from './Pane';
import Logo from '../../assets/svg/logo.svg';
import Dashboard from './Dashboard';
import Galaxy from './Galaxy';
import Signup from './Signup';

// styles
import '../../assets/scss/app.scss';

// lib
import { getSystems } from '../lib/api';
import state from '../../assets/data/initialState';

const SystemPage = () => (
  <Page title={'Sector'}>
    <Pane theme='window' getData={getSystems}/>
    <Pane theme='window' getData={getSystems}/>
  </Page>
);

const ShipPage = () => (
	<Page title={'Ship'}>

	</Page>
)

const Welcome = () => (
  <h1 className='welcome'>Welcome</h1>
);

const App = () => (
	<div className='app'>
		<Logo className='logo'/>
		<Navbar title={state.title} items={state.menus.main.items}/>
		<Switch>
			<Route exact path='/' component={Welcome}/>
			<Route path='/system' component={SystemPage} />
			<Route path='/ship' component={ShipPage} />
			<Route path='/dashboard' component={Dashboard} />
            <Route path='/signup' component={Signup} />
      <Route path='/galaxy' component={Galaxy} />
		</Switch>
	</div>
);

export default App;
