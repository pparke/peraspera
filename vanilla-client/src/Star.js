import { darken } from './util';
import config from '../config';
import System from './System';

const TAU = config.constants.TAU;

export default class Star {
	constructor({ id, name, description, mass, color, radius, starType, position }) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.mass = mass;
		this.starType = starType;
		this.coronaColor = color
		this.color = darken(color, 0.1);
		this.radius = radius;
		this.pos = {
			x: position.x,
			y: position.y
		};

		this.system = null;

		this.systemVisible = false;
	}

	update(dt) {
		if (this.systemVisible) {
			this.system.update(dt);
		}
	}

	render(viewport) {
		// don't draw if not on screen
		if (!viewport.onScreen(this.pos.x, this.pos.y)) {
			return;
		}
		const ctx = viewport.ctx;
		const screenPos = viewport.toScreenCoords(this.pos.x, this.pos.y);

		if (viewport.scale > 4.5) {
			if (this.system === null) {
				this.system = new System(this);
			}
			this.systemVisible = true;
			this.system.render(viewport);
			// TODO where will we add the system to the update loop?
		}
		const radiusMod = this.systemVisible ? 10 : 1;

		const corona = ctx.createRadialGradient(
			screenPos.x,
			screenPos.y,
			this.radius,
			screenPos.x,
			screenPos.y,
			this.radius * radiusMod * 1.3
		);
		corona.addColorStop(0, this.color);
		corona.addColorStop(0.2, this.coronaColor);
		corona.addColorStop(1, viewport.bgColor);
		ctx.beginPath();
		ctx.arc(
      screenPos.x,
      screenPos.y,
      this.radius * radiusMod * 1.3,
      0,
      TAU,
      false
     );
	 	ctx.fillStyle = corona;
		ctx.fill();

		if (!this.systemVisible) {
			ctx.fillStyle = 'white';
			ctx.font = '12px serif';
			ctx.fillText(this.name, screenPos.x - 20, screenPos.y + 20);
		}
	}
}
