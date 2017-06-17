import React from 'react';
import '../../assets/scss/app.scss';

export default class App extends React.PureComponent {
	render() {
		return <div className='app'>{ this.props.children }</div>;
	}
}
