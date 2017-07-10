import { Store } from 'koa-session2';
import squel from 'squel';
import pg from 'pg';
import copg from 'co-pg';
import config from '../config';
const PG = copg(pg);
const dsn = `postgres://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`;

export default class PGStore extends Store {
  constructor() {
    super();
    this.connectionString = dsn;
    this.connections = new Map();
  }

  async getClient() {
    // get a client connection
    const [client, done] = await PG.connectPromise(this.connectionString);
    // cache the done fn
    this.connections.set(client, done);
    // return the client for use
    return client;
  }

  releaseClient(client) {
    const done = this.connections.get(client);
    done();
    this.connections.delete(client);
  }

  /**
   * Retrieve a property from the session
   */
  async get(sessionId) {
    if (!sessionId) {
      throw new Error('No session id present, cannot set session data.', 400);
    }
    const client = await this.getClient();
    const query = squel.select()
                       .from('sessions')
                       .where('key = ?', sessionId)
                       .toString();
    const result = await client.query(query);
    const data = result.rows[0];
    this.releaseClient(client);
    return data;
  }

  async set(session, options) {
    let sessionId = options.sid;
    // if we didn't get a session id, generate a new one
    if(!sessionId) {
      sessionId = this.getID(24);
    }
    // get a db client
    const client = await this.getClient();

    const query = squel.update()
                       .table('sessions')
                       .set('data', JSON.stringify(session))
                       .where('key = ?', sessionId)
                       .toString();

    const result = await client.query(query);

    console.log('result of set was', result);

    // if we were unable to update it's probably because the session
    // doesn't exist so we'll create it
    if (result.rowCount === 0) {
      const iquery = squel.insert()
                          .into('sessions')
                          .set('data', JSON.stringify(session))
                          .set('key', sessionId)
                          .toString();
      await client.query(iquery);
    }
    // release the db client
    this.releaseClient(client);

    return sessionId;
  }

  async destroy(sessionId) {
    // get a db client
    const client = await this.getClient();
    const query = squel.delete().from('sessions').where('key = ?', sessionId).toString();
    const result = await client.query(query);
    // release the db client
    this.releaseClient(client);
    return result;
  }
}
