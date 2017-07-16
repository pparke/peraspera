import router from 'koa-router';
import resource from '../lib/resource';
import System from '../models/System';

const systems = resource(router(), 'systems', 'systems');

systems.get('/:id/detail', async (ctx, next) => {
	const { id } = ctx.params;
  const { db } = ctx;

	const system = await System.find(db, System, id);
	let planets = await system.planets(db);
	planets = await Promise.all(planets.map(async (planet) => {
		const orbit = await planet.orbit(db);
		const data = planet.serialize();
		data.orbitalRadius = orbit.radius;
		return data;
	}));

	ctx.body = {};
	ctx.body.system = system;
	ctx.body.system.planets = planets;
  await next();
});

export default systems;
