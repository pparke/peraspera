import router from 'koa-router';
import config from '../config';
import Ship from '../models/Ship';
import RandomDataGenerator from '../lib/RandomDataGenerator';

const rand = new RandomDataGenerator(config.universe.seed);

const game = router();

game.get('/join', async (ctx, next) => {
  const { query, db } = ctx;

  const ship = new Ship({
    name: 'Victory',
    description: '',
    fuel: 100,
    hull_integrity: 100,
    cargo_space: 10,
    crew: 1,
    hardpoints: 2,
    power_level: 100,
    ship_type: 1,
    sector_id: 1 // TODO
  });

  // get the max id
  let result;
  try {
    result = await db.query('select id from systems order by id desc limit 1');
  }
  catch (err) {
    console.log(err);
    ctx.throw(err.status, err);
  }

  if (result.rowCount === 0) {
    ctx.throw(500, new Error('No systems present in the DB'));
  }

  const maxId = result.rows[0].id;
  const startSystem = rand.between(1, maxId);

  ship.system_id = startSystem;

  await ship.save(db);

  ctx.body = ctx.body || {};
  ctx.body.ship = ship;

  await next();
});

export default game;
