import React from 'react';
import { connect } from 'react-redux';

// components
import Pane from './Pane';

// assets
import '../../assets/scss/dashboard.scss';
import state from '../../assets/data/initialState';

// lib
import { getShips, getSystems, joinGame } from '../lib/api';

function mapStateToProps(state) {
   return { playerShip: state.getIn(['player', 'ship']) };
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ship: {},
      system: {}
    };

    this.getInfo = this.getInfo.bind(this);
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    const ship = await getShips(this.props.playerShip);
	if (ship) {
	    this.setState({ ship });
		const system = await getSystems(ship.system_id);
		if (system) {
			this.setState({ system });
			console.log(system);
		}
	}
  }

  render() {
    const ship = this.state.ship;
    const system = this.state.system;
    return (
      <div className='dashboard'>
        <Pane theme={'clear'} title={'DASHBOARD'}>
          <div className='stats'>
            <h3 className='header'>Ship</h3>
            <ul>
              <li>Name: {ship.name}</li>
              <li>Fuel: {ship.fuel}</li>
              <li>Hull: {ship.hull_integrity}</li>
              <li>Cargo Space: {ship.cargo_space}</li>
              <li>Crew: {ship.crew}</li>
              <li>Power: {ship.power_level}</li>
            </ul>
          </div>
          <div className='stats'>
            <h3 className='header'>System</h3>
            <ul>
              <li>Name: {system.name}</li>
            </ul>
          </div>
          <button style={{width: '100px', height: '30px'}} onClick={joinGame}>Join</button>
        </Pane>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Dashboard);
