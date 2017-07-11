import chai from 'chai';
import seeder from '../src/lib/seeder';
import { wrappedPg } from '../src/lib/database';

const { expect } = chai;

describe('seeder', () => {

  it('test seeding', async () => {
    const { client, done } = await wrappedPg.connect();
    const { planetCount, stationCount } = await seeder(client, 10);
    console.log(`Created ${planetCount} planets and ${stationCount} stations.`);
    done();
  });

});
