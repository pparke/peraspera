
export default class Viewport {
	constructor(width, height, ctx) {
		if (ctx) {
			this.ctx = ctx;
			this.canvas = ctx.canvas;
		}
		else {
			this.canvas = document.createElement('canvas');
			this.canvas.width = width;
			this.canvas.height = height;
			this.ctx = this.canvas.getContext('2d');
		}

		this.bgColor = '#111111';
		this.position = {
			x: 0,
			y: 0
		};
		this.mousePos = {
			x: 0,
			y: 0
		}

		this.center = {
			x: Math.floor(width/2),
			y: Math.floor(height/2)
		};

		// horiz scaling, horiz skewing,
		// vert skewing, vert scaling,
		// horiz moving, vert moving
		this.transform = {
			default: [1,0,0,1,0,0],
			current: [1,0,0,1,0,0],
			inverse: [1,0,0,1,0,0]
		};

		this.scale = {
			current: 1.0,
			inverse: 1.0,
			min: 0.5,
			max: 100
		};

		this.rotate = 0;

		this.zoomSpeed = 0.5;

		this.toRender = new Set();
		this.debug = new Set();
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}

	get bounds() {

	}

	resetTransform() {
		this.ctx.setTransform(...this.transform.default);
	}

	applyTransform() {
		this.updateTransform();

		this.ctx.setTransform(...this.transform.current);
	}

	updateTransform() {
		const current = this.transform.current;
		const inverse = this.transform.inverse;
		const position = this.position;
		const scale = this.scale.current;
		const rotate = this.rotate;

		this.transform.current[0] = Math.cos(rotate) * scale; // horiz scale
		this.transform.current[1] = Math.sin(rotate) * scale;					// horiz skew
		this.transform.current[2] = -Math.sin(rotate) * scale;					// vert skew
		this.transform.current[3] = Math.cos(rotate) * scale;	// vert scale
		this.transform.current[4] = position.x;//-(position.x * current[0] + position.y * current[2]);
		this.transform.current[5] = position.y;//-(position.x * current[1] + position.y * current[3]);

		this.scale.inverse = 1 / scale;
		// calculate the inverse transformation
		const cross = current[0] * current[3] - current[1] * current[2];
		this.transform.inverse[0] =  current[3] / cross;
		this.transform.inverse[1] = -current[1] / cross;
		this.transform.inverse[2] = -current[2] / cross;
		this.transform.inverse[3] =  current[0] / cross;
	}

	addToRender(elem) {
		this.toRender.add(elem);
	}

	removeToRender(elem) {
		this.toRender.delete(elem);
	}

	addToDebug(elem) {
		this.debug.add(elem);
	}

	removeToDebug(elem) {
		this.debug.delete(elem);
	}

	toScreenCoords(x, y) {
		return {
			x: x + this.position.x, //x * this.transform.current[0] + y * this.transform.current[2] + this.transform.current[4],
			y: y + this.position.y //x * this.transform.current[1] + y * this.transform.current[3] + this.transform.current[5]
		};
  }

	toWorldCoords(x, y) {
		// remove the translation by substracting the origin
		const xx = x - this.transform.current[4];
		const yy = y - this.transform.current[5];

		const inverse = this.transform.inverse;

		const coords = {
			x: xx * inverse[0] + yy * inverse[2],
			y: xx * inverse[1] + yy * inverse[3]
		};

		return coords;
	}

	onScreen(x, y) {
		let { sx, sy } = this.toWorldCoords(x, y);
		return !(
			sx < this.position.x ||
			sx > this.position.x + this.width * this.scale.current ||
			sy < this.position.y ||
			sy > this.position.y + this.height * this.scale.current
		);
	}

	move(x, y) {
		this.position.x += x;
		this.position.y += y;
	}

	onDragStart(x, y) {
		this.dragStart = { x, y };
	}

	onDrag(mouse) {
		const { x, y } = mouse.pos;
		const { x: lx, y: ly } = mouse.lastPos;
		const diffX = x - lx;
		const diffY = y - ly;
		this.move(diffX, diffY);
	}

	zoom(delta, x, y) {
		let amount = Math.exp((delta / 120) * this.zoomSpeed);
		this.scale.current *= amount;
		this.position.x = x - (x - this.position.x) * amount;
		this.position.y = y - (y - this.position.y) * amount;
	}

	update() {
		// reset transform to clear
		this.resetTransform();

		// clear the whole canvas
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.strokeStyle = 'white';
		this.debugText();

		// change back to the current transform
		this.applyTransform();

		// draw a circle where the world coords of the mouse are
		this.ctx.arc(this.mousePos.x, this.mousePos.y, 10, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = 'yellow';
		this.ctx.fill();
		// draw all elements present on the viewport
		for (const elem of this.toRender) {
			elem.render(this);
		}
	}

	debugText() {
		this.ctx.fillStyle = '#fff';
		this.ctx.font = '15px serif';
		let x = 10;
		let y = 50;
		this.ctx.fillText(`Position: x: ${this.position.x} y: ${this.position.y}`, x, y);
		y += 15;
		const tc = this.transform.current;
		this.ctx.fillText(`Transform: a: ${tc[0]} b: ${tc[1]} c: ${tc[2]} d: ${tc[3]} e: ${tc[4]} f: ${tc[5]}`, x, y)
		for (const elem of this.debug) {
			y += 15;
			elem.debugText(this, x, y);
		}
	}
}
