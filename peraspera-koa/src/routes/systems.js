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

	let wormholes = await system.wormholes(db);
	wormholes = await Promise.all(wormholes.map(async (wormhole) => {
		return wormhole.system_a_id === system.id ? wormhole.systemB(db) : wormhole.systemA(db);
	}));

	ctx.body = {};
	ctx.body.system = system;
	ctx.body.system.planets = planets;
	ctx.body.system.wormholes = wormholes;
  await next();
});

export default systems;
