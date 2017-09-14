import React from 'react';
import { connect } from 'react-redux';
import { fetchShip, fetchSector } from '../actions';

// components
import Pane from './Pane';

// assets
import '../../assets/scss/dashboard.scss';

// lib
import { getShips, getSystems, joinGame } from '../lib/api';

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
    const { dispatch, fetchSector, fetchShip, player } = this.props;
    console.log('props are =>', this.props)
    dispatch(fetchShip(player.ship));
    dispatch(fetchSector(1));
  }

  componentWillReceiveProps(next) {
    console.log('next props', next);
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
    const ship = this.props.ship;
    const system = this.props.system;
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

const mapStateToProps = state => ({
  fetchShip,
  fetchSector,
  player: state.player,
  sector: state.sectors[state.player.sector] || {},
  ship: state.ships[state.player.ship] || {},
  system: {}
});

export default connect(mapStateToProps)(Dashboard);
