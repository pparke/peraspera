import Model from './Model';
import User from './User';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'passwd',
  fields: ['id', 'user_id', 'username', 'password', 'salt', 'token_verify', 'token_public', 'token_expires'],
  assignable: ['user_id', 'username', 'password', 'salt', 'token_verify', 'token_public', 'token_expires']
};

export default class Passwd extends Model {
  constructor({ id, user_id, username, password, salt, token_verify, token_public, token_expires } = {}) {
    super();
    this.id = id;
    this.user_id = user_id;
    this.username = username;
    this.password = password;
    this.salt = salt;
    this.token_verify = token_verify;
    this.token_public = token_public;
    this.token_expires = token_expires;
  }

  static get table() {
    return table;
  }

  async user(db) {
    return this.belongsTo(db, User, 'user_id');
  }
}
