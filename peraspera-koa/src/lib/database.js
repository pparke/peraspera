import config from '../config';
import pg from 'pg';

const pool = new pg.Pool({
  user: config.db.user,
  database: config.db.name,
  password: config.db.pass,
  host: config.db.host,
  port: config.db.port,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', function pgErrorHandler(err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack, client);
});

// promisify query and connect
export const wrappedPg = {
	// the query method for passing queries to the pool
  query(text, values) {
    return new Promise((resolve, reject) => {
      return pool.query(text, values, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  },

	// the pool also supports checking out a client for
	// multiple operations, such as a transaction
  connect() {
    return new Promise((resolve, reject) => {
      return pool.connect((err, client, done) => {
        if (err) {
          return reject(err);
        }
        return resolve({ client, done });
      });
    });
  }
};

/**
 * Database Middleware
 * Abstracts koa-pg initialization and makdes the postgres database client
 * availible as this.db in future middleware as opposed to this.pg.db.client.
 */
export const database = async function pgMiddleware(ctx, next) {
  const { client, done } = await wrappedPg.connect();

  ctx['db'] = client;

	// yield to all middlewares so that they can use the client
  try {
    await next();
  }
  catch (e) {
		// Since there was an error somewhere down the middleware,
		// then we need to throw this client away.
    done(e);
		console.log(e.stack);
    ctx.throw(e.status, e.message);
  }
	// on the way back up the stack, release the client
  done();
  delete ctx['db'];
};
