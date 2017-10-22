import Model from './Model';
import System from './System';
import Planet from './Planet';
import Station from './Station';
import Ship from './Ship';
import Passwd from '../models/Passwd';
import hash from './hash';
import randomToken from './randomToken';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'users',
  fields: ['id', 'email', 'handle', 'verified'],
  assignable: ['email', 'handle']
};

export default class User extends Model {
  constructor({ id, email, handle, verified } = {}) {
    super();
    this.id = id;
    this.email = email;
    this.handle = handle;
    this.verified = verified;
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

  async ships(db) {
      return this.hasMany(db, Ship, 'system_id');
  }

  static async create(db, details) {
    console.log('Creating new User...');
    const user = new User({
      email: details.email || null,
      handle: details.handle || null,
      verified: false
    });
    let passwd;

    try {
      await user.save();
      const salt = crypto.randomBytes(64).toString('base64');

      // { salt, key }
      const hashResult = await hash(details.password, salt);

      passwd = new Passwd({
        user: user.id,
        username: details.username,
        password: hashResult.key.toString('hex'),
        salt,
        token_verify: randomToken(15),
        token_public: randomToken(30),
        token_expires: Date.now() + (1000 * 60 * 60 * 24 * 7)
      });

      await passwd.save();
      // set the passwd relationship on the user record
      user.passwd = passwd.id;

      await user.save();

      return { user, passwd };
    }
    catch (reason) {
      // remove the created user
      if (user) {
        await User.remove(db, 'users', user.id);
      }
      // remove the created passwd
      if (passwd) {
        Passwd.remove(db, 'passwd', passwd.id);
      }

      throw reason;
    }
  }

}
