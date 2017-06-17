import React from 'react';
import Navitem from './Navitem';
import '../../assets/scss/navmenu.scss';
import Logo from '../../assets/svg/logo.svg';

export default class Navmenu extends React.PureComponent {
	constructor(props) {
		super(props);

		this.renderMenu = this.renderMenu.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}

	renderMenu() {
		if (!this.props.open) {
			return <div className='title'>{ this.props.title }</div>;
		}
		return (
			<ul>
				{ this.props.items.map(this.renderItem) }
			</ul>
		);
	}

	renderItem(item, i) {
		return <Navitem key={ `navitem-${i}` } text={ item.get('text') } onClick={ this.props.menuAction.bind(this, item.action) }/>;
	}

	render() {
		return (
			<div className='navmenu'>
				<div className='menu-toggle' onClick={ this.props.toggle }>
					<Logo className='logo'/>
				</div>
				{ this.renderMenu() }
			</div>
		);
	}
}
