import { index, show, store, update, del } from './issud';

export default function(route, name, table) {
  // index
  route.get('/', async (ctx, next) => {
    const { query, db } = ctx;

    const records = await index(db, table, query);

    ctx.body = ctx.body || {};
    ctx.body[name] = records;

    await next();
  });

  // show
  route.get('/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const { db } = ctx;

    const record = await show(db, table, id);

    ctx.body = ctx.body || {};
    ctx.body[name] = record;

    await next();
  });

  // store
  route.post('/', async (ctx, next) => {
    const record = ctx.body[name];
    const { db } = ctx;

    const result = await store(db, table, record);

    ctx.body = ctx.body || {};
    ctx.body[name] = result;
    await next();
  });

  // update
  route.put('/:id', async (ctx, next) => {
    const changes = ctx.body[name];
    const { id } = ctx.params;
    const { db } = ctx;

    const record = await update(db, table, id, changes);

    ctx.body = ctx.body || {};
    // Add stored record to the body
    ctx.body[name] = record;
    await next();
  });

  // delete
  route.delete('/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const { db } = ctx;

    const deleted = await del(db, table, id);

    ctx.body = {};
    ctx.body[name] = deleted;

    await next();
  });

  return route;
}
