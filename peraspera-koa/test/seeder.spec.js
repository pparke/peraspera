import chai from 'chai';
import seeder from '../src/lib/seeder';
import { pool } from '../src/lib/database';

const { expect } = chai;

describe('seeder', () => {

  it('test seeding', async () => {
    const client = await pool.connect();
    const { planetCount, stationCount, wormholeCount } = await seeder(client, 30);
    console.log(`Created ${planetCount} planets, ${wormholeCount} wormholes, and ${stationCount} stations.`);
    client.release();
  }).timeout(20000);

});
