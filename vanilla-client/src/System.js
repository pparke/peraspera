import Star from './Star';
import { darken, randomColor } from './util';
import { checkContentType } from './api';
import config from '../config';

const starStyles = config.appearance.stars;

const G = 0.1;
const TAU = 2 * Math.PI;

export default class System {
	constructor(star) {
		this.id = star.id;
		this.star = star;
		this.planets = [];

		this.setup();
	}

	async setup() {
		const planets = await this.getPlanets();
		this.planets = planets.map(planet => {
			return new Planet({
				name: planet.name,
				mass: planet.mass,
				orbitalRadius: planet.orbitalRadius,
				primary: this.star,
				radius: planet.radius
			});
		});
	}

	async getPlanets() {
		const response = await fetch(`${config.api.url}/systems/${this.id}/detail`, { method: 'GET' });
		checkContentType(response);
		const json = await response.json();
		return json.system.planets;
	}

	update(dt) {
		// update the planets
		for (const planet of this.planets) {
			planet.updateAngle(dt);
			planet.updatePosition();
		}
	}

	render(viewport) {
		for (const planet of this.planets) {
			this.drawOrbit(viewport, planet);
			planet.render(viewport);
		}
	}

	drawOrbit(viewport, planet) {
			const ctx = viewport.ctx;
			const screenPos = viewport.toScreenCoords(this.star.pos.x, this.star.pos.y);
			ctx.beginPath();
	    ctx.arc(
	      screenPos.x,
	      screenPos.y,
	      planet.orbitalRadius,
	      0,
	      TAU,
	      false
	     );

	    ctx.strokeStyle = '#dadada';
	    ctx.lineWidth = 2;
	    ctx.stroke();
	}
}

class Planet {
	constructor({ name, mass, orbitalRadius, primary, radius }) {
		this.name = name;
		this.mass = mass;
		this.orbitalRadius = orbitalRadius;
		this.primary = primary;
		this.radius = radius || Math.random()*20 + 5;

		this.atmoColor = randomColor();
		this.atmoSize = Math.ceil(Math.random()*this.radius/2);
		this.bodyColor = randomColor();
		this.velocity = Math.sqrt((G*this.mass*this.primary.mass)/orbitalRadius);
		console.log('planet velocity is', this.velocity)
		this.angle = 0;
		this.pos = {
			x: 0,
			y: 0
		};

		this.updatePosition();
	}

	updateAngle(dt) {
		this.angle += this.velocity * dt;
		if (this.angle >= TAU) {
			this.angle %= TAU;
		}
	}

	updatePosition() {
		this.pos.x = this.orbitalRadius * Math.cos(this.angle) + this.primary.pos.x;
		this.pos.y = this.orbitalRadius * Math.sin(this.angle) + this.primary.pos.y;
	}

	render(viewport) {
		const ctx = viewport.ctx;
		const screenPos = viewport.toScreenCoords(this.pos.x, this.pos.y);
		ctx.beginPath();
    ctx.arc(
      screenPos.x,
      screenPos.y,
      this.radius,
      0,
      TAU,
      false
     );

    ctx.strokeStyle = this.atmoColor;
    ctx.lineWidth = this.atmoSize;
    ctx.stroke();
    ctx.fillStyle = this.bodyColor;
    ctx.fill();

		ctx.fillStyle = 'white';
		ctx.font = '12px serif';
		ctx.fillText(this.name, screenPos.x - 20, screenPos.y + 20);
	}
}
