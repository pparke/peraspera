import React from 'react';
import '../../assets/scss/navitem.scss';

export default class Navitem extends React.PureComponent {
	render() {
		return (
				<li id={ this.props.id } className='navitem'>{ this.props.text }</li>
		);
	}
}
