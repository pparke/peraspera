import pg from 'pg';
import copg from 'co-pg';
const wrapPg = copg(pg);

export default function(opts) {

  if (typeof opts === 'string') {
    opts = { connectionString: opts, key: 'db' };
  }

  const { connectionString, key } = opts;

  return async function koaPg(ctx, next) {
    const [client, done] = await wrapPg.connectPromise(connectionString);

    ctx[key] = client;

    // yield to all middlewares so that they can use the client
    try {
      await next();
    }
    catch (e) {
      // Since there was an error somewhere down the middleware,
      // then we need to throw this client away.
      done(e);
      ctx.throw(e);
    }
    // on the way back up the stack, release the client
    done();
    delete ctx[key];
  };

}
