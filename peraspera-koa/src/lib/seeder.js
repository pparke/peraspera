import { show } from './issud';
import NameGen from './NameGen';
import RandomDataGenerator from './RandomDataGenerator';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');
const nameGen = new NameGen();
const rand = new RandomDataGenerator(['1234', '5678', '7890']);

import System from '../models/System';
import Planet from '../models/Planet';
import Orbit from '../models/Orbit';
import Station from '../models/Station';
import Wormhole from '../models/Wormhole';

export default async function seeder(db, numSystems) {
  // delete all
  await db.query(sqp.delete().from('stations').toString());
  await db.query('alter sequence stations_id_seq restart');
  await db.query(sqp.delete().from('planets').toString());
  await db.query('alter sequence planets_id_seq restart');
  await db.query(sqp.delete().from('orbits').toString());
  await db.query('alter sequence orbits_id_seq restart');
  await db.query(sqp.delete().from('systems').where('id > 2').toString());
  await db.query('alter sequence systems_id_seq restart with 3');

  let planetCount = 0;
  let stationCount = 0;

	const systems = [];

  // for 1..N
  for (let i = 0; i < numSystems; i++) {
    // create system
    // assign random name, star_type, and coords
    const system = new System();
    await system.save(db);

		systems.push(system);

		const starType = await show(db, 'star_type', system.star_type);

		const planets = [];
		const orbits = [];

    // random chance of planets in system
    const numPlanets = rand.between(0, 10);
    planetCount += numPlanets;
    for (let j = 0; j < numPlanets; j++) {
			const planet = new Planet({
				name:  nameGen.generate(rand.between(5, 10), rand.either(1, 2)),
				description: '',
				mass: rand.between(1, 100),
				radius: rand.between(5, 15),
				population: 0,
				system_id: system.id
			});

			await planet.save(db);
			planets.push(planet);

			// create the orbit for the planet in the system
			const planetOrbit = new Orbit({
				radius: rand.between(100, starType.max_radius),
				primary_body_id: system.id,
				primary_body_type: 'systems',
				secondary_body_id: planet.id,
				secondary_body_type: 'planets'
			});
			await planetOrbit.save(db);
			orbits.push(planetOrbit);

			// random chance of station around planet
			if (rand.frac() > 0.8) {
				const station = new Station({
					name: nameGen.generate(rand.between(4, 9)) + ' Station',
					system_id: system.id
				});
				await station.save(db);

				// create the orbit for the station around the planet
				const stationOrbit = new Orbit({
					radius: planet.radius + 20,
					primary_body_id: planet.id,
					primary_body_type: 'planets',
					secondary_body_id: station.id,
					secondary_body_type: 'stations'
				});
				stationCount += 1;
			}
    }
  }

  // add wormholes between sectors

  return { planetCount, stationCount };
}
