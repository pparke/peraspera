import Model from './Model';
import System from './System';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'ships',
  fields: [
    'id', 'name', 'description', 'fuel', 'hull_integrity', 'cargo_space', 'crew', 'hardpoints',
    'power_level', 'ship_type', 'system_id', 'sector_id', 'planet_id', 'station_id',
    'docked'

  ],
  assignable: [
    'name', 'description', 'fuel', 'hull_integrity', 'cargo_space', 'crew', 'hardpoints',
    'power_level', 'ship_type', 'system_id', 'sector_id', 'planet_id', 'station_id',
    'docked'
  ]
};

export default class Ship extends Model {
  constructor({
    id, name, description, fuel, hull_integrity, cargo_space, crew, hardpoints, power_level,
    ship_type, system_id, sector_id, planet_id, station_id, docked
  } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.fuel = fuel;
    this.hull_integrity = hull_integrity;
    this.cargo_space = cargo_space;
    this.crew = crew;
    this.hardpoints = hardpoints;
    this.power_level = power_level;
    this.ship_type = ship_type;
    this.system_id = system_id;
    this.sector_id = sector_id;
    this.planet_id = planet_id;
    this.station_id = station_id;
    this.docked = docked;
  }

  static get table() {
    return table;
  }

  async fuel(db) {
    const sql = sqp.select()
      .field('fuel')
      .from('ships')
      .where('id = ?', this.id)
      .limit(1)
      .toString();

    const result = await db.query(sql);
    return result.rows[0].fuel;
  }

  /**
   * Relationships
   */
  async system(db) {
    return this.belongsTo(db, System, 'system_id');
  }

  async sector(db) {
    return this.belongsTo(db, System, 'sector_id');
  }

  async planet(db) {
    return this.belongsTo(db, System, 'planet_id');
  }

  async station(db) {
    return this.belongsTo(db, System, 'station_id');
  }
}
