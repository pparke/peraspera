import React from 'react';
import { connect } from 'react-redux';
import { shipRead, sectorRead, systemRead } from '../actions';

// components
import Pane from './Pane';

// assets
import '../../assets/scss/dashboard.scss';

const joinGame = function(){};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ship: {},
      system: {}
    };
  }

  componentDidMount() {
    const { dispatch, sectorRead, shipRead, systemRead, player } = this.props;
    console.log('props are =>', this.props)
    dispatch(shipRead(player.ship));
    dispatch(sectorRead(1));
    dispatch(systemRead(1));
  }

  componentWillReceiveProps(next) {
    console.log('next props', next);
  }

  render() {
    const ship = this.props.ship;
    const system = this.props.system;
    console.log('ship', ship, 'system', system)
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

const mapStateToProps = state => {
    console.log('state is', state)
    const { player } = state.main;
    return {
      shipRead,
      sectorRead,
      systemRead,
      player: player,
      sector: state.sectors[player.sector] || {},
      ship: state.ships[player.ship] || {},
      system: state.systems[player.system] || {}
  }
};

export default connect(mapStateToProps)(Dashboard);
