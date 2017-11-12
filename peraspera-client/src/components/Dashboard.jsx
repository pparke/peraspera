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
    const { player } = this.props;
    console.log('props are =>', this.props)
    const playerShip = store.findRecord('ships', player.ship);
    store.findAll('sectors');
    store.findRecord('systems', player.system);

  }

  componentWillReceiveProps(next) {
    console.log('next props', next);
  }

  render() {
    const ship = this.props.playerShip;
    const system = this.props.currentSystem;
    const sectors = this.props.systemSectors;
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
          <button style={{width: '100px', height: '30px'}} onClick={move}>Move</button>
        </Pane>
      </div>
    )
  }
}

const mapStore = store => {
    const state = store.state;
    console.log('state is', state)

    const { player } = state;
    // get the current ship the player is on
    const playerShip = store.peekRecord('ships', player.ship);
    // get the current sector the player is in
    const currentSector = store.peekRecord('sectors', player.sector);
    // get the systems the player is in
    const currentSystem = store.peekRecord('systems', player.system);
    // get all the sectors in the current system
    const systemSectors = store.peekRecords('sectors', currentSystem.sectors);
    console.log('received system sectors', systemSectors)
    return {
      player,
      currentSector,
      systemSectors,
      playerShip,
      currentSystem
  }
};

export default store.connect(mapStore)(Dashboard);
