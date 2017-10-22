import Model from './Model';
import System from './System';
import Planet from './Planet';
import Station from './Station';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'sectors',
  fields: ['id', 'coord_x', 'coord_y', 'system_id'],
  assignable: ['coord_x', 'coord_y', 'system_id']
};

export default class Sector extends Model {
  constructor({ id, coord_x, coord_y, system_id } = {}) {
    super();
    this.id = id;
    this.coord_x = coord_x;
    this.coord_y = coord_y;
    this.system_id = system_id;
  }

  static get table() {
    return table;
  }

  async system(db) {
    return this.belongsTo(db, System, 'system_id');
  }

  async planets(db) {
      return this.hasMany(db, Planet, 'system_id');
  }

  async stations(db) {
      return this.hasMany(db, Station, 'system_id');
  }

}
