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

	let sectors = await system.sectors(db);

	ctx.body = {};
	ctx.body.system = system;
	ctx.body.system.planets = planets;
	ctx.body.system.wormholes = wormholes;
	ctx.body.system.sectors = sectors;
	await next();
});

systems.get('/:id/sideload', async (ctx, next) => {
	const { id } = ctx.params;
	const { db } = ctx;

	const system = await System.find(db, System, id);
	const planets = await system.planets(db);
	const wormholes = await system.wormholes(db);
	const sectors = await system.sectors(db);

	system.planets = planets.map(p => p.id);
	system.wormholes = wormholes.map(s => s.id);
	system.sectors = sectors.map(s => s.id);

	ctx.body = {};
	ctx.body.systems = system;
	ctx.body.planets = planets;
	ctx.body.wormholes = wormholes;
	ctx.body.sectors = sectors;

	await next();
});

export default systems;
