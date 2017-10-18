import React from 'react';
import { joinGame, move } from '../lib/api';
import store from '../lib/Store';

// components
import Pane from './Pane';
import Stats from './Stats';

// assets
import '../../assets/scss/dashboard.scss';


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
    const playerShip = store.findRecord('ships', player.ship);
    store.findAll('sectors');
    store.findRecord('systems', 1);

  }

  componentWillReceiveProps(next) {
    console.log('next props', next);
  }

  render() {
    const ship = this.props.ship;
    const system = this.props.system;
    const sectors = this.props.sectors;
    console.log('ship', ship, 'system', system, 'sectors', sectors)
    return (
      <div className='dashboard'>
        <Pane theme={'clear'} title={'DASHBOARD'}>
          <Stats header={'Ship'} items={[
                `Name: ${ship.name}`,
                `Fuel: ${ship.fuel}`,
                `Hull: ${ship.hull_integrity}`,
                `Cargo Space: ${ship.cargo_space}`,
                `Crew: ${ship.crew}`,
                `Power: ${ship.power_level}`
          ]}
          />
          <Stats header='System' items={[
                `Name: ${system.name}`,
                `Coordinates: ${system.coord_x} ${system.coord_y}`
          ]}
          />

          <Stats header={'Sectors'} items={sectors.map(sector => {
                return `id: ${sector.id} Coordinates: ${sector.coord_x} ${sector.coord_y}`
            })}
            />

            <Stats header='Wormholes' items={[]} />
            <button style={{width: '100px', height: '30px'}} onClick={joinGame}>Join</button>
            <button style={{width: '100px', height: '30px'}} onClick={move}>Move</button>
        </Pane>
      </div>
    )
  }
}

const mapStateToProps = state => {
    console.log('state is', state)
    const { player } = state;
    const { sectors, ships, systems } = state;
    return {
      player: player,
      sector: sectors[player.sector] || {},
      sectors: sectors.ids.map(k => sectors[k]) || [],
      ship: ships[player.ship] || {},
      system: systems[player.system] || {}
  }
};

export default store.connect(mapStateToProps)(Dashboard);
