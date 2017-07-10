import chai from 'chai';
import { getStarType, starProbabilities } from '../src/models/System';

const { expect } = chai;

describe('System', () => {

  it('test getStarType', async () => {
    let types = new Array(15).fill(null);
    types = types.map(() => getStarType(starProbabilities));
    types.forEach(type => console.log('type = ', type));
  });
});
