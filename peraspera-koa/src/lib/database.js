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

/**
 * Database Middleware
 * Abstracts koa-pg initialization and makdes the postgres database client
 * availible as this.db in future middleware as opposed to this.pg.db.client.
 */
export const database = async function pgMiddleware(ctx, next) {
  const client = await pool.connect();

  ctx['db'] = client;

	// yield to all middlewares so that they can use the client
  try {
    await next();
    // on the way back up the stack, release the client
    await client.release();
    delete ctx['db'];
  }
  catch (e) {
		// Since there was an error somewhere down the middleware,
		// then we need to throw this client away.
    await client.release(e);
		console.log(e.stack);
    ctx.throw(e.status, e.message);
  }
};
