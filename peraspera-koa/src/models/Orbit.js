import Model from './Model';
import System from './System';
import Planet from './Planet';
import Station from './Station';
import Ship from './Ship';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'orbits',
  fields: [
    'id', 'radius', 'period', 'primary_body_id', 'primary_body_type',
    'secondary_body_id', 'secondary_body_type'
  ],
  assignable: [
    'radius', 'period', 'primary_body_id', 'primary_body_type',
    'secondary_body_id', 'secondary_body_type'
  ]
};

const orbitable = [System, Planet, Station, Ship];

export class Orbit extends Model {
  constructor({ id, radius, period, primary_body_id, primary_body_type, secondary_body_id, secondary_body_type } = {}) {
    super();
    this.id = id;
    this.radius = radius;
    this.period = period;
    this.primary_body_id = primary_body_id;
    this.primary_body_type = primary_body_type;
    this.secondary_body_id = secondary_body_id;
    this.secondary_body_type = secondary_body_type;
  }

  static get table() {
    return table;
  }

  async primary(db) {
    const ModelClass = orbitable.find((model) => model.table === this.primary_body_type);
    const sql = sqp.select()
      .from(this.primary_body_type)
      .where('id = ?', this.primary_body_id)
      .limit(1)
      .toString();

    const result = await db.query(sql);
    return new ModelClass(result.rows[0]);
  }

  async secondary(db) {
    const ModelClass = orbitable.find((model) => model.table === this.secondary_body_type);
    const sql = sqp.select()
      .from(this.secondary_body_type)
      .where('id = ?', this.secondary_body_id)
      .limit(1)
      .toString();

    const result = await db.query(sql);
    return new ModelClass(result.rows[0]);
  }
}
