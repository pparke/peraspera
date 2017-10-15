import { show } from './issud';
import NameGen from './NameGen';
import RandomDataGenerator from './RandomDataGenerator';
import squel from 'squel';
import config from '../config';
const sqp = squel.useFlavour('postgres');
const nameGen = new NameGen();
const rand = new RandomDataGenerator(config.universe.seed);

import System from '../models/System';
import Planet from '../models/Planet';
import Station from '../models/Station';
import Wormhole from '../models/Wormhole';
import Sector from '../models/Sector';

export default async function seeder(db, numSystems) {
  console.log('clearing database...');
  // delete all
  await db.query(sqp.delete().from('stations').toString());
  await db.query('alter sequence stations_id_seq restart');
  await db.query(sqp.delete().from('planets').toString());
  await db.query('alter sequence planets_id_seq restart');
  await db.query(sqp.delete().from('sectors').toString());
  await db.query('alter sequence sectors_id_seq restart');
  await db.query(sqp.delete().from('systems').where('id > 2').toString());
  await db.query('alter sequence systems_id_seq restart with 3');

  let planetCount = 0;
  let stationCount = 0;
  let sectorCount = 0;

  const systems = [];

  console.log('beginning system generation...');
  // for 1..N
  for (let i = 0; i < numSystems; i++) {
    logLine(`Creating system ${i} of ${numSystems}`);
    // create system
    // assign random name, star_type, and coords
    const system = new System();
    await system.save(db);

	systems.push(system);

	const starType = await show(db, 'star_type', system.star_type);

	const planets = [];
	const sectors = [];

    const numSectors = rand.between(3, 10);
    sectorCount += numSectors;
    for (let j = 0; j < numSectors; j++) {
        const sector = new Sector({
            coord_x: rand.between(1, 32),
            coord_y: rand.between(1, 32),
            system_id: system.id
        });

        await sector.save(db);
        sectors.push(sector);

        // random chance of a planet in the sector
        if (rand.frac() > 0.5) {
    		const planet = new Planet({
    			name:  nameGen.generate(rand.between(5, 10), rand.either(1, 2)),
    			description: '',
    			mass: rand.realInRange(0.1, 100),
                temperature: rand.between(-200, 200),
    			population: 0,
    			system_id: system.id,
                sector_id: sector.id
    		});

    		await planet.save(db);
    		planets.push(planet);
        }

		// random chance of station in sector
		if (rand.frac() > 0.8) {
			const station = new Station({
				name: nameGen.generate(rand.between(4, 9)) + ' Station',
				system_id: system.id,
                sector_id: sector.id
			});
			await station.save(db);

			stationCount += 1;
		}
    }
  }
  console.log('\nsystem generation complete.');

  console.log('creating wormholes between sectors...');
  // add wormholes between sectors
  const wormholes = [];
  const connections = [];
  systems.forEach((systema) => {
    logLine(`Calculating distances for system ${systema.name}`);
    const distances = [];
    systems.forEach((systemb) => {
      if (systema.id === systemb.id) {
        return;
      }

      distances.push({
        system: systemb.id,
        distance: Math.hypot(systema.coord_x - systemb.coord_x, systema.coord_y - systemb.coord_y)
      });
    });

    distances.sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < rand.between(1, 5); i++) {
      // don't create wormholes for connections that already exist
      if (connections.includes(`${distances[i].system}-${systema.id}`)) {
        continue;
      }
      const wormhole = new Wormhole({
        system_a_id: systema.id,
        system_b_id: distances[i].system
      });

      wormholes.push(wormhole);
      connections.push(`${systema.id}-${distances[i].system}`);
    }
  });

  console.log('\nsaving wormholes...')
  for (let i = 0; i < wormholes.length; i++) {
    await wormholes[i].save(db);
  }

  return { planetCount, stationCount, wormholeCount: wormholes.length };
}

function logLine(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
}
