import router from 'koa-router';
import resource from '../lib/resource';
import Ship from '../models/Ship';

const ships = resource(router(), 'ships', 'ships');

ships.get('/:id/fuel', async (ctx, next) => {
  const { db } = ctx;

  await next();
});

export default ships;
