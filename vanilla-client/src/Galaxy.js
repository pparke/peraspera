import Star from './Star';

import { checkContentType } from './api';
import config from '../config';
const LYPX = 1;

const starStyles = config.appearance.stars;

export default class Galaxy {
	constructor() {
		this.stars = [];
		this.wormholes = [];

		this.setup();
	}

	async setup() {
		const starTypes = await this.getStarTypes();
		const systems = await this.getSystems();
		const wormholes = await this.getWormholes();
		console.log(systems, starTypes)
		const stars = systems.map(system => {
			const type = starTypes.find(type => type.id === system.star_type);
			return {
				id: system.id,
				name: system.name,
				description: system.description,
				mass: type.mass,
				color: starStyles[type.name].color,
				radius: starStyles[type.name].radius,
				starType: type.name,
				position: {
					x: system.coord_x * LYPX,
					y: system.coord_y * LYPX
				}
			};
		});
		this.stars = stars.map(star => new Star(star));
		this.wormholes = wormholes.map(w => {
			w.system_a = systems.find(s => s.id === w.system_a_id);
			w.system_b = systems.find(s => s.id === w.system_b_id);
			return w;
		});
		console.log('wormholes', this.wormholes)
	}

	async getStarTypes() {
		const response = await fetch(`${config.api.url}/starTypes`, { method: 'GET' });
		checkContentType(response);
		const json = await response.json();
		return json.starTypes;
	}

	async getSystems() {
		const response = await fetch(`${config.api.url}/systems`, { method: 'GET' });
		checkContentType(response);
		const json = await response.json();
		return json.systems;
 	}

	async getWormholes() {
		const response = await fetch(`${config.api.url}/wormholes`, { method: 'GET' });
		checkContentType(response);
		const json = await response.json();
		return json.wormholes;
	}

	findStarAt(x, y) {
		return this.stars.find(star => {
			const distance = Math.hypot(x - star.pos.x, y - star.pos.y);
			return distance < star.radius * 2;
		});
	}

	update(dt) {

	}

	render(viewport) {
		const { ctx } = viewport;
		ctx.strokeStyle = '#dadada';
		for (const wormhole of this.wormholes) {
			const a = viewport.toScreenCoords(wormhole.system_a.coord_x, wormhole.system_a.coord_y);
			const b = viewport.toScreenCoords(wormhole.system_b.coord_x, wormhole.system_b.coord_y);
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}

		for (const star of this.stars) {
			star.render(viewport);
		}

	}
}
