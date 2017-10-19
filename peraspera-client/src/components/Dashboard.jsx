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
    store.findRecord('systems', 1);

  }

  componentWillReceiveProps(next) {
    console.log('next props', next);
  }

  render() {
    const ship = this.props.playerShip;
    const system = this.props.system;
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
            <button style={{width: '100px', height: '30px'}} onClick={joinGame}>Join</button>
            <button style={{width: '100px', height: '30px'}} onClick={move}>Move</button>
        </Pane>
      </div>
    )
  }
}

const mapStore = store => {
    const state = store.getState();
    console.log('state is', state)

    const { player } = state;
    const playerShip = store.peekRecord('ships', player.ship);
    const sector = store.peekRecord('sectors', player.sector);
    const system = store.peekRecord('systems', player.system);
    const systemSectors = store.peekRecords('sectors', system.sectors);
    console.log('received system sectors', systemSectors)
    return {
      player: { ship: playerShip, sector, system },
      sector,
      systemSectors,
      playerShip,
      system
  }
};

export default store.connect(mapStore)(Dashboard);
