import Model from './Model';
import System from './System';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'wormholes',
  fields: ['id', 'system_a_id', 'system_b_id'],
  assignable: ['system_a_id', 'system_b_id']
};

export default class Wormhole extends Model {
  constructor({ id, system_a_id, system_b_id } = {}) {
    super();
    this.id = id;
    this.system_a_id = system_a_id;
    this.system_b_id = system_b_id;
  }

  static get table() {
    return table;
  }

  async systemA(db) {
    return this.belongsTo(db, System, 'system_a_id');
  }

  async systemB(db) {
    return this.belongsTo(db, System, 'system_b_id');
  }
}
