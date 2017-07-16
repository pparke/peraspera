
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

		this.toRender = new Set();
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}

	addToRender(elem) {
		this.toRender.add(elem);
	}

	removeToRender(elem) {
		this.toRender.delete(elem);
	}

	toScreenCoords(x, y) {
    return {
      x: x - this.position.x,
      y: y - this.position.y
    };
  }

	move(x, y) {
		this.position.x += x;
		this.position.y += y;
	}

	update() {
		// clear the whole canvas
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		// draw all elements present on the viewport
		for (const elem of this.toRender) {
			elem.render(this);
		}
	}
}
