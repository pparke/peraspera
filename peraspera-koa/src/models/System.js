import Model from './Model';
import NameGen from '../lib/NameGen';
import RandomDataGenerator from '../lib/RandomDataGenerator';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');
const nameGen = new NameGen();
const rand = new RandomDataGenerator(['1234', '5678', '7890']);

export const maxCoord = 500;
export const starTypes = [
  null,
  'White Dwarf',
  'Red Dwarf',
  'Orange',
  'Yellow',
  'Yellow-White',
  'White',
  'Blue-White',
  'Blue',
  'stellar nebula',
  'planetary nebula',
  'red giant',
  'blue giant',
  'red supergiant',
  'neutron',
  'brown dwarf',
  'black hole'
];

export const starProbabilities = {
  'Red Dwarf': 0.8,
  'Orange': 0.08,
  'White Dwarf': 0.05,
  'Yellow': 0.035,
  'Yellow-White': 0.02,
  'White': 0.007,
  'Blue-White': 0.001,
  'Blue': 0.0000001
};

const table = {
  name: 'systems',
  fields: ['id', 'name', 'description', 'star_type', 'coord_x', 'coord_y', 'created_at', 'updated_at'],
  assignable: ['name', 'description', 'star_type', 'coord_x', 'coord_y']
};

export class System extends Model {
  constructor({ id, name, description, star_type, coord_x, coord_y, created_at, updated_at } = {}) {
    super();
    this.id = id;
    this.name = name || nameGen.generate(rand.between(5, 10));
    this.description = description || '';
    this.star_type = star_type || starTypes.indexOf(getStarType(starProbabilities));
    this.coord_x = coord_x || rand.between(0, maxCoord);
    this.coord_y = coord_y || rand.between(0, maxCoord);
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static get table() {
    return table;
  }
}

export async function getStarTypeId(db, name) {
  const sql = sqp.select()
    .field('id')
    .from('star_type')
    .where('name = ?', name)
    .limit(1)
    .toString();

  const result = await db.query(sql);
  return result.rows[0].id;
}

export function getStarType(freqs) {
  let probSum = 0;
  const entries = Object.keys(freqs)
    .map((key) => {
      return { key, frequency: freqs[key] };
    })
    .reduce((srtd, f, i) => {
      if (i === 0) {
        srtd.push(f);
      }
      if (f.frequency >= srtd[0].frequency) {
        srtd.unshift(f);
      }
      else {
        srtd.push(f);
      }
      probSum += f.frequency;
      return srtd;
    }, [])
    .map((el) => {
      el.probability = (el.frequency / probSum);
      return el;
    });

  const sorted = entries.sort((a, b) => {
    if (a.probability < b.probability) {
      return -1;
    }
    if (a.probability > b.probability) {
      return 1;
    }
    return 0;
  });

  let type = null;
  for (
    let i = 0, cumulative = 0, selection = Math.random();
    i < sorted.length && selection > cumulative;
    cumulative += sorted[i].probability, type = sorted[i].key, i += 1
  ) {}

  if (type) {
    return type;
  }

  throw new Error(`Could not determine type with selection: ${selection}
                   and probabilities ${JSON.stringify(sorted, null, '\t')}`);
}
