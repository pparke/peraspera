import chai from 'chai';
import seeder from '../src/lib/seeder';
import { dsn } from '../src/lib/database';
import pg from 'pg';
import copg from 'co-pg';
const wrapPg = copg(pg);

const { expect } = chai;

describe('seeder', () => {

  it('test seeding', async () => {
    const [db, dbDone] = await wrapPg.connectPromise(dsn);
    const { planetCount, stationCount } = await seeder(db, 10);
    console.log(`Created ${planetCount} planets and ${stationCount} stations.`);
    dbDone();
  });

});
