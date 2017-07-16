import chai from 'chai';
import System from '../src/models/System';
import { maxCoord, starTypes, starProbabilities } from '../config';

const { expect } = chai;

describe('System', () => {

  it('test getStarType', async () => {
    let types = new Array(15).fill(null);
    types = types.map(() => System.getStarType(starProbabilities));
    types.forEach(type => console.log('type = ', type));
  });
});
