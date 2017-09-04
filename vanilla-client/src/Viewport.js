
export default class Viewport {
	constructor(width, height) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');

		this.bgColor = '#111111';
		this.position = {
			x: 0,
			y: 0
		};

		this.center = {
			x: Math.floor(width/2),
			y: Math.floor(height/2)
		};

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

		this.zoomSpeed = 0.2;

		this.dirty = true;

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
		if(this.dirty){
			this.updateTransform();
		}

		this.ctx.setTransform(...this.transform.current);
	}

	updateTransform() {
		this.dirty = false;
		this.transform.current[0] = this.scale.current;
		this.transform.current[1] = 0;
		this.transform.current[2] = 0;
		this.transform.current[3] = this.scale.current;
		this.transform.current[4] = -(this.position.x * this.transform.current[0] + this.position.y * this.transform.current[2]);
		this.transform.current[5] = -(this.position.x * this.transform.current[1] + this.position.y * this.transform.current[3]);

		this.scale.inverse = 1 / this.scale.current;
		// calculate the inverse transformation
		const cross = this.transform.current[0] * this.transform.current[3] - this.transform.current[1] * this.transform.current[2];
		this.transform.inverse[0] =  this.transform.current[3] / cross;
		this.transform.inverse[1] = -this.transform.current[1] / cross;
		this.transform.inverse[2] = -this.transform.current[2] / cross;
		this.transform.inverse[3] =  this.transform.current[0] / cross;
		this.transform.inverse[4] = (this.transform.current[1] * this.transform.current[5] - this.transform.current[3] * this.transform.current[4]) / cross;
    this.transform.inverse[5] = (this.transform.current[2] * this.transform.current[4] - this.transform.current[0] * this.transform.current[5]) / cross;
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
		if (this.dirty) {
			this.updateTransform();
		}
		return {
			x: x * this.transform.current[0] + y * this.transform.current[2] + this.transform.current[4],
			y: x * this.transform.current[1] + y * this.transform.current[3] + this.transform.current[5]
		};
  }

	toWorldCoords(x, y) {
		if (this.dirty) {
			this.updateTransform();
		}
		const xx = x - this.transform.current[4];
		const yy = y - this.transform.current[5];
		return {
			x: xx * this.transform.inverse[0] + yy * this.transform.inverse[2],
      y: xx * this.transform.inverse[1] + yy * this.transform.inverse[3]
		};
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
		this.dirty = true;
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
		if (this.dirty) {
			this.updateTransform();
		}
		let amount = Math.exp((delta / 120) * this.zoomSpeed);
		this.scale.current *= amount;
		console.log('scale is now', this.scale.current)
		this.position.x = x - (x - this.position.x) * amount;
		this.position.y = y - (y - this.position.y) * amount;
		this.dirty = true;
	}

	update() {
		// clear the whole canvas
		this.resetTransform();
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.strokeStyle = 'white';
		const { x: wx, y: wy } = this.toWorldCoords(0, 0);
		this.ctx.strokeRect(wx, wy, this.width, this.height);
		this.applyTransform();
		this.debugText();
		// draw all elements present on the viewport
		for (const elem of this.toRender) {
			elem.render(this);
		}
		this.resetTransform();
	}

	debugText() {
		this.ctx.fillStyle = '#fff';
		this.ctx.font = '15px serif';
		let { x, y } = this.toScreenCoords(10, 50);
		this.ctx.fillText(`Position: x: ${this.position.x} y: ${this.position.y}`, x, y);
		for (const elem of this.debug) {
			y += 15;
			elem.debugText(this, x, y);
		}
	}
}
