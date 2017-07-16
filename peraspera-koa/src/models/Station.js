import Model from './Model';
import System from './System';
import Orbit from './Orbit';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'stations',
  fields: ['id', 'name', 'system_id', 'orbit_id', 'sector_id'],
  assignable: ['name', 'system_id', 'orbit_id', 'sector_id']
};

export default class Station extends Model {
  constructor({ id, name, system_id, orbit_id, sector_id } = {}) {
    super();
    this.id = id;
		this.name = name;
		this.system_id = system_id;
		this.orbit_id = orbit_id;
		this.sector_id = sector_id;
  }

  static get table() {
    return table;
  }

	async orbit(db) {
    return this.belongsTo(db, Orbit, 'orbit_id');
  }

  async system(db) {
    return this.belongsTo(db, System, 'system_id');
  }
}
