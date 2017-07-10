import Model from './Model';
import System from './System';
import Orbit from './Orbit';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'planets',
  fields: ['id', 'name', 'description', 'system_id', 'sector_id'],
  assignable: ['name', 'description', 'system_id', 'sector_id']
};

export class Planet extends Model {
  constructor({ id, name, description, system_id, orbit_id, sector_id } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.system_id = system_id;
    this.orbit_id = orbit_id;
    this.sector_id = sector_id;
  }

  static get table() {
    return table;
  }

  async system(db) {
    return this.belongsTo(db, System, 'system_id');
  }

  async orbit(db) {
    const sql = sqp.select()
      .from(Orbit.table)
      .where('secondary_body_id = ?', this.id)
      .where('secondary_body_type = ?', this.table)
      .limit(1)
      .toString();

    const result = await db.query(sql);
    return new Orbit(result.rows[0]);
  }

  async orbits(db) {
    const orbit = await this.orbit;
    const sql = sqp.select()
      .from(System.table)
  }

  async orbitedBy(db) {
    const sql = sqp.select()
      .from(Orbit.table)
      .where('primary_body_id = ?', this.id)
      .where('primary_body_type = ?', this.table)
      .limit(1)
      .toString();

    const result = await db.query(sql);
    return new Orbit(result.rows[0]);
  }
}
