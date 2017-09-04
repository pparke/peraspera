import React from 'react';
//import { connect } from 'react-redux';
import Navitem from './Navitem';
import Navmenu from './Navmenu';
import '../../assets/scss/navbar.scss';

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false
		};

		this.menuToggle = this.menuToggle.bind(this);
    this.menuAction = this.menuAction.bind(this);
	}

	menuToggle() {
		this.setState({ menuOpen: !this.state.menuOpen });
	}

  menuAction(action) {

  }

	render() {
		return (
			<nav className='navbar'>
				<Navmenu
					title={ this.props.title }
					items={ this.props.items }
					open={ this.state.menuOpen }
					toggle={ this.menuToggle }
					menuAction={ this.menuAction }
				/>
			</nav>
		);
	}
}

export default Navbar;

/*
const itemsSelector = state => state.getIn(['menus', 'main', 'menuItems']).map(id => state.getIn(['menuItems', id]));

function mapStateToProps(state) {
  return {
    title: state.get('title'),
    items: itemsSelector(state)
  }
}

export default connect(mapStateToProps)(Navbar);
*/
