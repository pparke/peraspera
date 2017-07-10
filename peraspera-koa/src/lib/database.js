import koaPg from './koa2Pg';
import config from '../config';
// import compose from 'koa-compose';

/**
 * DB String
 * Builds and returns a postgres connection string using the database connection
 * values configured for the current environment.
 */
export const dsn = `postgres://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`;

/**
 * Database Middleware
 * Abstracts koa-pg initialization and makdes the postgres database client
 * availible as this.db in future middleware as opposed to this.pg.db.client.
 */
export const database = koaPg(dsn);
