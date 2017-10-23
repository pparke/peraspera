import Model from './Model';
import User from './User';
import hash from '../lib/hash';
import randomToken from '../lib/randomToken';
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

  static async passwordAuth(db, auth) {
    if (!auth) {
      throw new Error('No authorization provided');
    }

    // decode auth header
    const encoded = auth.split(' ');
    const buf = new Buffer(encoded[1], 'base64');
    const plainText = buf.toString();

    // split auth into username and password
    const userpass = plainText.split(':');
    const username = userpass[0];
    const password = userpass[1];

    // both are required
    if (!username || !password) {
      throw new Error('No username or password given.');
    }

    const passwd = await Passwd.findWhere(db, { username });

    if (!passwd) {
      throw new Error('Passwd not found');
    }

    // hash the password we got from the user
    const { salt, key } = await hash(password, passwd.salt);

    // check if the hashed passwords match
    if (key.toString('hex') === passwd.password) {
      // generate a new public token, save and return
      const publicToken = randomToken(30);
      // expires in one week
      const expires = Date.now() + (1000 * 60 * 60 * 24 * 7);

      passwd.token_public = publicToken;
      passwd.token_expires = expires;

      await passwd.save(db);

    }
    else {
      throw new Error('Passwords do not match.');
    }

    return passwd;
  }
}
