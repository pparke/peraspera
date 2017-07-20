import Model from './Model';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'items',
  fields: ['id', 'name'],
  assignable: ['name']
};

export default class Item extends Model {
  constructor({ id, name } = {}) {
    super();
    this.id = id;
    this.name = name;
  }

  static get table() {
    return table;
  }
}
