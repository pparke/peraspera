import Model from './Model';
import Sector from './Sector';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'sectors',
  fields: ['id', 'name', 'sector_a_id', 'sector_b_id'],
  assignable: ['name', 'sector_a_id', 'sector_b_id']
};

export default class Wormhole extends Model {
  constructor({ id, name, sector_a_id, sector_b_id } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.sector_a_id = sector_a_id;
    this.sector_b_id = sector_b_id;
  }

  static get table() {
    return table;
  }

  async sectorA(db) {
    return this.belongsTo(db, Sector, 'sector_a_id');
  }

  async sectorB(db) {
    return this.belongsTo(db, Sector, 'sector_b_id');
  }
}
