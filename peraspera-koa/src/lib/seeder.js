import { store, update, del } from './issud';
import NameGen from './NameGen';
import RandomDataGenerator from './RandomDataGenerator';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');
const nameGen = new NameGen();
const rand = new RandomDataGenerator(['1234', '5678', '7890']);

import { System } from '../models/System';

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

  // for 1..N
  for (let i = 0; i < numSystems; i++) {
    // create system
    // assign random name, star_type, and coords
    const system = new System();
    await system.save(db);

    // random chance of planets in sector
    const numPlanets = rand.between(0, 10);
    planetCount += numPlanets;
    for (let j = 0; j < numPlanets; j++) {
      const planetSql = sqp.insert()
        .into('planets')
        .set('name', nameGen.generate(rand.between(5, 10)))
        .set('description', '')
        .set('system_id', system.id)
        .returning('*')
        .toString();

      const planetResult = await db.query(planetSql);
      const planet = planetResult.rows[0];

      const orbitSql = sqp.insert()
        .into('orbits')
        .set('radius', rand.between(100, 10000))
        .set('period', rand.between(1000, 10000))
        .set('primary_body_id', system.id)
        .set('primary_body_type', 'systems')
        .set('secondary_body_id', planet.id)
        .set('secondary_body_type', 'planets')
        .returning('*')
        .toString();

      const orbitResult = await db.query(orbitSql);
      const orbit = orbitResult.rows[0];
    }
    // random chance of station in sector
  }

  // add wormholes between sectors

  return { planetCount, stationCount };
}
